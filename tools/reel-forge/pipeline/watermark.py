"""Step 5: SWISSPERIENCES watermark overlay.

Uses a pre-generated PNG + ffmpeg overlay filter.
The watermark PNG is in assets/watermark.png (semi-transparent white text).
"""

from pathlib import Path

from config import ASSETS_DIR, WATERMARK_MARGIN_X, WATERMARK_MARGIN_Y


WATERMARK_PATH = ASSETS_DIR / "watermark.png"


def get_watermark_path() -> Path:
    """Return path to the watermark PNG. Generate if missing."""
    if WATERMARK_PATH.exists():
        return WATERMARK_PATH

    # Auto-generate if missing
    try:
        from PIL import Image, ImageDraw, ImageFont

        width, height = 300, 40
        img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
        except Exception:
            font = ImageFont.load_default()
        draw.text((0, 8), "SWISSPERIENCES", fill=(255, 255, 255, 40), font=font)
        img.save(str(WATERMARK_PATH))
    except ImportError:
        print("    Warning: Pillow not installed, watermark will be skipped")
        return None

    return WATERMARK_PATH


def build_watermark_filter() -> str:
    """Build ffmpeg overlay expression for watermark positioning.

    The actual overlay filter is assembled in export.py since it
    requires a second input. This returns just the position expression.
    """
    x = f"W-w-{WATERMARK_MARGIN_X}"
    y = f"H-h-{WATERMARK_MARGIN_Y}"
    return f"overlay={x}:{y}"


if __name__ == "__main__":
    wm = get_watermark_path()
    print(f"Watermark path: {wm}")
    print(f"Overlay filter: {build_watermark_filter()}")
