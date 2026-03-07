import { useState } from "react";

const t = {
  bg:          "#0E0D0C",
  surface1:    "#181714",
  surface2:    "#222019",
  surface3:    "#2C2A24",
  border:      "#2C2A24",
  borderHover: "#5A5550",
  text:        "#F4F3EF",
  textMuted:   "#A8A39A",
  textDim:     "#5A5550",
  glacier:     "#2E9090",
  glacierHover:"#52ABAB",
  glacierDim:  "rgba(46,144,144,0.12)",
  gold:        "#C4A820",
  goldDim:     "rgba(196,168,32,0.12)",
  error:       "#9B3030",
  success:     "#2A7A4B",
  display:     "Cormorant Garamond, Georgia, serif",
  body:        "'DM Sans', system-ui, sans-serif",
  mono:        "'JetBrains Mono', monospace",
};

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Tag({ children, color }) {
  return (
    <span style={{
      background: color === "green" ? "rgba(42,122,75,0.15)" : color === "red" ? "rgba(155,48,48,0.15)" : t.surface3,
      border: `1px solid ${color === "green" ? "rgba(42,122,75,0.3)" : color === "red" ? "rgba(155,48,48,0.3)" : t.border}`,
      color: color === "green" ? t.success : color === "red" ? t.error : t.textMuted,
      fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 2, fontFamily: t.body,
    }}>{children}</span>
  );
}

function Code({ children, block }) {
  if (block) return (
    <pre style={{
      background: "#0A0908", border: `1px solid ${t.border}`, borderRadius: 4,
      padding: "16px 20px", fontSize: "0.75rem", lineHeight: 1.7,
      color: "#A8A39A", fontFamily: t.mono, overflowX: "auto",
      margin: 0,
    }}><code>{children}</code></pre>
  );
  return (
    <code style={{ background: t.surface3, border: `1px solid ${t.border}`, borderRadius: 2, padding: "1px 6px", fontSize: "0.75rem", color: t.glacierHover, fontFamily: t.mono }}>{children}</code>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 72, scrollMarginTop: 80 }}>
      <div style={{ marginBottom: 32, paddingBottom: 14, borderBottom: `1px solid ${t.border}` }}>
        <h2 style={{ fontFamily: t.display, fontSize: "1.75rem", fontWeight: 300, color: t.text, margin: 0, letterSpacing: "-0.025em" }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: t.body, fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, margin: "0 0 16px" }}>{title}</h3>
      {children}
    </div>
  );
}

function DoDont({ dos, donts }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "rgba(42,122,75,0.06)", border: "1px solid rgba(42,122,75,0.2)", borderRadius: 4, padding: "20px 22px" }}>
        <div style={{ fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.success, fontFamily: t.body, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <span>✓</span> Do
        </div>
        <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {dos.map((d, i) => <li key={i} style={{ fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.6 }}>{d}</li>)}
        </ul>
      </div>
      <div style={{ background: "rgba(155,48,48,0.06)", border: "1px solid rgba(155,48,48,0.2)", borderRadius: 4, padding: "20px 22px" }}>
        <div style={{ fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.error, fontFamily: t.body, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <span>✕</span> Don't
        </div>
        <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {donts.map((d, i) => <li key={i} style={{ fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.6 }}>{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

function PropRow({ name, type, defaultVal, required, description }) {
  return (
    <tr>
      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}` }}>
        <code style={{ fontFamily: t.mono, fontSize: "0.75rem", color: t.glacierHover }}>{name}</code>
        {required && <span style={{ marginLeft: 6, fontSize: "0.5rem", color: t.error, letterSpacing: "0.1em", textTransform: "uppercase" }}>req</span>}
      </td>
      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}` }}>
        <code style={{ fontFamily: t.mono, fontSize: "0.6875rem", color: t.gold }}>{type}</code>
      </td>
      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}` }}>
        <code style={{ fontFamily: t.mono, fontSize: "0.6875rem", color: t.textDim }}>{defaultVal || "—"}</code>
      </td>
      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}`, fontSize: "0.75rem", color: t.textMuted, fontFamily: t.body }}>{description}</td>
    </tr>
  );
}

function PropsTable({ rows }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: t.surface1 }}>
            {["Prop", "Type", "Default", "Description"].map(h => (
              <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, fontFamily: t.body, borderBottom: `1px solid ${t.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map((r, i) => <PropRow key={i} {...r} />)}</tbody>
      </table>
    </div>
  );
}

function Principle({ icon, title, description }) {
  return (
    <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, padding: "20px 22px" }}>
      <div style={{ fontFamily: t.display, fontSize: "1.5rem", marginBottom: 10, color: t.glacier }}>{icon}</div>
      <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: t.text, fontFamily: t.body, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: "0.75rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7 }}>{description}</div>
    </div>
  );
}

function ColorSwatch({ name, value, usage }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 3, background: value, border: `1px solid rgba(255,255,255,0.06)`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.75rem", color: t.text, fontFamily: t.body }}>{name}</div>
        <div style={{ fontSize: "0.625rem", color: t.textDim, fontFamily: t.mono }}>{value}</div>
      </div>
      <div style={{ fontSize: "0.6875rem", color: t.textMuted, fontFamily: t.body, textAlign: "right", maxWidth: 220 }}>{usage}</div>
    </div>
  );
}

function Checklist({ title, items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(p => ({ ...p, [i]: !p[i] }));
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8125rem", color: t.text, fontFamily: t.body, fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: "0.6875rem", color: done === items.length ? t.success : t.textDim, fontFamily: t.body }}>{done}/{items.length}</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ padding: "9px 18px", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", transition: "background 120ms" }}
            onMouseEnter={e => e.currentTarget.style.background = t.surface2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: 14, height: 14, borderRadius: 2, border: `1px solid ${checked[i] ? t.glacier : t.border}`, background: checked[i] ? t.glacier : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 150ms" }}>
              {checked[i] && <span style={{ color: "#fff", fontSize: "8px" }}>✓</span>}
            </div>
            <span style={{ fontSize: "0.8125rem", color: checked[i] ? t.textDim : t.textMuted, fontFamily: t.body, lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const navSections = [
  { label: "Overview",   items: ["Principles", "Brand Voice", "Semantic Colors"] },
  { label: "Typography", items: ["Font Families", "Scale Usage", "Type Do's & Don'ts"] },
  { label: "Spacing",    items: ["8px Grid", "Spacing Rules"] },
  { label: "Components", items: ["Button API", "Input API", "Card API", "Component Rules"] },
  { label: "Handoff",    items: ["File Structure", "Naming Conventions", "Dev Checklist"] },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DesignSystemPart4() {
  const [active, setActive] = useState("Principles");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px } ::-webkit-scrollbar-track { background: #0E0D0C } ::-webkit-scrollbar-thumb { background: #2C2A24; border-radius: 3px }
        html { scroll-behavior: smooth }
      `}</style>

      <div style={{ fontFamily: t.body, background: t.bg, color: t.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* TOP HEADER */}
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(14,13,12,0.96)", backdropFilter: "blur(12px)", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontFamily: t.display, fontSize: "1.125rem", color: t.text }}>Swissperiences</span>
            <span style={{ fontSize: "0.6875rem", color: t.textDim, letterSpacing: "0.08em" }}>Design System</span>
            <span style={{ background: t.glacierDim, border: "1px solid rgba(46,144,144,0.2)", color: t.glacier, fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 2, fontFamily: t.body }}>v1.0</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Tag>Part 4 of 4</Tag>
            <Tag color="green">Handoff Guide</Tag>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }}>

          {/* SIDEBAR */}
          <aside style={{ width: 220, borderRight: `1px solid ${t.border}`, padding: "28px 0", position: "sticky", top: 65, height: "calc(100vh - 65px)", overflowY: "auto", flexShrink: 0 }}>
            {navSections.map(sec => (
              <div key={sec.label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: t.textDim, padding: "0 20px", marginBottom: 4, fontFamily: t.body }}>{sec.label}</div>
                {sec.items.map(item => (
                  <button key={item} onClick={() => setActive(item)}
                    style={{
                      width: "100%", background: active === item ? t.glacierDim : "none", border: "none",
                      borderRight: active === item ? `2px solid ${t.glacier}` : "2px solid transparent",
                      color: active === item ? t.glacierHover : t.textMuted,
                      padding: "7px 20px", textAlign: "left", fontSize: "0.8125rem",
                      fontFamily: t.body, cursor: "pointer", transition: "all 150ms",
                    }}
                    onMouseEnter={e => { if (active !== item) { e.currentTarget.style.background = t.surface1; e.currentTarget.style.color = t.text; }}}
                    onMouseLeave={e => { if (active !== item) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = t.textMuted; }}}
                  >{item}</button>
                ))}
              </div>
            ))}
          </aside>

          {/* MAIN CONTENT */}
          <main style={{ flex: 1, padding: "48px 56px", maxWidth: 920, overflowY: "auto" }}>

            {/* ── PRINCIPLES ── */}
            {active === "Principles" && (
              <Section id="principles" title="Design Principles">
                <p style={{ fontSize: "0.9375rem", color: t.textMuted, lineHeight: 1.8, fontFamily: t.body, maxWidth: 640, marginBottom: 40 }}>
                  Swissperiences sells trust and exclusivity. Every pixel either builds or erodes that perception. These five principles govern every design decision.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Principle icon="◈" title="Quiet Confidence" description="Never shout. A restrained palette and generous whitespace communicate luxury more effectively than decoration. If you need to add more, you're probably doing it wrong." />
                  <Principle icon="◉" title="Precision Over Polish" description="Every spacing value comes from the 8px grid. Every radius is 2px or 4px. Consistency at scale means every component feels like it belongs to the same family." />
                  <Principle icon="◎" title="Typography Does the Work" description="Cormorant Garamond carries emotion and prestige. DM Sans carries information. Never reverse these roles. Let the type hierarchy guide the eye without visual gimmicks." />
                  <Principle icon="◐" title="Motion is Purposeful" description="Transitions use cubic-bezier(0.4,0,0.2,1). Spring entrances use cubic-bezier(0.34,1.56,0.64,1). Duration: 120–450ms. No infinite animations except loaders." />
                  <Principle icon="◑" title="Accessibility is Non-Negotiable" description="WCAG AA minimum at all times. Glacier-500 on dark backgrounds passes. Gold-400 on dark surfaces passes. Test every new color combination before shipping." />
                </div>
              </Section>
            )}

            {/* ── BRAND VOICE ── */}
            {active === "Brand Voice" && (
              <Section id="brand-voice" title="Brand Voice in UI">
                <SubSection title="Tone in Copy">
                  <DoDont
                    dos={[
                      "Use calm, confident phrasing: 'Your itinerary is confirmed.'",
                      "Write CTA labels as actions: 'Book Experience', 'View Itinerary'",
                      "Use 'we' for the brand: 'We'll send your ebook within 48 hours.'",
                      "Keep error messages factual: 'Card declined. Please try another.'",
                      "Use 'from CHF X' — implies a starting point, not a ceiling",
                    ]}
                    donts={[
                      "Don't use exclamation marks in UI copy — ever",
                      "Avoid filler words: 'Awesome!', 'Great choice!', 'You're all set!'",
                      "Don't truncate experience names — redesign the layout instead",
                      "Never say 'Error 404' to a client — say 'Page not found'",
                      "Don't use passive voice in CTAs: 'Get booked' → 'Book Now'",
                    ]}
                  />
                </SubSection>
                <SubSection title="Microcopy Examples">
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
                    {[
                      ["Empty state — no bookings", "Your first experience is waiting. →"],
                      ["Loading state",             "Preparing your itinerary…"],
                      ["Booking confirmed",          "Confirmed. Your experience begins in 3 days."],
                      ["Form validation error",      "This field is required."],
                      ["Session timeout",            "Your session expired. Sign in again to continue."],
                      ["Sold out",                   "Fully booked — join the waitlist."],
                      ["Delete confirmation",        "This cannot be undone."],
                    ].map(([context, copy]) => (
                      <div key={context} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 0, borderBottom: `1px solid ${t.border}` }}>
                        <div style={{ padding: "12px 16px", background: t.surface1, fontSize: "0.75rem", color: t.textDim, fontFamily: t.body, borderRight: `1px solid ${t.border}` }}>{context}</div>
                        <div style={{ padding: "12px 16px", fontSize: "0.8125rem", color: t.text, fontFamily: t.body, fontStyle: "italic" }}>"{copy}"</div>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </Section>
            )}

            {/* ── SEMANTIC COLORS ── */}
            {active === "Semantic Colors" && (
              <Section id="semantic-colors" title="Semantic Color Usage">
                <SubSection title="Role Map">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <ColorSwatch name="Glacier 500 — Primary Action"     value="#2E9090" usage="CTAs, active states, focus rings, links" />
                    <ColorSwatch name="Gold 400 — Premium / Price"       value="#C4A820" usage="Pricing display, 'Exclusive' badges, starred ratings" />
                    <ColorSwatch name="Stone 50 — Primary Background"    value="#FAFAF8" usage="Light mode page background" />
                    <ColorSwatch name="Surface Dark 1 — App Background"  value="#0E0D0C" usage="Dark mode root background" />
                    <ColorSwatch name="Surface Dark 2 — Card Background" value="#181714" usage="Cards, panels, nav backgrounds" />
                    <ColorSwatch name="Surface Dark 3 — Input / Raised"  value="#222019" usage="Input backgrounds, raised surfaces" />
                    <ColorSwatch name="Success Green — Confirmed"        value="#2A7A4B" usage="Booking confirmed, validation success" />
                    <ColorSwatch name="Error Red — Cancelled / Alert"    value="#9B3030" usage="Cancellations, form errors, danger actions" />
                    <ColorSwatch name="Stone 400 — Muted Text"           value="#A8A39A" usage="Secondary text, labels, placeholders" />
                    <ColorSwatch name="Stone 600 — Disabled / Dim"       value="#5A5550" usage="Disabled state text, tertiary info" />
                  </div>
                </SubSection>
                <SubSection title="Contrast Ratios">
                  <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
                    {[
                      ["Stone 50 (#FAFAF8) on Surface Dark 1 (#0E0D0C)", "16.8:1", "AAA"],
                      ["Stone 400 (#A8A39A) on Surface Dark 1 (#0E0D0C)", "7.2:1", "AAA"],
                      ["Glacier 500 (#2E9090) on Surface Dark 1 (#0E0D0C)", "4.8:1", "AA"],
                      ["Gold 400 (#C4A820) on Surface Dark 1 (#0E0D0C)", "7.1:1", "AAA"],
                      ["Stone 600 (#5A5550) on Surface Dark 1 (#0E0D0C)", "3.1:1", "AA Large"],
                    ].map(([pair, ratio, grade]) => (
                      <div key={pair} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", padding: "10px 16px", borderBottom: `1px solid ${t.border}`, alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: t.textMuted, fontFamily: t.body }}>{pair}</span>
                        <span style={{ fontSize: "0.75rem", color: t.text, fontFamily: t.mono, textAlign: "center" }}>{ratio}</span>
                        <span style={{ fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
                          <Tag color={grade === "AAA" ? "green" : ""}>{grade}</Tag>
                        </span>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </Section>
            )}

            {/* ── FONT FAMILIES ── */}
            {active === "Font Families" && (
              <Section id="fonts" title="Font Families">
                <SubSection title="Cormorant Garamond — Display & Headings">
                  <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, padding: "28px 32px", marginBottom: 16 }}>
                    <div style={{ fontFamily: t.display, fontSize: "3rem", fontWeight: 300, color: t.text, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>The Swiss Alps, curated.</div>
                    <div style={{ fontFamily: t.display, fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", color: t.textMuted, letterSpacing: "-0.02em" }}>An experience beyond the ordinary.</div>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7, margin: 0 }}>Use for: page titles, experience names, hero text, section headings, price display (h1–h4 equivalent). Weights: 300 (preferred), 400 (body headings), 400 italic (quotes, testimonials). Never use above 500 weight — it breaks the refined aesthetic.</p>
                </SubSection>
                <SubSection title="DM Sans — Body & UI">
                  <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, padding: "24px 28px", marginBottom: 16 }}>
                    <p style={{ fontFamily: t.body, fontSize: "0.9375rem", color: t.text, lineHeight: 1.7, margin: "0 0 12px" }}>DM Sans handles all functional UI copy — labels, descriptions, navigation, buttons, form fields, and metadata.</p>
                    <p style={{ fontFamily: t.body, fontSize: "0.75rem", color: t.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>UPPERCASE LABELS · Status Badges · Navigation Items</p>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7, margin: 0 }}>Use for: all interactive elements, body copy, form labels, helper text, badges, table data, tooltips. Weights: 300 (large body), 400 (default), 500 (emphasis). Never use for hero text or experience names.</p>
                </SubSection>
              </Section>
            )}

            {/* ── SCALE USAGE ── */}
            {active === "Scale Usage" && (
              <Section id="scale" title="Type Scale — When to Use">
                <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
                  {[
                    ["5xl",  "5rem",    "Cormorant", "Hero headlines on landing pages only"],
                    ["4xl",  "3.5rem",  "Cormorant", "Page titles, hero experience names"],
                    ["3xl",  "2.5rem",  "Cormorant", "Section headings, modal titles (large)"],
                    ["2xl",  "1.75rem", "Cormorant", "Card headings, pricing display"],
                    ["xl",   "1.375rem","Cormorant", "Sub-headings, sidebar titles"],
                    ["lg",   "1.125rem","DM Sans",   "Lead paragraph, large body copy"],
                    ["md",   "1rem",    "DM Sans",   "Default body text, descriptions"],
                    ["sm",   "0.875rem","DM Sans",   "Secondary copy, input values, table cells"],
                    ["xs",   "0.75rem", "DM Sans",   "Labels, navigation, captions, badges"],
                    ["2xs",  "0.625rem","DM Sans",   "Metadata, timestamps, legend text"],
                  ].map(([scale, size, font, usage]) => (
                    <div key={scale} style={{ display: "grid", gridTemplateColumns: "60px 80px 120px 1fr", alignItems: "center", padding: "11px 16px", borderBottom: `1px solid ${t.border}` }}>
                      <code style={{ fontFamily: t.mono, fontSize: "0.6875rem", color: t.glacier }}>{scale}</code>
                      <code style={{ fontFamily: t.mono, fontSize: "0.6875rem", color: t.textDim }}>{size}</code>
                      <span style={{ fontSize: "0.6875rem", color: t.gold, fontFamily: t.body }}>{font}</span>
                      <span style={{ fontSize: "0.75rem", color: t.textMuted, fontFamily: t.body }}>{usage}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── TYPE DO'S AND DON'TS ── */}
            {active === "Type Do's & Don'ts" && (
              <Section id="type-rules" title="Typography Rules">
                <DoDont
                  dos={[
                    "Use Cormorant 300 weight for all display and heading text",
                    "Pair display headings (Cormorant) with DM Sans body always",
                    "Use italic Cormorant for pull quotes and testimonials",
                    "Set letter-spacing: -0.03em or tighter for headings above 2xl",
                    "Use font-variant-numeric: lining-nums for price display",
                    "Maintain minimum 1.5 line-height for body copy",
                    "Use uppercase + letter-spacing: 0.1em+ for labels and metadata",
                  ]}
                  donts={[
                    "Don't mix Cormorant and DM Sans at the same size for similar roles",
                    "Don't use font-weight 700+ on Cormorant Garamond — it looks clunky",
                    "Don't set body copy in Cormorant — it's unreadable at small sizes",
                    "Don't use more than 3 type sizes on a single screen",
                    "Never centre-align body paragraphs longer than 2 lines",
                    "Don't use text-transform: uppercase on Cormorant — ruins the letterforms",
                    "Don't set line-height below 1.3 for any text below 3xl",
                  ]}
                />
              </Section>
            )}

            {/* ── 8PX GRID ── */}
            {active === "8px Grid" && (
              <Section id="grid" title="8px Spacing Grid">
                <p style={{ fontSize: "0.875rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7, marginBottom: 32, maxWidth: 580 }}>
                  All spacing values are multiples of 8px. For fine adjustments, 4px (half-step) is acceptable. 2px only for border widths and icon nudges. Never use arbitrary values like 13px or 22px.
                </p>
                <SubSection title="Spacing in Practice">
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
                    {[
                      ["4px  (×0.5)", "Icon gap, tight badge padding, border nudge"],
                      ["8px  (×1)",   "Icon-to-label gap, inline form spacing, chip padding"],
                      ["12px (×1.5)", "List item gap, input internal padding, small card padding"],
                      ["16px (×2)",   "Default component padding, section sub-gap"],
                      ["24px (×3)",   "Card padding, modal padding, form field gap"],
                      ["32px (×4)",   "Section gap, sidebar padding, content block spacing"],
                      ["48px (×6)",   "Large section separation, hero padding"],
                      ["64px (×8)",   "Page-level section separation, footer padding"],
                    ].map(([val, usage]) => (
                      <div key={val} style={{ display: "grid", gridTemplateColumns: "160px 1fr", padding: "10px 16px", borderBottom: `1px solid ${t.border}` }}>
                        <code style={{ fontFamily: t.mono, fontSize: "0.75rem", color: t.glacier }}>{val}</code>
                        <span style={{ fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body }}>{usage}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </Section>
            )}

            {/* ── SPACING RULES ── */}
            {active === "Spacing Rules" && (
              <Section id="spacing-rules" title="Spacing Rules">
                <DoDont
                  dos={[
                    "Use gap for flex/grid children — never margin on individual children",
                    "Use padding for internal component spacing, margin for external separation",
                    "Stack vertical spacing: title→subtitle 4–8px, section headers→content 24px",
                    "Maintain consistent 40px horizontal page margin at all breakpoints",
                    "Use clamp() for responsive padding: clamp(16px, 5vw, 80px)",
                    "Cards: 18–24px internal padding. Modals: 28px.",
                  ]}
                  donts={[
                    "Never use arbitrary px values not on the 8px grid",
                    "Don't add margin-bottom to the last child in a container",
                    "Don't mix padding and margin to achieve the same visual result",
                    "Never use negative margins except for intentional overlap effects",
                    "Don't set both top and bottom margin on inline elements",
                    "Avoid padding on <table> cells below 10px — text becomes unreadable",
                  ]}
                />
              </Section>
            )}

            {/* ── BUTTON API ── */}
            {active === "Button API" && (
              <Section id="button-api" title="Button — Props API">
                <PropsTable rows={[
                  { name: "variant",  type: '"primary" | "secondary" | "ghost" | "gold" | "danger"', defaultVal: '"primary"', description: "Visual style. Primary for main CTAs. Gold for exclusive/upsell actions." },
                  { name: "size",     type: '"sm" | "md" | "lg"',    defaultVal: '"md"',     description: "Height: 30 / 38 / 46px. Use sm inside tables or compact layouts." },
                  { name: "disabled", type: "boolean",                defaultVal: "false",    description: "Renders at 40% opacity. Prevents all interaction." },
                  { name: "icon",     type: "ReactNode",              defaultVal: "—",        description: "Renders before label. Use 16px SVG icons or single emoji for demos." },
                  { name: "onClick",  type: "() => void",             defaultVal: "—",        description: "Click handler. Never use for navigation — use an <a> tag instead." },
                  { name: "children", type: "ReactNode",              required: true, defaultVal: "—", description: "Button label. Keep under 3 words for primary CTAs." },
                ]} />
                <div style={{ marginTop: 20 }}>
                  <Code block>{`// Correct usage
<Button variant="primary" size="lg" icon={<Arrow />}>Book Experience</Button>
<Button variant="gold">Exclusive Access</Button>
<Button variant="danger" onClick={handleCancel}>Cancel Booking</Button>

// Navigation — use anchor semantics
<a href="/experiences"><Button variant="ghost">View All →</Button></a>

// Don't do this
<Button onClick={() => router.push('/experiences')}>View All</Button> // ← wrong
`}</Code>
                </div>
              </Section>
            )}

            {/* ── INPUT API ── */}
            {active === "Input API" && (
              <Section id="input-api" title="Input — Props API">
                <PropsTable rows={[
                  { name: "label",      type: "string",                                    description: "Always include. Uppercase, 0.1em letter-spacing via component." },
                  { name: "placeholder",type: "string",                                    description: "Describe expected content. Never use as a substitute for label." },
                  { name: "type",       type: "string",            defaultVal: '"text"',   description: "HTML input type. Use 'date', 'email', 'number', 'password' as needed." },
                  { name: "state",      type: '"default" | "error" | "success" | "disabled"', defaultVal: '"default"', description: "Controls border color, icon, and helper text color." },
                  { name: "helperText", type: "string",                                    description: "Shown below input. Use for hints (default) or error messages (error state)." },
                  { name: "icon",       type: "ReactNode",                                 description: "Rendered at 12px inside left edge. Use for ⌕, @, CHF prefix indicators." },
                  { name: "value",      type: "string",            required: true,         description: "Controlled value. Always pair with onChange." },
                  { name: "onChange",   type: "(e) => void",       required: true,         description: "Handler to update state. Never mutate value directly." },
                ]} />
              </Section>
            )}

            {/* ── CARD API ── */}
            {active === "Card API" && (
              <Section id="card-api" title="ExperienceCard — Props API">
                <PropsTable rows={[
                  { name: "title",    type: "string", required: true, description: "Experience name. Rendered in Cormorant 300. Keep under 40 chars." },
                  { name: "location", type: "string", required: true, description: "City, Canton format. e.g. 'Verbier, Valais'" },
                  { name: "price",    type: "string", required: true, description: "Formatted price string. e.g. 'CHF 4,200'. Rendered in Gold-400." },
                  { name: "duration", type: "string",                 description: "e.g. '3 days', 'Half day'. Shown bottom-right of image." },
                  { name: "category", type: "string",                 description: "e.g. 'Ski & Snow', 'Private Stay'. Shown as badge top-left." },
                  { name: "image",    type: "string",                 description: "Image URL. Falls back to gradient placeholder if absent." },
                  { name: "featured", type: "boolean", defaultVal: "false", description: "Shows 'Exclusive' gold badge when true." },
                  { name: "onBook",   type: "() => void",             description: "Fires when Book button is clicked. Hook into booking modal." },
                ]} />
              </Section>
            )}

            {/* ── COMPONENT RULES ── */}
            {active === "Component Rules" && (
              <Section id="component-rules" title="Component Usage Rules">
                <SubSection title="Hierarchy & Composition">
                  <DoDont
                    dos={[
                      "One primary Button per view section — CTAs compete if both are primary",
                      "Always pair Input with a label — placeholder alone fails accessibility",
                      "Use Badge for static status, Tag for interactive filtering",
                      "Show Skeleton while data fetches — never show empty containers",
                      "Use Modal for confirmations, forms, and detail views under 3 fields",
                      "Use Dropdown for 3–10 actions. Inline buttons for 1–2 actions.",
                    ]}
                    donts={[
                      "Don't nest Modals — redesign the flow if you feel the urge",
                      "Don't use ghost Button as a primary CTA on a dark background",
                      "Never put more than 12 items in a Dropdown without search",
                      "Don't use Toast for information that requires action — use Modal",
                      "Avoid mixing Badge variants in the same context without clear hierarchy",
                      "Don't use Accordion to hide critical booking information",
                    ]}
                  />
                </SubSection>
              </Section>
            )}

            {/* ── FILE STRUCTURE ── */}
            {active === "File Structure" && (
              <Section id="file-structure" title="Recommended File Structure">
                <Code block>{`src/
├── ds/   {/* design system folder */}
│   ├── tokens/
│   │   ├── colors.ts          # All color values + semantic mappings
│   │   ├── typography.ts      # Scale, families, weights
│   │   ├── spacing.ts         # 8px grid values
│   │   └── index.ts           # Re-exports all tokens
│   │
│   ├── components/
│   │   ├── base/              # Part 2 — Button, Input, Badge, Tag, Avatar…
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tag.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   └── composite/         # Part 3 — Card, Modal, Toast, Nav…
│   │       ├── ExperienceCard.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── TopNav.tsx
│   │       └── SideNav.tsx
│   │
│   └── index.ts               # Public API — export everything here

# src/ds is the recommended alias for this folder`}</Code>
              </Section>
            )}

            {/* ── NAMING CONVENTIONS ── */}
            {active === "Naming Conventions" && (
              <Section id="naming" title="Naming Conventions">
                <SubSection title="Components">
                  <Code block>{`// PascalCase for all components
ExperienceCard.tsx   ✓
experienceCard.tsx   ✗
experience-card.tsx  ✗

// Props — camelCase, descriptive
onBook          ✓    // event handlers prefixed with 'on'
handleBook      ✗    // 'handle' belongs inside the component, not in props
isLoading       ✓    // booleans prefixed with 'is', 'has', 'can', 'should'
loading         ✗
featured        ✓    // exception: short adjectives without prefix are fine`}</Code>
                </SubSection>
                <SubSection title="CSS / Style Tokens">
                  <Code block>{`// Token keys — kebab-case
colors['glacier-500']    ✓
colors['glacierFive']    ✗

// CSS variables — kebab-case with prefix
--sw-color-glacier-500   ✓
--glacierColor           ✗

// Tailwind (if used) — follow token names
bg-glacier-500           ✓
bg-[#2E9090]             ✗  // no arbitrary values in production code`}</Code>
                </SubSection>
                <SubSection title="Supabase Tables & Columns">
                  <Code block>{`-- snake_case throughout
experiences.price_chf          ✓
experiences.priceCHF            ✗
bookings.client_id             ✓
bookings.clientID               ✗
bookings.created_at            ✓    -- timestamps always created_at / updated_at`}</Code>
                </SubSection>
              </Section>
            )}

            {/* ── DEV CHECKLIST ── */}
            {active === "Dev Checklist" && (
              <Section id="checklist" title="Developer Handoff Checklist">
                <p style={{ fontSize: "0.875rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7, marginBottom: 32, maxWidth: 580 }}>
                  Run through these before shipping any new feature or component to production. Interactive — click to check off.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <Checklist title="Visual & Tokens" items={[
                    "All spacing values are on the 8px grid",
                    "No hardcoded hex values — using tokens only",
                    "Font families match role: Cormorant for display, DM Sans for UI",
                    "Font weights: Cormorant max 400, DM Sans max 500",
                    "Minimum 4.5:1 contrast ratio on all text",
                    "Dark mode surfaces use the defined 4-step scale",
                    "Border radius: 2px for sharp UI, 4px for cards, 9999px for pills only",
                  ]} />
                  <Checklist title="Components & Interaction" items={[
                    "All interactive elements have :hover and :focus states",
                    "Buttons are not used for navigation (use <a> tags)",
                    "All form inputs have associated labels",
                    "Loading states use Skeleton — never blank containers",
                    "Toast notifications auto-dismiss after 4 seconds",
                    "Modals trap focus and dismiss on Escape key",
                    "Dropdown closes on outside click",
                  ]} />
                  <Checklist title="Code Quality" items={[
                    "Components exported from a central index.ts (public API)",
                    "No inline px values that bypass the spacing scale",
                    "No component has required props without defaults or validation",
                    "Supabase columns in snake_case, components in PascalCase",
                    "Event handlers prefixed with 'on' in props, 'handle' internally",
                    "TypeScript: no 'any' types in design system components",
                    "All images have alt text or aria-hidden if decorative",
                  ]} />
                  <Checklist title="Performance & Accessibility" items={[
                    "Google Fonts loaded via <link> preconnect in _document or layout",
                    "Images use next/image or explicit width/height to prevent CLS",
                    "Animations respect prefers-reduced-motion media query",
                    "Interactive elements are keyboard navigable (tab order correct)",
                    "ARIA roles added to custom dropdowns, modals, and toasts",
                  ]} />
                </div>
              </Section>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
