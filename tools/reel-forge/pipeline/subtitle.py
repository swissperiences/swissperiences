"""Step 6: Speech detection and subtitle burn-in.

Uses ffmpeg audio analysis to detect speech presence.
If speech is found, generates simple white subtitles.

Note: Full whisper-based transcription is optional (requires
faster-whisper pip package). Without it, this module just detects
whether audio has speech-like content using volume/frequency analysis.
"""

import subprocess
from pathlib import Path

from config import SPEECH_MIN_DURATION


def detect_speech(path: Path, start: float, end: float) -> bool:
    """Quick check: does this segment contain speech?

    Uses ffmpeg silencedetect to find non-silent portions.
    If the clip has sustained non-silent audio, it likely has speech.
    For drone footage, this will almost always return False (just wind).
    """
    try:
        result = subprocess.run(
            [
                "ffmpeg",
                "-ss", str(start),
                "-t", str(end - start),
                "-i", str(path),
                "-af", "silencedetect=noise=-30dB:d=0.5",
                "-f", "null",
                "-",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

        # Parse silence detection output
        # If most of the clip is NOT silent, there might be speech
        silence_durations = []
        for line in result.stderr.split("\n"):
            if "silence_duration:" in line:
                try:
                    dur = float(line.split("silence_duration:")[1].strip())
                    silence_durations.append(dur)
                except (IndexError, ValueError):
                    pass

        total_silence = sum(silence_durations)
        clip_duration = end - start
        speech_duration = clip_duration - total_silence

        # If more than SPEECH_MIN_DURATION of non-silence, flag as speech
        return speech_duration >= SPEECH_MIN_DURATION

    except (subprocess.TimeoutExpired, Exception):
        return False


def build_subtitle_filter(srt_path: Path) -> str:
    """Build ffmpeg subtitles filter for burning in an SRT file.

    Style: white text, semi-bold, bottom center, small black outline.
    """
    # Escape path for ffmpeg filter (colons and backslashes)
    escaped_path = str(srt_path).replace(":", "\\:").replace("\\", "\\\\")

    return (
        f"subtitles='{escaped_path}'"
        f":force_style='FontName=Helvetica,FontSize=22,"
        f"PrimaryColour=&HFFFFFF&,OutlineColour=&H40000000&,"
        f"Outline=2,Shadow=0,Alignment=2,MarginV=60'"
    )


if __name__ == "__main__":
    import sys
    from probe import probe_file

    target = Path(sys.argv[1])
    info = probe_file(target)
    if info:
        has_speech = detect_speech(target, 0, min(30, info["duration"]))
        print(f"  Speech detected: {has_speech}")
