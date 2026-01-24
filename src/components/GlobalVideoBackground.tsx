import { HeroVideoPlayer } from './HeroVideoPlayer';

export default function GlobalVideoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <HeroVideoPlayer className="w-full h-full" />
    </div>
  );
}
