import { useRef, useState, useEffect } from 'react';

interface HeroVideoPlayerProps {
  className?: string;
}

export function HeroVideoPlayer({ className = '' }: HeroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Elegant loading spinner */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            {/* Loading text */}
            <p className="text-white/60 text-sm font-light tracking-wider uppercase">
              Loading Experience
            </p>
          </div>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
      >
        {/* AV1 for maximum compression - 9.3MB (Chrome 90+, Edge 90+, Opera 77+) */}
        <source src="/videos/hero-av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
        {/* WebM/VP9 fallback - 11MB (Chrome, Firefox, Edge) */}
        <source src="/videos/hero-optimized.webm" type="video/webm" />
        {/* H.264 fallback for Safari/older browsers - 17MB */}
        <source src="/videos/hero-final.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}
