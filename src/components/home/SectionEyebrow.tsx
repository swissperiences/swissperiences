import { cn } from "@/lib/utils";

/**
 * The standard editorial section label. One place to keep tracking, size and
 * opacity consistent — the old homepage drifted between 9px and 10px at
 * varying opacities.
 */
export default function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("block text-[11px] uppercase tracking-[0.3em] text-white/45", className)}>
      {children}
    </span>
  );
}
