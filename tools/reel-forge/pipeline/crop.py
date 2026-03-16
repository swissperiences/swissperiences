"""Step 3: Smart crop from landscape to portrait (9:16).

If the source is already portrait (like DJI vertical mode), just scale.
If landscape, extract a vertical strip using center-weighted cropping.

Note: ffmpeg 8+ auto-rotates based on metadata, so we do NOT manually
transpose. We just work with the effective (post-rotation) dimensions.
"""

from pathlib import Path

from config import TARGET_HEIGHT, TARGET_WIDTH


def compute_crop(
    path: Path,
    info: dict,
    start: float,
    end: float,
    center_only: bool = False,
) -> dict:
    """Compute crop parameters to convert to 9:16 portrait.

    Returns a dict with:
      strategy: "scale_only" | "center_crop"
      filters: list of ffmpeg filter strings
    """
    # Use effective dimensions (already accounts for rotation metadata)
    src_w = info["width"]
    src_h = info["height"]
    is_portrait = info["is_portrait"]

    # ffmpeg 8+ auto-rotates — do NOT add manual transpose

    filters = []

    if is_portrait:
        # Source is portrait — just scale to target
        filters.append(f"scale={TARGET_WIDTH}:{TARGET_HEIGHT}:force_original_aspect_ratio=decrease")
        filters.append(f"pad={TARGET_WIDTH}:{TARGET_HEIGHT}:(ow-iw)/2:(oh-ih)/2:black")
        return {
            "strategy": "scale_only (portrait source)",
            "filters": filters,
        }

    # Source is landscape — need to crop to portrait
    crop_w = int(src_h * 9 / 16)
    crop_h = src_h

    if crop_w > src_w:
        crop_w = src_w
        crop_h = int(src_w * 16 / 9)

    x_offset = (src_w - crop_w) // 2
    y_offset = (src_h - crop_h) // 2

    filters.append(f"crop={crop_w}:{crop_h}:{x_offset}:{y_offset}")
    filters.append(f"scale={TARGET_WIDTH}:{TARGET_HEIGHT}")

    return {
        "strategy": "center_crop (landscape → portrait)" if not center_only else "center_crop",
        "filters": filters,
    }


if __name__ == "__main__":
    import sys
    from probe import probe_file

    target = Path(sys.argv[1])
    info = probe_file(target)
    if info:
        params = compute_crop(target, info, 0, info["duration"])
        print(f"  Strategy: {params['strategy']}")
        print(f"  Filters: {' → '.join(params['filters'])}")
