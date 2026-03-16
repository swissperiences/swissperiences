"""Reel Forge — Configuration constants."""

from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────
ROOT_DIR = Path(__file__).parent
ASSETS_DIR = ROOT_DIR / "assets"
DEFAULT_OUTPUT_DIR = ROOT_DIR / "output"

# ── Output specs ───────────────────────────────────────────────────
TARGET_WIDTH = 1080
TARGET_HEIGHT = 1920
TARGET_ASPECT = (9, 16)
TARGET_FPS = 30

# Duration range for reels (seconds)
MIN_DURATION = 25
MAX_DURATION = 45
DEFAULT_DURATION = 35

# ── Encoding ───────────────────────────────────────────────────────
VIDEO_CODEC = "libx264"
VIDEO_CRF = 18          # High quality, ~8-12 MB per 30s clip
VIDEO_PRESET = "slow"    # Better compression, slower encode
VIDEO_PROFILE = "high"
VIDEO_LEVEL = "4.0"
PIXEL_FORMAT = "yuv420p"  # Instagram compatibility

AUDIO_CODEC = "aac"
AUDIO_BITRATE = "192k"
AUDIO_SAMPLE_RATE = 44100

# ── Watermark ──────────────────────────────────────────────────────
WATERMARK_TEXT = "SWISSPERIENCES"
WATERMARK_FONT = "Inter"
WATERMARK_FONTSIZE = 24
WATERMARK_OPACITY = 0.15
WATERMARK_MARGIN_X = 40
WATERMARK_MARGIN_Y = 40

# ── Color grading ──────────────────────────────────────────────────
# Alpine cold: blue shadows, clean whites, slight desaturation
GRADE_COLD = {
    "brightness": 0.02,
    "contrast": 1.12,
    "saturation": 0.90,
    "gamma_b": 1.08,     # Push blues in shadows
    "gamma_r": 0.95,     # Reduce warmth
}

# Golden hour: warm highlights, cold shadows for contrast
GRADE_GOLDEN = {
    "brightness": 0.03,
    "contrast": 1.10,
    "saturation": 0.95,
    "gamma_b": 1.05,
    "gamma_r": 1.08,     # Add warmth to highlights
}

# ── Segment detection ──────────────────────────────────────────────
ANALYSIS_SCALE = 0.25        # Analyze at 1/4 resolution
FRAME_SAMPLE_INTERVAL = 5    # Sample every 5th frame
STABILITY_WEIGHT = 0.5
SHARPNESS_WEIGHT = 0.3
SCENIC_WEIGHT = 0.2
SLIDING_WINDOW_STEP = 5     # Seconds between candidate windows

# ── Subtitles ──────────────────────────────────────────────────────
SUBTITLE_FONT = "Inter"
SUBTITLE_FONTSIZE = 42
SUBTITLE_COLOR = "white"
SUBTITLE_OUTLINE_COLOR = "black"
SUBTITLE_OUTLINE_WIDTH = 2
SPEECH_MIN_DURATION = 2.0     # Min seconds of speech to trigger subtitles
SPEECH_CONFIDENCE_THRESHOLD = 0.6

# ── Supported formats ─────────────────────────────────────────────
VIDEO_EXTENSIONS = {".mp4", ".mov", ".MP4", ".MOV"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".heic", ".png", ".JPG", ".JPEG", ".HEIC", ".PNG"}
