import { useState } from "react";

const tokens = {
  colors: {
    // Primary — Alpine neutrals
    "stone-50":  "#FAFAF8",
    "stone-100": "#F4F3EF",
    "stone-200": "#E8E6DF",
    "stone-300": "#D0CCC0",
    "stone-400": "#A8A39A",
    "stone-500": "#7A7470",
    "stone-600": "#5A5550",
    "stone-700": "#3D3A35",
    "stone-800": "#252320",
    "stone-900": "#131210",

    // Accent — Glacier teal
    "glacier-50":  "#F0F7F7",
    "glacier-100": "#D6ECEC",
    "glacier-200": "#AEDADA",
    "glacier-300": "#7EC2C2",
    "glacier-400": "#52ABAB",
    "glacier-500": "#2E9090",
    "glacier-600": "#1E7070",
    "glacier-700": "#145252",
    "glacier-800": "#0D3636",
    "glacier-900": "#071C1C",

    // Gold — Alpine warmth
    "gold-50":  "#FBF8EF",
    "gold-100": "#F4EDCC",
    "gold-200": "#E8D98A",
    "gold-300": "#D9C14A",
    "gold-400": "#C4A820",
    "gold-500": "#A68C10",
    "gold-600": "#836E0C",
    "gold-700": "#5E4F09",
    "gold-800": "#3B3206",
    "gold-900": "#1C1803",

    // Semantic
    "success": "#2A7A4B",
    "warning": "#B87A0E",
    "error":   "#9B3030",
    "info":    "#1E5F8A",

    // Dark mode surfaces
    "surface-dark-1": "#0E0D0C",
    "surface-dark-2": "#181714",
    "surface-dark-3": "#222019",
    "surface-dark-4": "#2C2A24",
  },

  typography: {
    families: {
      display:  "Cormorant Garamond, Georgia, serif",
      heading:  "Cormorant Garamond, Georgia, serif",
      body:     "'DM Sans', system-ui, sans-serif",
      mono:     "'JetBrains Mono', monospace",
      caption:  "'DM Sans', system-ui, sans-serif",
    },
    scale: {
      "2xs": { size: "0.625rem",  lineHeight: "1rem",    letterSpacing: "0.08em",  weight: 400 },
      "xs":  { size: "0.75rem",   lineHeight: "1.125rem", letterSpacing: "0.06em", weight: 400 },
      "sm":  { size: "0.875rem",  lineHeight: "1.375rem", letterSpacing: "0.02em", weight: 400 },
      "md":  { size: "1rem",      lineHeight: "1.625rem", letterSpacing: "0",      weight: 400 },
      "lg":  { size: "1.125rem",  lineHeight: "1.75rem",  letterSpacing: "-0.01em", weight: 400 },
      "xl":  { size: "1.375rem",  lineHeight: "1.875rem", letterSpacing: "-0.02em", weight: 400 },
      "2xl": { size: "1.75rem",   lineHeight: "2.25rem",  letterSpacing: "-0.02em", weight: 300 },
      "3xl": { size: "2.5rem",    lineHeight: "3rem",     letterSpacing: "-0.03em", weight: 300 },
      "4xl": { size: "3.5rem",    lineHeight: "4rem",     letterSpacing: "-0.04em", weight: 300 },
      "5xl": { size: "5rem",      lineHeight: "5.5rem",   letterSpacing: "-0.05em", weight: 300 },
    },
  },

  spacing: {
    "0":   "0px",
    "px":  "1px",
    "0.5": "2px",
    "1":   "4px",
    "1.5": "6px",
    "2":   "8px",
    "3":   "12px",
    "4":   "16px",
    "5":   "20px",
    "6":   "24px",
    "8":   "32px",
    "10":  "40px",
    "12":  "48px",
    "16":  "64px",
    "20":  "80px",
    "24":  "96px",
    "32":  "128px",
    "40":  "160px",
    "48":  "192px",
    "64":  "256px",
  },

  grid: {
    columns: 12,
    gutter:  "24px",
    margin:  "clamp(16px, 5vw, 80px)",
    maxWidth: "1440px",
    breakpoints: {
      xs: "0px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
  },

  radius: {
    none: "0px",
    sm:   "2px",
    md:   "4px",
    lg:   "8px",
    xl:   "12px",
    "2xl":"16px",
    full: "9999px",
  },

  shadow: {
    sm:  "0 1px 2px rgba(19,18,16,0.06), 0 1px 1px rgba(19,18,16,0.04)",
    md:  "0 4px 12px rgba(19,18,16,0.08), 0 2px 4px rgba(19,18,16,0.04)",
    lg:  "0 8px 32px rgba(19,18,16,0.12), 0 4px 8px rgba(19,18,16,0.06)",
    xl:  "0 16px 64px rgba(19,18,16,0.16), 0 8px 16px rgba(19,18,16,0.08)",
    "2xl":"0 32px 96px rgba(19,18,16,0.24)",
    glow: "0 0 40px rgba(46,144,144,0.25)",
  },

  motion: {
    duration: {
      instant:  "50ms",
      fast:     "120ms",
      normal:   "250ms",
      slow:     "450ms",
      "x-slow": "800ms",
    },
    easing: {
      linear:    "linear",
      ease:      "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn:    "cubic-bezier(0.4, 0, 1, 1)",
      easeOut:   "cubic-bezier(0, 0, 0.2, 1)",
      spring:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },
};

// ─── VIEWER ──────────────────────────────────────────────────────────────────

const tabs = ["Colors", "Typography", "Spacing", "Grid", "Tokens JSON"];

export default function DesignSystemPart1() {
  const [active, setActive] = useState("Colors");

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#0E0D0C",
      color: "#F4F3EF",
      minHeight: "100vh",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2C2A24",
        padding: "32px 40px 0",
      }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#52ABAB",
            textTransform: "uppercase",
          }}>Design System · Part 1 of 4</span>
        </div>
        <h1 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "2.5rem",
          fontWeight: 300,
          letterSpacing: "-0.03em",
          margin: "0 0 4px",
          color: "#FAFAF8",
        }}>
          Foundations
        </h1>
        <p style={{ color: "#7A7470", fontSize: "0.875rem", margin: "0 0 24px" }}>
          Colors · Typography · Spacing · Grid · Motion
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} style={{
              background: "none",
              border: "none",
              borderBottom: active === tab ? "2px solid #52ABAB" : "2px solid transparent",
              color: active === tab ? "#F4F3EF" : "#7A7470",
              padding: "8px 20px",
              fontSize: "0.8125rem",
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "color 250ms",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "40px" }}>
        {active === "Colors" && <ColorsTab />}
        {active === "Typography" && <TypographyTab />}
        {active === "Spacing" && <SpacingTab />}
        {active === "Grid" && <GridTab />}
        {active === "Tokens JSON" && <TokensTab />}
      </div>
    </div>
  );
}

// ─── COLORS ──────────────────────────────────────────────────────────────────
function ColorsTab() {
  const palettes = [
    { name: "Stone — Primary", prefix: "stone", keys: ["50","100","200","300","400","500","600","700","800","900"] },
    { name: "Glacier — Accent", prefix: "glacier", keys: ["50","100","200","300","400","500","600","700","800","900"] },
    { name: "Gold — Warmth", prefix: "gold", keys: ["50","100","200","300","400","500","600","700","800","900"] },
  ];

  const semantic = [
    { name: "Success", token: "success", value: tokens.colors.success },
    { name: "Warning", token: "warning", value: tokens.colors.warning },
    { name: "Error",   token: "error",   value: tokens.colors.error },
    { name: "Info",    token: "info",    value: tokens.colors.info },
  ];

  const surfaces = [
    { name: "Surface 1", token: "surface-dark-1", value: tokens.colors["surface-dark-1"] },
    { name: "Surface 2", token: "surface-dark-2", value: tokens.colors["surface-dark-2"] },
    { name: "Surface 3", token: "surface-dark-3", value: tokens.colors["surface-dark-3"] },
    { name: "Surface 4", token: "surface-dark-4", value: tokens.colors["surface-dark-4"] },
  ];

  return (
    <div>
      {palettes.map(p => (
        <div key={p.name} style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>{p.name}</h3>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {p.keys.map(k => {
              const val = tokens.colors[`${p.prefix}-${k}`];
              const isDark = parseInt(k) >= 500;
              return (
                <div key={k} style={{ width: "80px" }}>
                  <div style={{
                    width: "80px", height: "64px",
                    background: val,
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    marginBottom: "6px",
                  }} />
                  <div style={{ fontSize: "0.6875rem", color: "#7A7470" }}>{k}</div>
                  <div style={{ fontSize: "0.625rem", color: "#5A5550", fontFamily: "monospace" }}>{val}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <div>
          <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Semantic</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            {semantic.map(s => (
              <div key={s.name}>
                <div style={{ width: "64px", height: "48px", background: s.value, borderRadius: "4px", marginBottom: "6px" }} />
                <div style={{ fontSize: "0.6875rem", color: "#7A7470" }}>{s.name}</div>
                <div style={{ fontSize: "0.625rem", color: "#5A5550", fontFamily: "monospace" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Dark Surfaces</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            {surfaces.map(s => (
              <div key={s.name}>
                <div style={{ width: "64px", height: "48px", background: s.value, borderRadius: "4px", border: "1px solid #2C2A24", marginBottom: "6px" }} />
                <div style={{ fontSize: "0.6875rem", color: "#7A7470" }}>{s.name}</div>
                <div style={{ fontSize: "0.625rem", color: "#5A5550", fontFamily: "monospace" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
function TypographyTab() {
  const entries = Object.entries(tokens.typography.scale);
  return (
    <div>
      <div style={{ marginBottom: "48px" }}>
        <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>Type Scale</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[...entries].reverse().map(([key, val]) => (
            <div key={key} style={{
              display: "grid",
              gridTemplateColumns: "48px 120px 1fr",
              alignItems: "baseline",
              padding: "16px 0",
              borderBottom: "1px solid #1C1A16",
              gap: "16px",
            }}>
              <code style={{ fontSize: "0.6875rem", color: "#52ABAB", fontFamily: "monospace" }}>{key}</code>
              <span style={{ fontSize: "0.6875rem", color: "#5A5550", fontFamily: "monospace" }}>
                {val.size} / {val.lineHeight}
              </span>
              <span style={{
                fontFamily: key === "5xl" || key === "4xl" || key === "3xl" || key === "2xl" || key === "xl"
                  ? "Cormorant Garamond, serif" : "'DM Sans', sans-serif",
                fontSize: val.size,
                lineHeight: val.lineHeight,
                fontWeight: val.weight,
                color: "#F4F3EF",
                letterSpacing: val.letterSpacing,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}>
                The Swiss Alps experience
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Font Families</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(tokens.typography.families).map(([role, family]) => (
            <div key={role} style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
              <code style={{ width: "80px", fontSize: "0.6875rem", color: "#52ABAB", fontFamily: "monospace" }}>{role}</code>
              <span style={{ fontFamily: family, fontSize: "1.25rem", color: "#D0CCC0" }}>
                Swissperiences — Curated Alpine Journeys
              </span>
              <span style={{ fontSize: "0.6875rem", color: "#5A5550", fontFamily: "monospace" }}>{family.split(",")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SPACING ─────────────────────────────────────────────────────────────────
function SpacingTab() {
  return (
    <div>
      <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>8px Base Grid</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Object.entries(tokens.spacing).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <code style={{ width: "40px", fontSize: "0.6875rem", color: "#52ABAB", fontFamily: "monospace", textAlign: "right" }}>{key}</code>
            <code style={{ width: "56px", fontSize: "0.6875rem", color: "#5A5550", fontFamily: "monospace" }}>{val}</code>
            <div style={{
              height: "16px",
              width: val,
              maxWidth: "640px",
              background: "linear-gradient(90deg, #2E9090, #52ABAB)",
              borderRadius: "2px",
              minWidth: val === "0px" ? "0" : "2px",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GRID ─────────────────────────────────────────────────────────────────────
function GridTab() {
  const bps = Object.entries(tokens.grid.breakpoints);
  return (
    <div>
      <div style={{ marginBottom: "48px" }}>
        <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>12-Column Grid</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "8px",
          background: "#181714",
          padding: "24px",
          borderRadius: "8px",
          border: "1px solid #2C2A24",
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              background: i % 2 === 0 ? "rgba(46,144,144,0.15)" : "rgba(46,144,144,0.08)",
              border: "1px solid rgba(46,144,144,0.2)",
              borderRadius: "2px",
              padding: "12px 0",
              textAlign: "center",
              fontSize: "0.6875rem",
              color: "#52ABAB",
              fontFamily: "monospace",
            }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
          {[
            ["Columns", tokens.grid.columns],
            ["Gutter", tokens.grid.gutter],
            ["Margin", tokens.grid.margin],
            ["Max Width", tokens.grid.maxWidth],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: "0.6875rem", color: "#7A7470" }}>{label}</div>
              <div style={{ fontSize: "0.875rem", color: "#D0CCC0", fontFamily: "monospace" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>Breakpoints</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {bps.map(([name, val]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <code style={{ width: "40px", fontSize: "0.75rem", color: "#C4A820", fontFamily: "monospace" }}>{name}</code>
              <code style={{ width: "64px", fontSize: "0.75rem", color: "#5A5550", fontFamily: "monospace" }}>{val}</code>
              <div style={{
                height: "8px",
                width: val === "0px" ? "16px" : `calc(${val} / 1440px * 400px)`,
                maxWidth: "400px",
                background: "linear-gradient(90deg, #A68C10, #C4A820)",
                borderRadius: "2px",
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TOKENS JSON ─────────────────────────────────────────────────────────────
function TokensTab() {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(tokens, null, 2);

  const copy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ color: "#A8A39A", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
          design-tokens.json
        </h3>
        <button onClick={copy} style={{
          background: copied ? "#2A7A4B" : "#181714",
          border: "1px solid #2C2A24",
          color: copied ? "#F4F3EF" : "#7A7470",
          padding: "6px 16px",
          borderRadius: "4px",
          fontSize: "0.75rem",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 250ms",
        }}>
          {copied ? "✓ Copied!" : "Copy JSON"}
        </button>
      </div>
      <pre style={{
        background: "#0D0C0B",
        border: "1px solid #2C2A24",
        borderRadius: "8px",
        padding: "24px",
        fontSize: "0.6875rem",
        lineHeight: "1.6",
        color: "#7A7470",
        overflow: "auto",
        maxHeight: "600px",
        fontFamily: "monospace",
      }}>
        <code>{json}</code>
      </pre>
    </div>
  );
}
