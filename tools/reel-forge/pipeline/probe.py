"""Step 1: Extract metadata from video files using ffprobe."""

import json
import subprocess
from pathlib import Path
from typing import Optional


def probe_file(path: Path) -> Optional[dict]:
    """Extract metadata from a video file.

    Returns dict with: path, filename, duration, width, height,
    codec, fps, rotation, size_mb, is_portrait.
    """
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                str(path),
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        data = json.loads(result.stdout)
    except (subprocess.TimeoutExpired, json.JSONDecodeError, FileNotFoundError) as e:
        print(f"    Probe failed for {path.name}: {e}")
        return None

    # Find the video stream
    video_stream = None
    for stream in data.get("streams", []):
        if stream.get("codec_type") == "video":
            video_stream = stream
            break

    if not video_stream:
        print(f"    No video stream found in {path.name}")
        return None

    # Extract dimensions
    width = int(video_stream.get("width", 0))
    height = int(video_stream.get("height", 0))

    # Check rotation (iPhone videos may be rotated)
    rotation = 0
    if "tags" in video_stream:
        rotation = int(video_stream["tags"].get("rotate", 0))
    # Also check side_data for rotation
    for sd in video_stream.get("side_data_list", []):
        if "rotation" in sd:
            rotation = abs(int(sd["rotation"]))

    # If rotated 90/270, swap dimensions for effective size
    effective_width = width
    effective_height = height
    if rotation in (90, 270):
        effective_width, effective_height = height, width

    # Duration
    duration = float(data.get("format", {}).get("duration", 0))
    if duration == 0:
        duration = float(video_stream.get("duration", 0))

    # FPS
    fps_str = video_stream.get("r_frame_rate", "30/1")
    try:
        num, den = fps_str.split("/")
        fps = round(int(num) / int(den), 2)
    except (ValueError, ZeroDivisionError):
        fps = 30.0

    # File size
    size_bytes = path.stat().st_size
    size_mb = round(size_bytes / (1024 * 1024), 1)

    # Codec
    codec = video_stream.get("codec_name", "unknown")

    # Has audio?
    has_audio = any(
        s.get("codec_type") == "audio"
        for s in data.get("streams", [])
    )

    return {
        "path": path,
        "filename": path.name,
        "duration": round(duration, 1),
        "width": effective_width,
        "height": effective_height,
        "raw_width": width,
        "raw_height": height,
        "codec": codec,
        "fps": fps,
        "rotation": rotation,
        "size_mb": size_mb,
        "is_portrait": effective_height > effective_width,
        "has_audio": has_audio,
    }


def format_duration(seconds: float) -> str:
    """Format seconds as MM:SS."""
    m = int(seconds) // 60
    s = int(seconds) % 60
    return f"{m}:{s:02d}"


def print_summary(results: list[dict]):
    """Print a formatted table of probed clips."""
    if not results:
        print("  No clips found.")
        return

    # Header
    print(f"  {'#':<3} {'File':<35} {'Duration':>8} {'Resolution':>12} {'FPS':>5} {'Codec':>6} {'Size':>8} {'Orient':>8}")
    print(f"  {'─'*3} {'─'*35} {'─'*8} {'─'*12} {'─'*5} {'─'*6} {'─'*8} {'─'*8}")

    total_duration = 0
    total_size = 0

    for i, r in enumerate(results, 1):
        dur_str = format_duration(r["duration"])
        res_str = f"{r['width']}x{r['height']}"
        orient = "portrait" if r["is_portrait"] else "landscape"
        rot = f" (R{r['rotation']})" if r["rotation"] else ""

        print(
            f"  {i:<3} {r['filename']:<35} {dur_str:>8} {res_str:>12} "
            f"{r['fps']:>5} {r['codec']:>6} {r['size_mb']:>6.1f}MB {orient}{rot}"
        )
        total_duration += r["duration"]
        total_size += r["size_mb"]

    print(f"  {'─'*3} {'─'*35} {'─'*8} {'─'*12} {'─'*5} {'─'*6} {'─'*8} {'─'*8}")
    print(
        f"  {'':3} {'TOTAL':<35} {format_duration(total_duration):>8} "
        f"{'':>12} {'':>5} {'':>6} {total_size:>6.1f}MB"
    )
    print()


if __name__ == "__main__":
    import sys
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    if target.is_file():
        info = probe_file(target)
        if info:
            print_summary([info])
    else:
        from config import VIDEO_EXTENSIONS
        files = sorted(f for f in target.iterdir() if f.suffix in VIDEO_EXTENSIONS)
        results = [r for f in files if (r := probe_file(f))]
        print_summary(results)
