"""Step 4: Color grading — alpine cold or golden hour.

Uses ffmpeg eq, colorbalance, and curves filters.
No external LUT files needed — everything is inline.
"""

from config import GRADE_COLD, GRADE_GOLDEN


def build_grade_filters(grade_name: str = "cold") -> str:
    """Build an ffmpeg filter string for color grading.

    Args:
        grade_name: "cold" for alpine blue/white, "golden" for warm hour.

    Returns:
        A single ffmpeg filter string (comma-separated filter chain).
    """
    grade = GRADE_COLD if grade_name == "cold" else GRADE_GOLDEN

    filters = []

    # 1. Exposure/contrast adjustment
    eq_parts = []
    if grade.get("brightness"):
        eq_parts.append(f"brightness={grade['brightness']}")
    if grade.get("contrast"):
        eq_parts.append(f"contrast={grade['contrast']}")
    if grade.get("saturation"):
        eq_parts.append(f"saturation={grade['saturation']}")
    if grade.get("gamma_b"):
        eq_parts.append(f"gamma_b={grade['gamma_b']}")
    if grade.get("gamma_r"):
        eq_parts.append(f"gamma_r={grade['gamma_r']}")
    if eq_parts:
        filters.append(f"eq={':'.join(eq_parts)}")

    # 2. Color balance adjustments
    if grade_name == "cold":
        # Push shadows toward blue, reduce red in midtones
        filters.append("colorbalance=bs=0.08:bm=0.04:bh=0.02:rs=-0.05:rm=-0.03")
    else:
        # Golden: warm highlights, cool shadows for contrast
        filters.append("colorbalance=bs=0.05:bm=0.02:rh=0.08:gh=0.04:rs=-0.02")

    # 3. Curves for cinematic contrast (gentle S-curve)
    # Lift blacks slightly, roll off highlights
    filters.append("curves=preset=cross_process")
    # Override with a gentler curve
    filters.pop()  # Remove the preset
    filters.append(
        "curves="
        "r='0/0.02 0.25/0.22 0.5/0.50 0.75/0.78 1/0.98'"
        ":g='0/0.02 0.25/0.23 0.5/0.50 0.75/0.77 1/0.98'"
        ":b='0/0.04 0.25/0.24 0.5/0.52 0.75/0.78 1/0.97'"
    )

    # 4. Gentle sharpening for crispness
    filters.append("unsharp=3:3:0.4:3:3:0.0")

    return ",".join(filters)


def build_no_grade_filters() -> str:
    """Minimal processing — just auto white balance hint."""
    return "unsharp=3:3:0.3:3:3:0.0"


if __name__ == "__main__":
    print("Cold grade filters:")
    print(f"  {build_grade_filters('cold')}")
    print()
    print("Golden grade filters:")
    print(f"  {build_grade_filters('golden')}")
