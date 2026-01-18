import { useEffect, useState } from 'react';

export default function GlobalVideoBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        className="h-full w-full object-cover"
        style={{
          transform: `scale(${1 + scrollY * 0.0002})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <source src="/hero-fpv.mp4" type="video/mp4" />
      </video>
      {/* Subtle gradient overlay for depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" />
    </div>
  );
}
