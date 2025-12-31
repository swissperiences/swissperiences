export default function GlobalVideoBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        loading="lazy"
        className="h-full w-full object-cover"
      >
        <source src="/hero-video-v2.mp4" type="video/mp4" />
      </video>
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
