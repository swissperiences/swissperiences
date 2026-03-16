#!/usr/bin/env python3
"""
Reel Forge — Turn raw drone footage into Instagram-ready Reels.

Usage:
    python cli.py scan   --input-dir /path/to/clips
    python cli.py process --input-dir /path/to/clips [--output-dir ./output]
    python cli.py preview --input-dir /path/to/single_clip.mp4
"""

import argparse
import sys
import time
from pathlib import Path

from config import (
    DEFAULT_DURATION,
    DEFAULT_OUTPUT_DIR,
    MAX_DURATION,
    MIN_DURATION,
    VIDEO_EXTENSIONS,
)


def discover_files(input_dir: Path) -> list[Path]:
    """Find all video files in the input directory."""
    if input_dir.is_file():
        if input_dir.suffix in VIDEO_EXTENSIONS:
            return [input_dir]
        print(f"  Not a video file: {input_dir}")
        return []

    files = []
    for ext in VIDEO_EXTENSIONS:
        files.extend(input_dir.rglob(f"*{ext}"))
    # Sort by name for consistent ordering
    return sorted(set(files))


def cmd_scan(args):
    """Scan input folder and display metadata for all clips."""
    from pipeline.probe import probe_file, print_summary

    input_path = Path(args.input_dir).expanduser().resolve()
    files = discover_files(input_path)

    if not files:
        print(f"  No video files found in {input_path}")
        sys.exit(1)

    print(f"\n  Scanning {len(files)} video(s) in {input_path}\n")
    results = []
    for f in files:
        info = probe_file(f)
        if info:
            results.append(info)

    print_summary(results)
    return results


def cmd_process(args):
    """Full pipeline: segment → crop → grade → watermark → export."""
    from pipeline.probe import probe_file
    from pipeline.segment import select_best_segment
    from pipeline.crop import compute_crop
    from pipeline.grade import build_grade_filters
    from pipeline.export import export_reel

    input_path = Path(args.input_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    files = discover_files(input_path)
    if not files:
        print(f"  No video files found in {input_path}")
        sys.exit(1)

    grade = args.grade or "cold"
    duration = args.duration or DEFAULT_DURATION
    duration = max(MIN_DURATION, min(MAX_DURATION, duration))

    print(f"\n  Processing {len(files)} video(s)")
    print(f"  Grade: {grade} | Target: {duration}s | Output: {output_dir}\n")

    results = []
    for i, f in enumerate(files, 1):
        print(f"  [{i}/{len(files)}] {f.name}")
        t0 = time.time()

        # Step 1: Probe
        info = probe_file(f)
        if not info:
            print(f"    Skipped (probe failed)")
            continue

        # Step 2: Select segment
        if args.start is not None:
            start = args.start
            end = args.end or (start + duration)
        else:
            start, end = select_best_segment(f, info, duration)
        actual_duration = end - start
        print(f"    Segment: {start:.1f}s → {end:.1f}s ({actual_duration:.1f}s)")

        # Step 3: Compute crop
        crop_params = compute_crop(
            f, info, start, end,
            center_only=args.crop_center
        )
        print(f"    Crop: {crop_params['strategy']}")

        # Step 4: Build filter chain
        grade_filters = build_grade_filters(grade)

        # Step 5: Export
        output_name = f"{f.stem}_reel_{grade}.mp4"
        output_path = output_dir / output_name

        success = export_reel(
            input_path=f,
            output_path=output_path,
            start=start,
            end=end,
            crop=crop_params,
            grade_filters=grade_filters,
            watermark_filter="",  # handled internally by export.py
            preview=args.preview if hasattr(args, 'preview') else False,
        )

        elapsed = time.time() - t0
        if not success or not output_path.exists():
            print(f"    FAILED ({elapsed:.1f}s)")
            continue

        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"    Exported: {output_name} ({size_mb:.1f} MB, {elapsed:.1f}s)")
        results.append({
            "input": f.name,
            "output": output_name,
            "segment": f"{start:.1f}–{end:.1f}s",
            "size_mb": round(size_mb, 1),
            "time_s": round(elapsed, 1),
        })

    # Summary
    print(f"\n  Done! {len(results)}/{len(files)} videos processed.")
    print(f"  Output: {output_dir}\n")
    for r in results:
        print(f"    {r['input']} → {r['output']} ({r['size_mb']} MB)")
    print()


def cmd_preview(args):
    """Quick low-res preview of segment selection + crop."""
    args.preview = True
    args.grade = args.grade or "cold"
    args.duration = args.duration or DEFAULT_DURATION
    args.start = getattr(args, 'start', None)
    args.end = getattr(args, 'end', None)
    args.crop_center = getattr(args, 'crop_center', False)
    if not hasattr(args, 'output_dir') or args.output_dir is None:
        args.output_dir = str(DEFAULT_OUTPUT_DIR / "preview")
    cmd_process(args)


def main():
    parser = argparse.ArgumentParser(
        prog="reel-forge",
        description="Turn raw drone footage into Instagram-ready Reels.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # ── scan ───────────────────────────────────────────────────────
    p_scan = subparsers.add_parser("scan", help="Scan folder and show clip metadata")
    p_scan.add_argument("--input-dir", required=True, help="Folder or file to scan")

    # ── process ────────────────────────────────────────────────────
    p_proc = subparsers.add_parser("process", help="Process clips into Reels")
    p_proc.add_argument("--input-dir", required=True, help="Folder or file to process")
    p_proc.add_argument("--output-dir", default=str(DEFAULT_OUTPUT_DIR))
    p_proc.add_argument("--grade", choices=["cold", "golden"], default="cold")
    p_proc.add_argument("--duration", type=int, default=DEFAULT_DURATION)
    p_proc.add_argument("--start", type=float, default=None, help="Manual start time (seconds)")
    p_proc.add_argument("--end", type=float, default=None, help="Manual end time (seconds)")
    p_proc.add_argument("--crop-center", action="store_true", help="Force center crop")
    p_proc.add_argument("--dry-run", action="store_true", help="Show plan without encoding")

    # ── preview ────────────────────────────────────────────────────
    p_prev = subparsers.add_parser("preview", help="Quick low-res preview")
    p_prev.add_argument("--input-dir", required=True, help="Folder or file to preview")
    p_prev.add_argument("--output-dir", default=None)
    p_prev.add_argument("--grade", choices=["cold", "golden"], default="cold")
    p_prev.add_argument("--duration", type=int, default=DEFAULT_DURATION)
    p_prev.add_argument("--start", type=float, default=None)
    p_prev.add_argument("--end", type=float, default=None)
    p_prev.add_argument("--crop-center", action="store_true")

    args = parser.parse_args()

    if args.command == "scan":
        cmd_scan(args)
    elif args.command == "process":
        cmd_process(args)
    elif args.command == "preview":
        cmd_preview(args)


if __name__ == "__main__":
    main()
