import { Composition } from "remotion";
import { PackagePromo } from "./PackagePromo";
import { LavauxReel } from "./LavauxReel";
import { packages } from "./data";
import type { PackagePromoProps } from "./types";

const FPS = 30;
const DURATION_SECONDS = 32;
const WIDTH = 1080;
const HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Lavaux drone reel — hook + outro */}
      <Composition
        id="lavaux-reel"
        component={LavauxReel}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Package promo reels */}
      {packages.map((pkg) => (
        <Composition<PackagePromoProps>
          key={pkg.id}
          id={pkg.id}
          component={PackagePromo}
          durationInFrames={DURATION_SECONDS * FPS}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            packageName: pkg.name,
            tagline: pkg.tagline,
            price: pkg.price,
            duration: pkg.duration,
            includes: pkg.previewIncludes,
            availability: pkg.availability,
            droneClipSrc: pkg.droneClip,
            clipStartFrom: 0,
          }}
        />
      ))}
    </>
  );
};
