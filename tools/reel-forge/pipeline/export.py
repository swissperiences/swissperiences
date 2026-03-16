"""Step 7: Final assembly — chain all filters and export h.264 MP4.

Combines: trim → crop → grade → watermark into a single ffmpeg pass.
Uses filter_complex for watermark overlay (requires 2 inputs).
"""

import subprocess
from pathlib import Path

from config import (
    AUDIO_BITRATE,
    AUDIO_CODEC,
    AUDIO_SAMPLE_RATE,
    PIXEL_FORMAT,
    TARGET_FPS,
    VIDEO_CODEC,
    VIDEO_CRF,
    VIDEO_LEVEL,
    VIDEO_PRESET,
    VIDEO_PROFILE,
)
from pipeline.watermark import get_watermark_path, build_watermark_filter


def export_reel(
    input_path: Path,
    output_path: Path,
    start: float,
    end: float,
    crop: dict,
    grade_filters: str,
    watermark_filter: str,
    preview: bool = False,
) -> bool:
    """Export the final Instagram Reel.

    Uses filter_complex to handle the watermark overlay (2 inputs).
    """
    duration = end - start
    watermark_path = get_watermark_path()
    use_watermark = watermark_path is not None and watermark_path.exists()

    # Build the video filter chain (crop + fps + grade)
    vf_parts = []
    vf_parts.extend(crop["filters"])
    vf_parts.append(f"fps={TARGET_FPS}")
    if grade_filters:
        vf_parts.append(grade_filters)

    if use_watermark:
        # Use filter_complex with 2 inputs: [0] video, [1] watermark PNG
        vf_chain = ",".join(vf_parts)
        wm_overlay = build_watermark_filter()

        filter_complex = (
            f"[0:v]{vf_chain}[graded];"
            f"[graded][1:v]{wm_overlay}[out]"
        )

        cmd = [
            "ffmpeg",
            "-y",
            "-ss", str(start),
            "-t", str(duration),
            "-i", str(input_path),
            "-i", str(watermark_path),
            "-filter_complex", filter_complex,
            "-map", "[out]",
            "-map", "0:a?",
        ]
    else:
        # No watermark — simple -vf chain
        vf_chain = ",".join(vf_parts)
        cmd = [
            "ffmpeg",
            "-y",
            "-ss", str(start),
            "-t", str(duration),
            "-i", str(input_path),
            "-vf", vf_chain,
        ]

    # Encoding settings
    if preview:
        cmd.extend([
            "-c:v", VIDEO_CODEC,
            "-crf", "28",
            "-preset", "ultrafast",
            "-pix_fmt", PIXEL_FORMAT,
        ])
    else:
        cmd.extend([
            "-c:v", VIDEO_CODEC,
            "-crf", str(VIDEO_CRF),
            "-preset", VIDEO_PRESET,
            "-profile:v", VIDEO_PROFILE,
            "-level:v", VIDEO_LEVEL,
            "-pix_fmt", PIXEL_FORMAT,
        ])

    # Audio (keep ambient sound)
    cmd.extend([
        "-c:a", AUDIO_CODEC,
        "-b:a", AUDIO_BITRATE,
        "-ar", str(AUDIO_SAMPLE_RATE),
    ])

    # Metadata
    cmd.extend([
        "-metadata", "title=Swissperiences Reel",
        "-metadata", "artist=Swissperiences",
        "-movflags", "+faststart",
    ])

    cmd.append(str(output_path))

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600,
        )

        if result.returncode != 0:
            error_lines = result.stderr.strip().split("\n")[-10:]
            print(f"    Export failed:")
            for line in error_lines:
                print(f"      {line}")
            return False

        return True

    except subprocess.TimeoutExpired:
        print(f"    Export timed out (>10 min)")
        return False
    except Exception as e:
        print(f"    Export error: {e}")
        return False


def generate_thumbnail(
    input_path: Path,
    output_path: Path,
    timestamp: float,
) -> bool:
    """Extract a single frame as JPEG thumbnail."""
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(timestamp),
        "-i", str(input_path),
        "-frames:v", "1",
        "-q:v", "2",
        str(output_path),
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return result.returncode == 0
    except Exception:
        return False
