export default function GlobalVideoBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        className="h-full w-full object-cover"
      >
        <source src="/hero-fpv.mp4" type="video/mp4" />
      </video>
      {/* Subtle gradient overlay for depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" />
    </div>
  );
}
