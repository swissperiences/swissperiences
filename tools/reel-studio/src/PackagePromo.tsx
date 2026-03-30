import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Sequence,
  AbsoluteFill,
  Video,
} from "remotion";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import type { PackagePromoProps } from "./types";

// Load fonts (matches site: Lora for headings, Inter for body)
const { fontFamily: loraFamily } = loadLora("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["300", "400", "600"],
  subsets: ["latin"],
});

/*
 * Timeline (32s @ 30fps = 960 frames):
 *
 *   0-30    (0-1s)     Black fade-in from drone footage
 *  30-150   (1-5s)     Package name + tagline entrance
 * 150-180   (5-6s)     Divider line draws
 * 180-480   (6-16s)    Includes appear one by one (staggered)
 * 480-600   (16-20s)   Price + duration reveal
 * 600-750   (20-25s)   Availability badge
 * 750-870   (25-29s)   Watermark / CTA: swissperiences.ch
 * 870-960   (29-32s)   Fade to black
 */

const FADE_IN_END = 30;
const NAME_START = 30;
const TAGLINE_START = 60;
const DIVIDER_START = 150;
const INCLUDES_START = 180;
const INCLUDES_STAGGER = 25; // frames between each include
const PRICE_START = 480;
const AVAILABILITY_START = 600;
const CTA_START = 750;
const FADE_OUT_START = 870;

export const PackagePromo: React.FC<PackagePromoProps> = ({
  packageName,
  tagline,
  price,
  duration,
  includes,
  availability,
  droneClipSrc,
  clipStartFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Global fade in/out
  const fadeIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [FADE_OUT_START, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = Math.min(fadeIn, fadeOut);

  // Gradient overlay — dark at bottom for text readability
  const gradientStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.85) 100%)",
  };

  // Subtle zoom on drone footage
  const videoScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Drone footage background */}
      <AbsoluteFill
        style={{
          opacity: globalOpacity,
          transform: `scale(${videoScale})`,
        }}
      >
        <Video
          src={staticFile(droneClipSrc)}
          startFrom={clipStartFrom * fps}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Dark gradient overlay */}
      <div style={{ ...gradientStyle, opacity: globalOpacity }} />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          opacity: globalOpacity,
          padding: "60px 50px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Package name */}
        <AnimatedText
          text={packageName}
          startFrame={NAME_START}
          style={{
            fontFamily: loraFamily,
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 16,
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        />

        {/* Tagline */}
        <AnimatedText
          text={tagline}
          startFrame={TAGLINE_START}
          style={{
            fontFamily: interFamily,
            fontSize: 32,
            fontWeight: 300,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: 1.5,
            marginBottom: 40,
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        />

        {/* Divider line */}
        <DividerLine startFrame={DIVIDER_START} />

        {/* Includes list */}
        <div style={{ marginBottom: 40, marginTop: 30 }}>
          {includes.map((item, i) => (
            <IncludeItem
              key={item}
              text={item}
              startFrame={INCLUDES_START + i * INCLUDES_STAGGER}
            />
          ))}
        </div>

        {/* Price + Duration */}
        <PriceBlock
          price={price}
          duration={duration}
          startFrame={PRICE_START}
        />

        {/* Availability */}
        <AnimatedText
          text={availability}
          startFrame={AVAILABILITY_START}
          style={{
            fontFamily: interFamily,
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginTop: 20,
          }}
        />

        {/* CTA / Watermark */}
        <CTAWatermark startFrame={CTA_START} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Sub-components ---

const AnimatedText: React.FC<{
  text: string;
  startFrame: number;
  style: React.CSSProperties;
}> = ({ text, startFrame, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        ...style,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
};

const DividerLine: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const width = interpolate(progress, [0, 1], [0, 120]);

  return (
    <div
      style={{
        height: 1,
        width,
        backgroundColor: "rgba(255,255,255,0.3)",
      }}
    />
  );
};

const IncludeItem: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        fontFamily: interFamily,
        fontSize: 26,
        fontWeight: 400,
        color: "rgba(255,255,255,0.75)",
        opacity,
        transform: `translateX(${translateX}px)`,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
        textShadow: "0 1px 8px rgba(0,0,0,0.4)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(46, 144, 144, 0.9)",
          flexShrink: 0,
        }}
      />
      {text}
    </div>
  );
};

const PriceBlock: React.FC<{
  price: string;
  duration: string;
  startFrame: number;
}> = ({ price, duration, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      <span
        style={{
          fontFamily: loraFamily,
          fontSize: 52,
          fontWeight: 700,
          color: "white",
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
        }}
      >
        {price}
      </span>
      <span
        style={{
          fontFamily: interFamily,
          fontSize: 24,
          fontWeight: 300,
          color: "rgba(255,255,255,0.5)",
          marginLeft: 16,
        }}
      >
        · {duration}
      </span>
    </div>
  );
};

const CTAWatermark: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.7]);

  return (
    <div
      style={{
        marginTop: 50,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: interFamily,
          fontSize: 18,
          fontWeight: 600,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        swissperiences
      </div>
      <div
        style={{
          fontFamily: interFamily,
          fontSize: 16,
          fontWeight: 300,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 2,
        }}
      >
        swissperiences.ch
      </div>
    </div>
  );
};
