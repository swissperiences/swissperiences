import { useState } from "react";

// ─── TOKENS (subset) ─────────────────────────────────────────────────────────
const t = {
  color: {
    bg:        "#0E0D0C",
    surface1:  "#181714",
    surface2:  "#222019",
    surface3:  "#2C2A24",
    border:    "#2C2A24",
    borderHover:"#5A5550",
    text:      "#F4F3EF",
    textMuted: "#A8A39A",
    textDim:   "#5A5550",
    glacier:   "#2E9090",
    glacierHover:"#52ABAB",
    glacierDim:"rgba(46,144,144,0.12)",
    gold:      "#C4A820",
    goldDim:   "rgba(196,168,32,0.12)",
    error:     "#9B3030",
    errorDim:  "rgba(155,48,48,0.12)",
    success:   "#2A7A4B",
    successDim:"rgba(42,122,75,0.12)",
  },
  font: {
    display: "Cormorant Garamond, Georgia, serif",
    body:    "'DM Sans', system-ui, sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },
};

// ─── BUTTON ──────────────────────────────────────────────────────────────────
function Button({ variant = "primary", size = "md", disabled = false, icon, children, onClick }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "8px", border: "none", borderRadius: "2px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: t.font.body, fontWeight: 500, letterSpacing: "0.06em",
    textTransform: "uppercase", transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
    opacity: disabled ? 0.4 : 1, position: "relative", overflow: "hidden",
    outline: "none",
  };

  const sizes = {
    sm: { fontSize: "0.6875rem", padding: "6px 14px", height: "30px" },
    md: { fontSize: "0.75rem",   padding: "10px 20px", height: "38px" },
    lg: { fontSize: "0.8125rem", padding: "14px 28px", height: "46px" },
  };

  const variants = {
    primary: {
      background: hover && !disabled ? t.color.glacierHover : t.color.glacier,
      color: "#FAFAF8",
      transform: active && !disabled ? "scale(0.98)" : "scale(1)",
      boxShadow: hover && !disabled ? "0 4px 20px rgba(46,144,144,0.3)" : "none",
    },
    secondary: {
      background: hover && !disabled ? t.color.surface2 : "transparent",
      color: t.color.text,
      border: `1px solid ${hover && !disabled ? t.color.borderHover : t.color.border}`,
      transform: active && !disabled ? "scale(0.98)" : "scale(1)",
    },
    ghost: {
      background: hover && !disabled ? t.color.glacierDim : "transparent",
      color: hover && !disabled ? t.color.glacierHover : t.color.textMuted,
      transform: active && !disabled ? "scale(0.98)" : "scale(1)",
    },
    gold: {
      background: hover && !disabled ? "#D9C14A" : t.color.gold,
      color: "#131210",
      transform: active && !disabled ? "scale(0.98)" : "scale(1)",
      boxShadow: hover && !disabled ? "0 4px 20px rgba(196,168,32,0.3)" : "none",
    },
    danger: {
      background: hover && !disabled ? "#B03636" : t.color.error,
      color: "#FAFAF8",
      transform: active && !disabled ? "scale(0.98)" : "scale(1)",
    },
  };

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span style={{ fontSize: "1em" }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Input({ label, placeholder, type = "text", state = "default", helperText, icon, value, onChange }) {
  const [focused, setFocused] = useState(false);

  const borderColor = {
    default: focused ? t.color.glacier : t.color.border,
    error:   t.color.error,
    success: t.color.success,
    disabled: t.color.border,
  }[state];

  const helperColor = {
    default: t.color.textDim,
    error:   t.color.error,
    success: t.color.success,
    disabled: t.color.textDim,
  }[state];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{
          fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: t.color.textMuted, fontFamily: t.font.body,
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
            color: t.color.textDim, fontSize: "0.875rem", pointerEvents: "none",
          }}>{icon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={state === "disabled"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: state === "disabled" ? t.color.surface1 : t.color.surface2,
            border: `1px solid ${borderColor}`,
            borderRadius: "2px",
            color: state === "disabled" ? t.color.textDim : t.color.text,
            fontFamily: t.font.body,
            fontSize: "0.875rem",
            padding: icon ? "10px 12px 10px 36px" : "10px 12px",
            outline: "none",
            transition: "border-color 200ms, box-shadow 200ms",
            boxShadow: focused && state === "default" ? "0 0 0 3px rgba(46,144,144,0.15)" : "none",
            cursor: state === "disabled" ? "not-allowed" : "text",
          }}
        />
        {state === "success" && (
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: t.color.success }}>✓</span>
        )}
        {state === "error" && (
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: t.color.error }}>!</span>
        )}
      </div>
      {helperText && (
        <span style={{ fontSize: "0.6875rem", color: helperColor, fontFamily: t.font.body }}>{helperText}</span>
      )}
    </div>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ variant = "default", size = "md", dot, children }) {
  const variants = {
    default: { bg: t.color.surface3, color: t.color.textMuted, border: t.color.border },
    glacier: { bg: t.color.glacierDim, color: t.color.glacierHover, border: "rgba(46,144,144,0.2)" },
    gold:    { bg: t.color.goldDim,    color: t.color.gold,         border: "rgba(196,168,32,0.2)" },
    success: { bg: t.color.successDim, color: t.color.success,      border: "rgba(42,122,75,0.2)" },
    error:   { bg: t.color.errorDim,   color: t.color.error,        border: "rgba(155,48,48,0.2)" },
    outline: { bg: "transparent",      color: t.color.textMuted,    border: t.color.border },
  };

  const sizes = {
    sm: { fontSize: "0.5625rem", padding: "2px 6px" },
    md: { fontSize: "0.625rem",  padding: "3px 8px" },
    lg: { fontSize: "0.6875rem", padding: "4px 10px" },
  };

  const v = variants[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      borderRadius: "2px",
      fontFamily: t.font.body, fontWeight: 500,
      letterSpacing: "0.08em", textTransform: "uppercase",
      ...sizes[size],
    }}>
      {dot && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.color }} />}
      {children}
    </span>
  );
}

// ─── TAG / CHIP ──────────────────────────────────────────────────────────────
function Tag({ children, onRemove, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: selected ? t.color.glacierDim : hover ? t.color.surface2 : t.color.surface1,
        border: `1px solid ${selected ? "rgba(46,144,144,0.3)" : hover ? t.color.borderHover : t.color.border}`,
        color: selected ? t.color.glacierHover : t.color.textMuted,
        borderRadius: "2px", padding: "5px 10px",
        fontSize: "0.75rem", fontFamily: t.font.body,
        cursor: "pointer", transition: "all 180ms",
        userSelect: "none",
      }}
    >
      {children}
      {onRemove && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ opacity: 0.5, fontSize: "0.875rem", lineHeight: 1, cursor: "pointer" }}
        >×</span>
      )}
    </span>
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({ name, src, size = "md", status }) {
  const sizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };
  const px = sizes[size];
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const statusColors = { online: t.color.success, away: t.color.gold, busy: t.color.error, offline: t.color.textDim };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{
        width: px, height: px, borderRadius: "50%",
        background: src ? "transparent" : `linear-gradient(135deg, ${t.color.glacier}, ${t.color.surface3})`,
        border: `1px solid ${t.color.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        fontFamily: t.font.body,
        fontSize: `${px * 0.35}px`,
        fontWeight: 500,
        color: t.color.text,
        flexShrink: 0,
      }}>
        {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
      </div>
      {status && (
        <span style={{
          position: "absolute", bottom: 0, right: 0,
          width: Math.max(px * 0.28, 8), height: Math.max(px * 0.28, 8),
          borderRadius: "50%",
          background: statusColors[status] || t.color.textDim,
          border: `2px solid ${t.color.bg}`,
        }} />
      )}
    </div>
  );
}

// ─── AVATAR GROUP ────────────────────────────────────────────────────────────
function AvatarGroup({ avatars, max = 4 }) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  return (
    <div style={{ display: "flex" }}>
      {visible.map((a, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: visible.length - i }}>
          <Avatar {...a} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -10, width: 32, height: 32, borderRadius: "50%",
          background: t.color.surface3, border: `1px solid ${t.color.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.625rem", color: t.color.textMuted, fontFamily: t.font.body,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
function Divider({ label, orientation = "horizontal" }) {
  if (orientation === "vertical") return (
    <div style={{ width: "1px", background: t.color.border, alignSelf: "stretch", margin: "0 16px" }} />
  );
  if (label) return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "8px 0" }}>
      <div style={{ flex: 1, height: "1px", background: t.color.border }} />
      <span style={{ fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: t.color.textDim }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: t.color.border }} />
    </div>
  );
  return <div style={{ height: "1px", background: t.color.border, margin: "8px 0" }} />;
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────
function Spinner({ size = "md", color }) {
  const sizes = { sm: 16, md: 24, lg: 32 };
  const px = sizes[size];
  return (
    <div style={{
      width: px, height: px, borderRadius: "50%",
      border: `2px solid ${t.color.surface3}`,
      borderTopColor: color || t.color.glacier,
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────
function Skeleton({ width, height = "16px", rounded }) {
  return (
    <div style={{
      width: width || "100%", height,
      background: `linear-gradient(90deg, ${t.color.surface2} 25%, ${t.color.surface3} 50%, ${t.color.surface2} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease infinite",
      borderRadius: rounded ? "9999px" : "2px",
    }} />
  );
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function Tooltip({ content, children, position = "top" }) {
  const [show, setShow] = useState(false);
  const positions = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)",   left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%",  transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)",  top: "50%",  transform: "translateY(-50%)" },
  };

  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", zIndex: 100,
          ...positions[position],
          background: t.color.surface3, border: `1px solid ${t.color.border}`,
          color: t.color.text, fontSize: "0.6875rem",
          padding: "5px 10px", borderRadius: "2px",
          whiteSpace: "nowrap", fontFamily: t.font.body,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}>
          {content}
        </span>
      )}
    </span>
  );
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1 }}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          width: 36, height: 20, borderRadius: "10px", position: "relative",
          background: checked ? t.color.glacier : t.color.surface3,
          border: `1px solid ${checked ? t.color.glacier : t.color.border}`,
          transition: "background 200ms",
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: checked ? 16 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: "#FAFAF8",
          transition: "left 200ms cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }} />
      </div>
      {label && <span style={{ fontSize: "0.8125rem", color: t.color.textMuted, fontFamily: t.font.body }}>{label}</span>}
    </label>
  );
}

// ─── CHECKBOX ────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, label, indeterminate, disabled }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1 }}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          width: 16, height: 16, borderRadius: "2px", flexShrink: 0,
          background: checked || indeterminate ? t.color.glacier : "transparent",
          border: `1px solid ${checked || indeterminate ? t.color.glacier : t.color.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 150ms",
        }}
      >
        {indeterminate && <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>−</span>}
        {checked && !indeterminate && <span style={{ color: "#fff", fontSize: "9px", lineHeight: 1 }}>✓</span>}
      </div>
      {label && <span style={{ fontSize: "0.8125rem", color: t.color.textMuted, fontFamily: t.font.body }}>{label}</span>}
    </label>
  );
}

// ─── RADIO ───────────────────────────────────────────────────────────────────
function Radio({ checked, onChange, label, disabled }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1 }}>
      <div
        onClick={() => !disabled && onChange?.()}
        style={{
          width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
          border: `1px solid ${checked ? t.color.glacier : t.color.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 150ms",
        }}
      >
        {checked && <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color.glacier }} />}
      </div>
      {label && <span style={{ fontSize: "0.8125rem", color: t.color.textMuted, fontFamily: t.font.body }}>{label}</span>}
    </label>
  );
}

// ─── SELECT ──────────────────────────────────────────────────────────────────
function Select({ label, options = [], value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
      {label && <label style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.color.textMuted, fontFamily: t.font.body }}>{label}</label>}
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: t.color.surface2, border: `1px solid ${open ? t.color.glacier : t.color.border}`,
          borderRadius: "2px", padding: "10px 12px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", fontFamily: t.font.body, fontSize: "0.875rem",
          color: selected ? t.color.text : t.color.textDim,
          boxShadow: open ? "0 0 0 3px rgba(46,144,144,0.15)" : "none",
          transition: "all 200ms",
        }}
      >
        <span>{selected?.label || placeholder || "Select..."}</span>
        <span style={{ color: t.color.textDim, transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>▾</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
          background: t.color.surface2, border: `1px solid ${t.color.border}`,
          borderRadius: "2px", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange?.(opt.value); setOpen(false); }}
              style={{
                padding: "9px 12px", fontSize: "0.875rem", fontFamily: t.font.body,
                color: opt.value === value ? t.color.glacierHover : t.color.text,
                background: opt.value === value ? t.color.glacierDim : "transparent",
                cursor: "pointer",
                transition: "background 120ms",
              }}
              onMouseEnter={e => e.currentTarget.style.background = t.color.surface3}
              onMouseLeave={e => e.currentTarget.style.background = opt.value === value ? t.color.glacierDim : "transparent"}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TEXTAREA ────────────────────────────────────────────────────────────────
function Textarea({ label, placeholder, rows = 4, helperText, state = "default" }) {
  const [focused, setFocused] = useState(false);
  const borderColor = { default: focused ? t.color.glacier : t.color.border, error: t.color.error }[state] || t.color.border;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && <label style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.color.textMuted, fontFamily: t.font.body }}>{label}</label>}
      <textarea
        placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: t.color.surface2, border: `1px solid ${borderColor}`,
          borderRadius: "2px", color: t.color.text, fontFamily: t.font.body,
          fontSize: "0.875rem", padding: "10px 12px", outline: "none",
          resize: "vertical", lineHeight: "1.6",
          boxShadow: focused ? "0 0 0 3px rgba(46,144,144,0.15)" : "none",
          transition: "border-color 200ms, box-shadow 200ms",
        }}
      />
      {helperText && <span style={{ fontSize: "0.6875rem", color: state === "error" ? t.color.error : t.color.textDim }}>{helperText}</span>}
    </div>
  );
}

// ─── COMPONENT SECTION ───────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div style={{ marginBottom: "56px" }}>
      <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: `1px solid ${t.color.border}` }}>
        <h2 style={{ fontFamily: t.font.display, fontSize: "1.5rem", fontWeight: 300, color: t.color.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{title}</h2>
        {description && <p style={{ color: t.color.textMuted, fontSize: "0.8125rem", margin: 0, fontFamily: t.font.body }}>{description}</p>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "flex-start" }}>
        {children}
      </div>
    </div>
  );
}

function Group({ label, children, column }) {
  return (
    <div>
      <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.color.textDim, marginBottom: "10px", fontFamily: t.font.body }}>{label}</div>
      <div style={{ display: "flex", flexDirection: column ? "column" : "row", flexWrap: "wrap", gap: "8px", alignItems: column ? "flex-start" : "center" }}>
        {children}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function DesignSystemPart2() {
  const [inputVal, setInputVal] = useState("");
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(false);
  const [radio, setRadio] = useState("a");
  const [selectVal, setSelectVal] = useState("");
  const [tags, setTags] = useState(["Ski & Snow", "Fine Dining", "Helicopter"]);
  const [selectedTag, setSelectedTag] = useState("Ski & Snow");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0E0D0C; } ::-webkit-scrollbar-thumb { background: #2C2A24; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #5A5550; }
      `}</style>

      <div style={{ fontFamily: t.font.body, background: t.color.bg, color: t.color.text, minHeight: "100vh", padding: "0" }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${t.color.border}`, padding: "32px 40px 24px" }}>
          <span style={{ fontFamily: t.font.display, fontSize: "11px", letterSpacing: "0.2em", color: t.color.glacier, textTransform: "uppercase" }}>Design System · Part 2 of 4</span>
          <h1 style={{ fontFamily: t.font.display, fontSize: "2.5rem", fontWeight: 300, letterSpacing: "-0.03em", margin: "4px 0 4px", color: "#FAFAF8" }}>Base Components</h1>
          <p style={{ color: t.color.textMuted, fontSize: "0.875rem", margin: 0 }}>Button · Input · Badge · Tag · Avatar · Toggle · Checkbox · Radio · Select · Skeleton · Tooltip</p>
        </div>

        <div style={{ padding: "48px 40px" }}>

          {/* BUTTON */}
          <Section title="Button" description="5 variants × 3 sizes × 3 states (default, hover, disabled). 8px base radius rounded to 2px for brand sharpness.">
            <Group label="Variants">
              <Button variant="primary">Book Now</Button>
              <Button variant="secondary">View Details</Button>
              <Button variant="ghost">Learn More</Button>
              <Button variant="gold">Exclusive Access</Button>
              <Button variant="danger">Cancel</Button>
            </Group>
            <Group label="Sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Group>
            <Group label="With Icon">
              <Button icon="→" variant="primary">Continue</Button>
              <Button icon="+" variant="secondary">Add Experience</Button>
              <Button icon="↗" variant="ghost">Share</Button>
            </Group>
            <Group label="Disabled">
              <Button variant="primary" disabled>Book Now</Button>
              <Button variant="secondary" disabled>Unavailable</Button>
              <Button variant="gold" disabled>Sold Out</Button>
            </Group>
          </Section>

          {/* INPUT */}
          <Section title="Input" description="Text inputs with label, helper text, icon, and 4 states. Focus ring uses glacier at 15% opacity.">
            <div style={{ display: "grid", gridTemplateColumns: "280px 280px", gap: "24px" }}>
              <Input label="Full Name" placeholder="Jean-Pierre Müller" value={inputVal} onChange={e => setInputVal(e.target.value)} state="default" helperText="As on your passport" />
              <Input label="Email" placeholder="contact@swissperiences.ch" icon="@" state="default" helperText="We'll send your itinerary here" />
              <Input label="Destination" placeholder="Search alpine experiences…" icon="⌕" state="default" />
              <Input label="Arrival Date" type="date" state="default" />
              <Input label="Validation OK" placeholder="Verbier, Switzerland" state="success" helperText="Location confirmed" />
              <Input label="Validation Error" placeholder="Invalid entry" state="error" helperText="Please enter a valid destination" />
              <Input label="Disabled" placeholder="Not available" state="disabled" helperText="Feature locked" />
              <Textarea label="Special Requests" placeholder="Dietary requirements, accessibility needs, preferred room view…" helperText="Optional — we read every note." />
            </div>
          </Section>

          {/* SELECT */}
          <Section title="Select" description="Custom dropdown with animated chevron and keyboard-accessible option list.">
            <div style={{ width: "280px" }}>
              <Select
                label="Experience Category"
                placeholder="Choose a category"
                value={selectVal}
                onChange={setSelectVal}
                options={[
                  { value: "ski", label: "Ski & Winter Sports" },
                  { value: "wellness", label: "Wellness & Spa" },
                  { value: "gastronomy", label: "Alpine Gastronomy" },
                  { value: "helicopter", label: "Helicopter Tours" },
                  { value: "private", label: "Private Chalet Stays" },
                ]}
              />
            </div>
          </Section>

          {/* BADGE */}
          <Section title="Badge" description="6 variants for status, category, and metadata labelling. Always uppercase, always 2px radius.">
            <Group label="Variants">
              <Badge variant="default">Default</Badge>
              <Badge variant="glacier">Active</Badge>
              <Badge variant="gold">Premium</Badge>
              <Badge variant="success">Confirmed</Badge>
              <Badge variant="error">Cancelled</Badge>
              <Badge variant="outline">Archived</Badge>
            </Group>
            <Group label="With Status Dot">
              <Badge variant="glacier" dot>Live</Badge>
              <Badge variant="success" dot>Confirmed</Badge>
              <Badge variant="error" dot>Unavailable</Badge>
              <Badge variant="gold" dot>Exclusive</Badge>
            </Group>
            <Group label="Sizes">
              <Badge size="sm" variant="glacier">Small</Badge>
              <Badge size="md" variant="glacier">Medium</Badge>
              <Badge size="lg" variant="glacier">Large</Badge>
            </Group>
          </Section>

          {/* TAG */}
          <Section title="Tag / Chip" description="Selectable and dismissible chips for filters, categories, and multi-select inputs.">
            <Group label="Selectable Filters">
              {["Ski & Snow", "Wellness", "Gastronomy", "Helicopter", "Private"].map(tag => (
                <Tag key={tag} selected={selectedTag === tag} onClick={() => setSelectedTag(tag)}>{tag}</Tag>
              ))}
            </Group>
            <Group label="Dismissible">
              {tags.map(tag => (
                <Tag key={tag} onRemove={() => setTags(tags.filter(t => t !== tag))}>{tag}</Tag>
              ))}
              {tags.length === 0 && <span style={{ color: t.color.textDim, fontSize: "0.8125rem" }}>All removed — refresh to reset</span>}
            </Group>
          </Section>

          {/* AVATAR */}
          <Section title="Avatar" description="Initials fallback with gradient, online status indicator, and group stack.">
            <Group label="Sizes">
              <Avatar name="Jean-Pierre" size="xs" />
              <Avatar name="Sophie Martin" size="sm" />
              <Avatar name="Alexander Koch" size="md" />
              <Avatar name="Marie Blanc" size="lg" />
              <Avatar name="Thomas Dupont" size="xl" />
            </Group>
            <Group label="Status">
              <Avatar name="Online User" size="md" status="online" />
              <Avatar name="Away User" size="md" status="away" />
              <Avatar name="Busy User" size="md" status="busy" />
              <Avatar name="Offline User" size="md" status="offline" />
            </Group>
            <Group label="Group Stack">
              <AvatarGroup avatars={[
                { name: "Jean-Pierre" }, { name: "Sophie Martin" }, { name: "Alexander Koch" },
                { name: "Marie Blanc" }, { name: "Thomas Dupont" }, { name: "Claudine Rey" },
              ]} max={4} />
            </Group>
          </Section>

          {/* CONTROLS */}
          <Section title="Toggle · Checkbox · Radio" description="Form controls with spring animation on toggle thumb and smooth state transitions.">
            <Group label="Toggle" column>
              <Toggle checked={toggle1} onChange={setToggle1} label="Email notifications" />
              <Toggle checked={toggle2} onChange={setToggle2} label="SMS updates" />
              <Toggle checked={false} disabled label="Disabled option" />
            </Group>
            <Group label="Checkbox" column>
              <Checkbox checked={check1} onChange={setCheck1} label="Agree to cancellation policy" />
              <Checkbox checked={check2} onChange={setCheck2} label="Subscribe to newsletter" />
              <Checkbox checked={true} indeterminate label="Indeterminate state" />
              <Checkbox checked={false} disabled label="Disabled checkbox" />
            </Group>
            <Group label="Radio" column>
              <Radio checked={radio === "a"} onChange={() => setRadio("a")} label="Standard package" />
              <Radio checked={radio === "b"} onChange={() => setRadio("b")} label="Premium package" />
              <Radio checked={radio === "c"} onChange={() => setRadio("c")} label="Exclusive package" />
              <Radio checked={false} disabled label="Unavailable" />
            </Group>
          </Section>

          {/* UTILITY */}
          <Section title="Utility — Divider · Spinner · Skeleton · Tooltip" description="Supporting components for loading states, layout separation, and contextual hints.">
            <Group label="Divider">
              <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Divider />
                <Divider label="or continue with" />
              </div>
            </Group>
            <Group label="Spinner">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="md" color={t.color.gold} />
            </Group>
            <Group label="Skeleton" column>
              <Skeleton width="200px" height="14px" />
              <Skeleton width="140px" height="14px" />
              <Skeleton width="240px" height="40px" />
              <Skeleton width="48px" height="48px" rounded />
            </Group>
            <Group label="Tooltip">
              <Tooltip content="View full itinerary" position="top">
                <Button variant="secondary" size="sm">Hover me (top)</Button>
              </Tooltip>
              <Tooltip content="CHF 3,200 per person" position="bottom">
                <Button variant="ghost" size="sm">Price info (bottom)</Button>
              </Tooltip>
              <Tooltip content="Helicopter transfer included" position="right">
                <Badge variant="gold" dot>Premium</Badge>
              </Tooltip>
            </Group>
          </Section>

        </div>
      </div>
    </>
  );
}
