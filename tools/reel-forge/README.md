# Reel Forge

Turn raw DJI drone footage into Instagram-ready Reels.

## What it does

- Scans a folder of drone clips and shows metadata
- Auto-selects the best 25-45s segment from each clip
- Scales/crops to 9:16 portrait (1080x1920)
- Applies alpine color grading (cold blue or golden hour)
- Adds a small semi-transparent SWISSPERIENCES watermark
- Exports h.264 MP4 optimized for Instagram

## Requirements

- Python 3.9+
- ffmpeg (`brew install ffmpeg`)
- Pillow (`pip3 install Pillow`)

## Usage

```bash
cd tools/reel-forge

# Scan clips and see metadata
python3 cli.py scan --input-dir /path/to/clips

# Process all clips (cold alpine grade)
python3 cli.py process --input-dir /path/to/clips --output-dir ./output/

# Process with golden hour grade
python3 cli.py process --input-dir /path/to/clips --grade golden

# Process a single clip with manual segment
python3 cli.py process --input-dir /path/to/clip.mp4 --start 10 --end 40

# Quick low-res preview
python3 cli.py preview --input-dir /path/to/clip.mp4
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--grade` | `cold` | Color grade: `cold` (alpine blue) or `golden` (warm hour) |
| `--duration` | `35` | Target duration in seconds (25-45) |
| `--start` | auto | Manual start time (seconds) |
| `--end` | auto | Manual end time (seconds) |
| `--crop-center` | off | Force center crop (skip smart crop) |
| `--output-dir` | `./output/` | Where to save the reels |

## Output

- 1080x1920 vertical MP4 (Instagram Reel format)
- h.264, CRF 18, ~8-25 MB per clip
- Original ambient audio preserved (add music in Instagram)
- SWISSPERIENCES watermark bottom-right
