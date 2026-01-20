import { HeroVideoPlayer } from './HeroVideoPlayer';

export default function GlobalVideoBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <HeroVideoPlayer className="w-full h-full" />
    </div>
  );
}
