"""Step 2: Select the best segment from a clip.

Uses ffmpeg scene detection and frame analysis to find the most
visually interesting and stable segment of the target duration.

For clips already shorter than or equal to target duration,
returns the full clip.
"""

import json
import subprocess
from pathlib import Path

from config import (
    DEFAULT_DURATION,
    MAX_DURATION,
    MIN_DURATION,
    SLIDING_WINDOW_STEP,
)


def select_best_segment(
    path: Path,
    info: dict,
    target_duration: float = DEFAULT_DURATION,
) -> tuple[float, float]:
    """Select the best segment from a video clip.

    Returns (start_seconds, end_seconds).
    """
    clip_duration = info["duration"]

    # Clip is already short enough — use the whole thing
    if clip_duration <= MAX_DURATION:
        return (0.0, clip_duration)

    # Clip is very short — use all of it
    if clip_duration <= MIN_DURATION:
        return (0.0, clip_duration)

    # Clamp target duration
    target = min(target_duration, clip_duration)
    target = max(MIN_DURATION, min(MAX_DURATION, target))

    # Strategy: use ffmpeg scene score to find the most interesting windows
    scores = _score_windows(path, clip_duration, target)

    if not scores:
        # Fallback: use the "golden third" (1/3 into the clip)
        start = clip_duration / 3
        end = start + target
        if end > clip_duration:
            end = clip_duration
            start = max(0, end - target)
        return (round(start, 1), round(end, 1))

    # Pick the window with the highest score
    best = max(scores, key=lambda x: x["score"])
    return (best["start"], best["end"])


def _score_windows(
    path: Path,
    clip_duration: float,
    target_duration: float,
) -> list[dict]:
    """Score candidate windows using ffmpeg's scene change detection.

    We extract scene change scores across the clip, then for each
    candidate window, compute a combined score based on:
    - Number of scene changes (visual variety, but not too many)
    - Avoidance of the first/last 10% (takeoff/landing)
    """
    # Get scene change scores from ffmpeg
    scene_scores = _detect_scene_changes(path)

    if not scene_scores:
        return []

    windows = []
    step = SLIDING_WINDOW_STEP

    # Avoid first and last 10% of clip (usually takeoff/landing for drones)
    safe_start = clip_duration * 0.10
    safe_end = clip_duration * 0.90

    t = safe_start
    while t + target_duration <= safe_end:
        window_start = t
        window_end = t + target_duration

        # Count scene changes in this window (visual variety)
        changes_in_window = sum(
            1 for ts, score in scene_scores
            if window_start <= ts <= window_end and score > 0.1
        )

        # Mean scene score in window (visual interest)
        scores_in_window = [
            score for ts, score in scene_scores
            if window_start <= ts <= window_end
        ]
        mean_score = sum(scores_in_window) / len(scores_in_window) if scores_in_window else 0

        # Bonus for being in the "golden zone" (middle third of clip)
        golden_center = clip_duration / 2
        distance_from_center = abs((window_start + window_end) / 2 - golden_center)
        center_bonus = 1.0 - (distance_from_center / (clip_duration / 2))

        # Penalize windows with too many scene changes (jerky)
        # Ideal: 1-3 scene changes in a 30s window
        variety_score = min(changes_in_window, 4) / 4.0
        if changes_in_window > 6:
            variety_score *= 0.5  # Too chaotic

        # Combined score
        combined = (
            0.4 * mean_score +
            0.3 * variety_score +
            0.3 * center_bonus
        )

        windows.append({
            "start": round(window_start, 1),
            "end": round(window_end, 1),
            "score": round(combined, 4),
            "scene_changes": changes_in_window,
        })

        t += step

    return windows


def _detect_scene_changes(path: Path) -> list[tuple[float, float]]:
    """Use ffmpeg to detect scene changes across a clip.

    Returns list of (timestamp, score) tuples.
    Score ranges 0-1 where higher = bigger visual change.
    """
    try:
        result = subprocess.run(
            [
                "ffmpeg",
                "-i", str(path),
                "-vf", "select='gte(scene,0)',metadata=print:file=-",
                "-vsync", "vfr",
                "-f", "null",
                "-",
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )

        scores = []
        current_pts = None

        for line in result.stderr.split("\n") + result.stdout.split("\n"):
            if "pts_time:" in line:
                try:
                    pts_str = line.split("pts_time:")[1].split()[0]
                    current_pts = float(pts_str)
                except (IndexError, ValueError):
                    pass
            if "lavfi.scene_score=" in line and current_pts is not None:
                try:
                    score_str = line.split("lavfi.scene_score=")[1].strip()
                    score = float(score_str)
                    scores.append((current_pts, score))
                except (IndexError, ValueError):
                    pass

        return scores

    except subprocess.TimeoutExpired:
        print("    Scene detection timed out, using fallback")
        return []
    except Exception as e:
        print(f"    Scene detection failed: {e}")
        return []


if __name__ == "__main__":
    import sys
    from probe import probe_file

    target = Path(sys.argv[1])
    info = probe_file(target)
    if info:
        start, end = select_best_segment(target, info)
        print(f"  Best segment: {start:.1f}s → {end:.1f}s ({end-start:.1f}s)")
