import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Video,
  staticFile,
  Img,
} from "remotion";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: lora } = loadLora("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

/*
 * Lavaux Reel — Hook + Outro
 *
 * Timeline (32s @ 30fps = 960 frames):
 *
 *   0-60    (0-2s)     Hook text: "Lavaux, Switzerland."
 *  60-780   (2-26s)    Pure drone footage (voice + IG auto-captions)
 * 780-870   (26-29s)   Outro: logo fade in
 * 870-930   (29-31s)   "Find us." + swissperiences.ch
 * 930-960   (31-32s)   Fade to black
 */

const FPS = 30;

// Timeline anchors
const VIDEO_FADE_IN = 15; // 0.5s — video fades in from black
const HOOK_IN = 10; // hook text starts slightly before video fully visible
const HOOK_OUT = 75; // 2.5s — hook fades out
const OUTRO_START = 780; // 26s — logo starts
const FINDUS_START = 840; // 28s
const URL_START = 870; // 29s
const FADE_OUT = 930; // 31s

export const LavauxReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Video fade in from black (prevents lag flash)
  const videoFadeIn = interpolate(frame, [0, VIDEO_FADE_IN], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Global fade out at the very end
  const globalFade = interpolate(
    frame,
    [FADE_OUT, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle ken burns zoom
  const videoScale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Drone footage — full duration */}
      <AbsoluteFill
        style={{
          transform: `scale(${videoScale})`,
          opacity: Math.min(videoFadeIn, globalFade),
        }}
      >
        <Video
          src={staticFile("lavaux-drone.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Hook — first 2 seconds */}
      <Hook frame={frame} fps={fps} />

      {/* Outro — last 6 seconds */}
      <Outro frame={frame} fps={fps} globalFade={globalFade} />
    </AbsoluteFill>
  );
};

// ─── HOOK: "Lavaux, Switzerland." ───────────────────────────
const Hook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Fade in after video starts loading, hold, fade out
  const fadeIn = interpolate(frame, [HOOK_IN, HOOK_IN + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [HOOK_OUT - 15, HOOK_OUT], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // Subtle slide up
  const translateY = interpolate(frame, [HOOK_IN, HOOK_IN + 25], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame > HOOK_OUT + 10) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 56px 220px",
      }}
    >
      {/* Location pill */}
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            textShadow: "0 1px 12px rgba(0,0,0,0.8)",
          }}
        >
          UNESCO World Heritage
        </div>
        <div
          style={{
            fontFamily: lora,
            fontSize: 48,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            textShadow: "0 2px 24px rgba(0,0,0,0.7)",
          }}
        >
          Lavaux, Switzerland.
        </div>
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: "#2E9090",
            marginTop: 4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── OUTRO: Logo + "Find us." + URL ────────────────────────
const Outro: React.FC<{
  frame: number;
  fps: number;
  globalFade: number;
}> = ({ frame, fps, globalFade }) => {
  if (frame < OUTRO_START - 30) return null;

  // Dark overlay fades in behind the outro
  const overlayOpacity = interpolate(
    frame,
    [OUTRO_START - 30, OUTRO_START + 30],
    [0, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo
  const logoProgress = spring({
    frame: frame - OUTRO_START,
    fps,
    config: { damping: 200 },
  });
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.9, 1]);

  // "Find us."
  const findProgress = spring({
    frame: frame - FINDUS_START,
    fps,
    config: { damping: 200 },
  });
  const findOpacity = interpolate(findProgress, [0, 1], [0, 0.7]);

  // URL
  const urlProgress = spring({
    frame: frame - URL_START,
    fps,
    config: { damping: 200 },
  });
  const urlOpacity = interpolate(urlProgress, [0, 1], [0, 0.5]);

  return (
    <>
      {/* Dark overlay for outro readability */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity * globalFade})`,
        }}
      />

      {/* Outro content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: globalFade,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#fff",
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            Swissperiences
          </div>

          {/* Teal accent line */}
          <div
            style={{
              width: interpolate(logoProgress, [0, 1], [0, 50]),
              height: 2,
              backgroundColor: "#2E9090",
            }}
          />

          {/* Find us. */}
          <div
            style={{
              fontFamily: lora,
              fontSize: 28,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#fff",
              opacity: findOpacity,
              marginTop: 8,
            }}
          >
            Find us.
          </div>

          {/* URL */}
          <div
            style={{
              fontFamily: inter,
              fontSize: 16,
              fontWeight: 300,
              letterSpacing: 3,
              color: "#fff",
              opacity: urlOpacity,
              marginTop: 4,
            }}
          >
            swissperiences.ch
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};
