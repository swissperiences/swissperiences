import { useState, useEffect, useRef } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const t = {
  bg:           "#0E0D0C",
  surface1:     "#181714",
  surface2:     "#222019",
  surface3:     "#2C2A24",
  border:       "#2C2A24",
  borderHover:  "#5A5550",
  text:         "#F4F3EF",
  textMuted:    "#A8A39A",
  textDim:      "#5A5550",
  glacier:      "#2E9090",
  glacierHover: "#52ABAB",
  glacierDim:   "rgba(46,144,144,0.12)",
  gold:         "#C4A820",
  goldDim:      "rgba(196,168,32,0.12)",
  error:        "#9B3030",
  errorDim:     "rgba(155,48,48,0.12)",
  success:      "#2A7A4B",
  successDim:   "rgba(42,122,75,0.12)",
  display:      "Cormorant Garamond, Georgia, serif",
  body:         "'DM Sans', system-ui, sans-serif",
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
function ExperienceCard({ title, location, price, duration, category, image, featured, onBook }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 280,
        background: t.surface1,
        border: `1px solid ${hover ? t.borderHover : t.border}`,
        borderRadius: 4,
        overflow: "hidden",
        transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 16px 48px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.2)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", height: 180, background: image || "linear-gradient(135deg, #181714, #2C2A24)", overflow: "hidden" }}>
        {image && <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms", transform: hover ? "scale(1.06)" : "scale(1)" }} />}
        {!image && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: t.display, fontSize: "3rem", color: t.surface3 }}>◈</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,13,12,0.8) 0%, transparent 50%)" }} />
        {/* Badges */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          {featured && (
            <span style={{ background: t.goldDim, border: "1px solid rgba(196,168,32,0.3)", color: t.gold, fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, fontFamily: t.body, backdropFilter: "blur(8px)" }}>
              Exclusive
            </span>
          )}
          <span style={{ background: "rgba(14,13,12,0.6)", border: `1px solid ${t.border}`, color: t.textMuted, fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, fontFamily: t.body, backdropFilter: "blur(8px)" }}>
            {category}
          </span>
        </div>
        {/* Duration */}
        <div style={{ position: "absolute", bottom: 12, right: 12, color: t.textMuted, fontSize: "0.6875rem", fontFamily: t.body }}>
          {duration}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ fontSize: "0.6875rem", color: t.textDim, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: t.body, marginBottom: 6 }}>
          {location}
        </div>
        <h3 style={{ fontFamily: t.display, fontSize: "1.1875rem", fontWeight: 300, color: t.text, margin: "0 0 14px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.5625rem", color: t.textDim, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: t.body }}>from</div>
            <div style={{ fontFamily: t.display, fontSize: "1.25rem", color: t.gold, letterSpacing: "-0.01em" }}>{price}</div>
          </div>
          <button
            onClick={onBook}
            style={{
              background: hover ? t.glacierHover : "transparent",
              border: `1px solid ${hover ? t.glacierHover : t.border}`,
              color: hover ? "#FAFAF8" : t.textMuted,
              padding: "7px 14px", borderRadius: 2, fontSize: "0.6875rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: t.body, cursor: "pointer",
              transition: "all 250ms",
            }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, icon }) {
  const positive = delta?.startsWith("+");
  return (
    <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, padding: "20px 24px", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: "0.6875rem", color: t.textDim, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: t.body }}>{label}</span>
        {icon && <span style={{ color: t.textDim, fontSize: "1rem" }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: t.display, fontSize: "2rem", fontWeight: 300, color: t.text, marginBottom: 6, letterSpacing: "-0.02em" }}>{value}</div>
      {delta && <div style={{ fontSize: "0.6875rem", color: positive ? t.success : t.error, fontFamily: t.body }}>{delta} vs last month</div>}
    </div>
  );
}

function TestimonialCard({ quote, author, role, rating = 5 }) {
  return (
    <div style={{ background: t.surface1, border: `1px solid ${t.border}`, borderRadius: 4, padding: "24px", width: 280, flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < rating ? t.gold : t.surface3, fontSize: "0.75rem" }}>★</span>
        ))}
      </div>
      <p style={{ fontFamily: t.display, fontSize: "1.0625rem", fontWeight: 300, fontStyle: "italic", color: t.text, lineHeight: 1.6, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
        "{quote}"
      </p>
      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
        <div style={{ fontSize: "0.8125rem", color: t.text, fontFamily: t.body }}>{author}</div>
        <div style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body }}>{role}</div>
      </div>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, subtitle, size = "md", children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const widths = { sm: 400, md: 560, lg: 720, xl: 900 };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(7,6,5,0.85)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 200ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.surface1, border: `1px solid ${t.border}`,
          borderRadius: 4, width: "100%", maxWidth: widths[size],
          boxShadow: "0 32px 96px rgba(0,0,0,0.6)",
          animation: "slideUp 250ms cubic-bezier(0.34,1.2,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: t.display, fontSize: "1.5rem", fontWeight: 300, color: t.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
            {subtitle && <p style={{ fontSize: "0.8125rem", color: t.textMuted, margin: 0, fontFamily: t.body }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: "1.25rem", lineHeight: 1, padding: "2px 6px", borderRadius: 2, transition: "color 150ms" }}
            onMouseEnter={e => e.currentTarget.style.color = t.text}
            onMouseLeave={e => e.currentTarget.style.color = t.textDim}>
            ×
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "24px 28px", maxHeight: "60vh", overflowY: "auto" }}>{children}</div>
        {/* Footer */}
        {footer && <div style={{ padding: "16px 28px 24px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

// ─── DROPDOWN ────────────────────────────────────────────────────────────────
function Dropdown({ trigger, items, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)",
          [align === "right" ? "right" : "left"]: 0,
          minWidth: 200, zIndex: 100,
          background: t.surface2, border: `1px solid ${t.border}`,
          borderRadius: 4, overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          animation: "slideDown 180ms cubic-bezier(0.4,0,0.2,1)",
        }}>
          {items.map((item, i) => {
            if (item.type === "divider") return <div key={i} style={{ height: 1, background: t.border, margin: "4px 0" }} />;
            if (item.type === "label") return <div key={i} style={{ padding: "8px 14px 4px", fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, fontFamily: t.body }}>{item.label}</div>;
            return (
              <div key={i} onClick={() => { item.onClick?.(); setOpen(false); }}
                style={{
                  padding: "9px 14px", display: "flex", alignItems: "center", gap: 10,
                  fontSize: "0.8125rem", fontFamily: t.body,
                  color: item.danger ? t.error : t.textMuted,
                  cursor: "pointer", transition: "background 120ms, color 120ms",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = item.danger ? t.errorDim : t.surface3; e.currentTarget.style.color = item.danger ? t.error : t.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = item.danger ? t.error : t.textMuted; }}
              >
                {item.icon && <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && <span style={{ fontSize: "0.625rem", color: t.textDim, letterSpacing: "0.06em" }}>{item.shortcut}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 300, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: "all", animation: "slideInRight 280ms cubic-bezier(0.34,1.2,0.64,1)" }}>
          <Toast {...toast} onDismiss={() => onDismiss(toast.id)} />
        </div>
      ))}
    </div>
  );
}

function Toast({ type = "default", title, message, onDismiss }) {
  const styles = {
    default: { bg: t.surface2, border: t.border,                          icon: "◈", iconColor: t.textMuted },
    success: { bg: t.surface2, border: "rgba(42,122,75,0.3)",             icon: "✓", iconColor: t.success },
    error:   { bg: t.surface2, border: "rgba(155,48,48,0.3)",             icon: "!", iconColor: t.error },
    warning: { bg: t.surface2, border: "rgba(196,168,32,0.3)",            icon: "⚠", iconColor: t.gold },
    info:    { bg: t.surface2, border: "rgba(46,144,144,0.3)",            icon: "i", iconColor: t.glacier },
  };
  const s = styles[type];

  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 4, padding: "14px 16px",
      display: "flex", gap: 12, alignItems: "flex-start",
      minWidth: 300, maxWidth: 380,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${s.iconColor}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", color: s.iconColor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: t.text, fontFamily: t.body, marginBottom: message ? 3 : 0 }}>{title}</div>}
        {message && <div style={{ fontSize: "0.75rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.5 }}>{message}</div>}
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
    </div>
  );
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function TopNav({ activePage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  const links = ["Experiences", "Destinations", "About", "Contact"];

  return (
    <nav style={{
      background: scrolled ? "rgba(14,13,12,0.95)" : t.surface1,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${t.border}`,
      padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 60, transition: "background 300ms",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: t.display, fontSize: "1.25rem", fontWeight: 400, color: t.text, letterSpacing: "-0.01em" }}>Swissperiences</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.glacier, marginBottom: 2 }} />
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(link => (
          <button key={link} onClick={() => onNavigate(link)}
            style={{
              background: "none", border: "none",
              color: activePage === link ? t.text : t.textMuted,
              fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "8px 14px", cursor: "pointer", fontFamily: t.body,
              borderBottom: `2px solid ${activePage === link ? t.glacier : "transparent"}`,
              transition: "color 180ms, border-color 180ms",
            }}
            onMouseEnter={e => { if (activePage !== link) e.currentTarget.style.color = t.text; }}
            onMouseLeave={e => { if (activePage !== link) e.currentTarget.style.color = t.textMuted; }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: "0.875rem", padding: "6px 10px" }}>⌕</button>
        <Btn sm ghost>Sign in</Btn>
        <Btn sm primary>Book Experience</Btn>
      </div>
    </nav>
  );
}

function SideNav({ activePage, onNavigate }) {
  const sections = [
    {
      label: "Main", items: [
        { icon: "◈", label: "Dashboard",   page: "Dashboard" },
        { icon: "◉", label: "Experiences", page: "Experiences" },
        { icon: "◎", label: "Bookings",    page: "Bookings", badge: "3" },
      ]
    },
    {
      label: "Manage", items: [
        { icon: "◐", label: "Clients",     page: "Clients" },
        { icon: "◑", label: "Revenue",     page: "Revenue" },
        { icon: "◒", label: "Settings",    page: "Settings" },
      ]
    },
  ];

  return (
    <div style={{ width: 220, background: t.surface1, borderRight: `1px solid ${t.border}`, padding: "24px 0", display: "flex", flexDirection: "column", height: 360 }}>
      <div style={{ padding: "0 16px 24px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontFamily: t.display, fontSize: "1.125rem", fontWeight: 400, color: t.text }}>Swissperiences</span>
      </div>
      <div style={{ flex: 1, padding: "16px 8px", overflowY: "auto" }}>
        {sections.map(section => (
          <div key={section.label} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: "0.5625rem", letterSpacing: "0.16em", textTransform: "uppercase", color: t.textDim, padding: "0 8px", marginBottom: 4, fontFamily: t.body }}>{section.label}</div>
            {section.items.map(item => (
              <button key={item.page} onClick={() => onNavigate(item.page)}
                style={{
                  width: "100%", background: activePage === item.page ? t.glacierDim : "none",
                  border: "none", borderRadius: 3,
                  color: activePage === item.page ? t.glacierHover : t.textMuted,
                  padding: "8px 10px", display: "flex", alignItems: "center", gap: 10,
                  fontSize: "0.8125rem", fontFamily: t.body, cursor: "pointer",
                  textAlign: "left", transition: "all 150ms",
                }}
                onMouseEnter={e => { if (activePage !== item.page) { e.currentTarget.style.background = t.surface2; e.currentTarget.style.color = t.text; } }}
                onMouseLeave={e => { if (activePage !== item.page) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = t.textMuted; } }}
              >
                <span style={{ opacity: 0.5, fontSize: "0.875rem" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: t.glacier, color: "#fff", fontSize: "0.5625rem", padding: "2px 6px", borderRadius: 2, fontWeight: 500 }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${t.glacier}, ${t.surface3})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", color: t.text, flexShrink: 0 }}>C</div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: "0.75rem", color: t.text, fontFamily: t.body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Caueh</div>
          <div style={{ fontSize: "0.5625rem", color: t.textDim, fontFamily: t.body }}>Admin</div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {i > 0 && <span style={{ color: t.textDim, fontSize: "0.6875rem", margin: "0 8px" }}>›</span>}
          <span style={{
            fontSize: "0.75rem", fontFamily: t.body,
            color: i === items.length - 1 ? t.text : t.textDim,
            cursor: item.href ? "pointer" : "default",
            letterSpacing: "0.02em",
          }}
            onMouseEnter={e => { if (item.href) e.currentTarget.style.color = t.glacierHover; }}
            onMouseLeave={e => { if (item.href) e.currentTarget.style.color = t.textDim; }}
          >
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

function Tabs({ tabs: tabList, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${t.border}` }}>
      {tabList.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          style={{
            background: "none", border: "none",
            borderBottom: `2px solid ${active === tab.key ? t.glacier : "transparent"}`,
            color: active === tab.key ? t.text : t.textMuted,
            padding: "10px 20px", fontSize: "0.8125rem",
            letterSpacing: "0.04em", cursor: "pointer",
            fontFamily: t.body, transition: "color 180ms, border-color 180ms",
            display: "flex", alignItems: "center", gap: 8,
          }}
          onMouseEnter={e => { if (active !== tab.key) e.currentTarget.style.color = t.text; }}
          onMouseLeave={e => { if (active !== tab.key) e.currentTarget.style.color = t.textMuted; }}
        >
          {tab.label}
          {tab.count != null && (
            <span style={{ background: active === tab.key ? t.glacierDim : t.surface3, color: active === tab.key ? t.glacierHover : t.textDim, fontSize: "0.5625rem", padding: "2px 6px", borderRadius: 2 }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── ACCORDION ───────────────────────────────────────────────────────────────
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : "none" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", background: open === i ? t.surface2 : "none", border: "none",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              color: t.text, fontFamily: t.body, fontSize: "0.875rem", cursor: "pointer",
              textAlign: "left", transition: "background 180ms",
            }}
            onMouseEnter={e => { if (open !== i) e.currentTarget.style.background = t.surface1; }}
            onMouseLeave={e => { if (open !== i) e.currentTarget.style.background = "none"; }}
          >
            <span>{item.title}</span>
            <span style={{ color: t.textDim, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 250ms cubic-bezier(0.4,0,0.2,1)", fontSize: "0.75rem" }}>▾</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 20px 16px", fontSize: "0.8125rem", color: t.textMuted, fontFamily: t.body, lineHeight: 1.7, animation: "fadeIn 180ms ease" }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────────────
function Table({ columns, rows }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [hoverRow, setHoverRow] = useState(null);

  const sorted = [...rows].sort((a, b) => {
    if (!sortCol) return 0;
    const av = a[sortCol], bv = b[sortCol];
    return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: t.body }}>
        <thead>
          <tr style={{ background: t.surface1 }}>
            {columns.map(col => (
              <th key={col.key} onClick={() => { setSortCol(col.key); setSortDir(sortCol === col.key && sortDir === "asc" ? "desc" : "asc"); }}
                style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: "0.5625rem", letterSpacing: "0.14em", textTransform: "uppercase",
                  color: sortCol === col.key ? t.glacierHover : t.textDim,
                  borderBottom: `1px solid ${t.border}`, cursor: "pointer",
                  userSelect: "none", whiteSpace: "nowrap",
                }}
              >
                {col.label} {sortCol === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} onMouseEnter={() => setHoverRow(i)} onMouseLeave={() => setHoverRow(null)}
              style={{ background: hoverRow === i ? t.surface2 : i % 2 === 0 ? "transparent" : t.surface1, transition: "background 120ms" }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: "12px 16px", fontSize: "0.8125rem", color: col.primary ? t.text : t.textMuted, borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function Progress({ value, max = 100, label, color, showValue }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          {label && <span style={{ fontSize: "0.6875rem", color: t.textMuted, fontFamily: t.body }}>{label}</span>}
          {showValue && <span style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: 4, background: t.surface3, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color || t.glacier, borderRadius: 2, transition: "width 600ms cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

// ─── UTILITY BUTTONS (inline) ─────────────────────────────────────────────────
function Btn({ children, onClick, primary, ghost, sm, danger }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: primary ? (h ? t.glacierHover : t.glacier) : ghost ? (h ? t.surface2 : "transparent") : danger ? (h ? "#B03636" : t.error) : (h ? t.surface2 : "transparent"),
        border: `1px solid ${primary ? (h ? t.glacierHover : t.glacier) : danger ? t.error : t.border}`,
        color: primary || danger ? "#FAFAF8" : h ? t.text : t.textMuted,
        padding: sm ? "6px 12px" : "9px 18px",
        borderRadius: 2, fontSize: sm ? "0.6875rem" : "0.75rem",
        letterSpacing: "0.06em", textTransform: "uppercase",
        fontFamily: t.body, cursor: "pointer", transition: "all 200ms",
      }}
    >{children}</button>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
        <h2 style={{ fontFamily: t.display, fontSize: "1.5rem", fontWeight: 300, color: t.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{title}</h2>
        {description && <p style={{ color: t.textMuted, fontSize: "0.8125rem", margin: 0, fontFamily: t.body }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DesignSystemPart3() {
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [navPage, setNavPage] = useState("Experiences");
  const [sideNav, setSideNav] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState("all");
  const [toastCount, setToastCount] = useState(0);

  const addToast = (type) => {
    const messages = {
      success: { title: "Booking Confirmed",   message: "The Silent Alps — 3 nights confirmed for March 14–17." },
      error:   { title: "Payment Failed",      message: "Your card was declined. Please try a different method." },
      warning: { title: "Availability Limited", message: "Only 2 slots remaining for this experience." },
      info:    { title: "New Experience Added", message: "Glacier Ski & Fondue is now available for booking." },
      default: { title: "Itinerary Updated",   message: "Your experience details have been saved." },
    };
    const id = ++toastCount;
    setToastCount(id);
    setToasts(prev => [...prev, { id, type, ...messages[type] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const experienceColumns = [
    { key: "name",     label: "Experience",  primary: true },
    { key: "location", label: "Location" },
    { key: "price",    label: "Price" },
    { key: "status",   label: "Status", render: (v) => {
      const colors = { Active: t.success, Draft: t.textDim, "Sold Out": t.error };
      return <span style={{ color: colors[v] || t.textMuted, fontSize: "0.6875rem", letterSpacing: "0.06em" }}>{v}</span>;
    }},
    { key: "bookings", label: "Bookings" },
  ];

  const experienceRows = [
    { name: "The Silent Alps",        location: "Villars-sur-Ollon", price: "CHF 4,200", status: "Active",   bookings: 12 },
    { name: "Glacier Ski & Fondue",   location: "Verbier",           price: "CHF 2,800", status: "Active",   bookings: 8  },
    { name: "Helicopter Gourmet",     location: "Zermatt",           price: "CHF 7,500", status: "Active",   bookings: 4  },
    { name: "Alpine Wellness Reset",  location: "Grindelwald",       price: "CHF 3,100", status: "Draft",    bookings: 0  },
    { name: "Matterhorn Sunrise",     location: "Zermatt",           price: "CHF 1,900", status: "Sold Out", bookings: 20 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeIn    { from { opacity:0 }                          to { opacity:1 } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:none } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:none } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px } ::-webkit-scrollbar-track { background:#0E0D0C } ::-webkit-scrollbar-thumb { background:#2C2A24; border-radius:3px }
        button { outline:none }
      `}</style>

      <div style={{ fontFamily: t.body, background: t.bg, color: t.text, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: "32px 40px 24px" }}>
          <span style={{ fontFamily: t.display, fontSize: 11, letterSpacing: "0.2em", color: t.glacier, textTransform: "uppercase" }}>Design System · Part 3 of 4</span>
          <h1 style={{ fontFamily: t.display, fontSize: "2.5rem", fontWeight: 300, letterSpacing: "-0.03em", margin: "4px 0 4px", color: "#FAFAF8" }}>Composite Components</h1>
          <p style={{ color: t.textMuted, fontSize: "0.875rem", margin: 0 }}>Card · Modal · Dropdown · Toast · Navigation · Tabs · Accordion · Table · Progress</p>
        </div>

        <div style={{ padding: "48px 40px" }}>

          {/* CARDS */}
          <Section title="Cards" description="3 card archetypes: Experience (booking), Stat (dashboard), Testimonial (social proof).">
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Experience Cards</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <ExperienceCard title="The Silent Alps" location="Villars-sur-Ollon, Vaud" price="CHF 4,200" duration="3 days" category="Private Stay" featured />
                <ExperienceCard title="Glacier Ski & Fondue" location="Verbier, Valais" price="CHF 2,800" duration="Full day" category="Ski & Snow" />
                <ExperienceCard title="Helicopter Gourmet" location="Zermatt, Valais" price="CHF 7,500" duration="Half day" category="Exclusive" featured />
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Stat Cards</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatCard label="Total Revenue"    value="CHF 84,200" delta="+23%"  icon="◈" />
                <StatCard label="Active Bookings"  value="24"          delta="+8%"   icon="◉" />
                <StatCard label="Avg. Package"     value="CHF 3,508"   delta="-4%"   icon="◎" />
                <StatCard label="New Clients"      value="11"          delta="+45%"  icon="◐" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Testimonial Cards</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <TestimonialCard quote="The attention to detail was extraordinary. Every moment felt curated for us personally." author="Alexandre Dupont" role="CEO, Geneva" rating={5} />
                <TestimonialCard quote="Switzerland has never felt so alive. The helicopter transfer alone was worth it." author="Sofia Mendes" role="CFO, São Paulo" rating={5} />
              </div>
            </div>
          </Section>

          {/* MODAL */}
          <Section title="Modal" description="Backdrop blur overlay with spring entrance animation. Click outside or × to dismiss.">
            <div style={{ display: "flex", gap: 10 }}>
              <Btn primary onClick={() => setModal1(true)}>Open Booking Modal</Btn>
              <Btn ghost onClick={() => setModal2(true)}>Open Confirm Modal</Btn>
            </div>
          </Section>

          {/* DROPDOWN */}
          <Section title="Dropdown Menu" description="Click-outside aware menu with labels, dividers, icons, shortcuts, and danger variants.">
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <Dropdown
                trigger={<Btn primary>Experience Actions ▾</Btn>}
                items={[
                  { type: "label", label: "Manage" },
                  { icon: "✏", label: "Edit Experience",  shortcut: "⌘E" },
                  { icon: "⎘", label: "Duplicate",        shortcut: "⌘D" },
                  { icon: "↗", label: "Preview Page" },
                  { type: "divider" },
                  { type: "label", label: "Status" },
                  { icon: "◉", label: "Mark as Active" },
                  { icon: "◎", label: "Mark as Draft" },
                  { type: "divider" },
                  { icon: "⊗", label: "Delete Experience", danger: true },
                ]}
              />
              <Dropdown
                align="right"
                trigger={<Btn ghost>Profile ▾</Btn>}
                items={[
                  { icon: "◈", label: "View Profile" },
                  { icon: "◎", label: "Account Settings" },
                  { icon: "◐", label: "Billing & Plans" },
                  { type: "divider" },
                  { icon: "⊗", label: "Sign Out", danger: true },
                ]}
              />
            </div>
          </Section>

          {/* TOAST */}
          <Section title="Toast Notifications" description="5 types with auto-dismiss after 4 seconds. Stack bottom-right.">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["success", "error", "warning", "info", "default"].map(type => (
                <Btn key={type} ghost sm onClick={() => addToast(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Btn>
              ))}
            </div>
          </Section>

          {/* NAVIGATION */}
          <Section title="Navigation" description="Top nav and side nav with active state, badges, and user footer.">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Top Navigation</div>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
                <TopNav activePage={navPage} onNavigate={setNavPage} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Side Navigation</div>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: "hidden", display: "inline-block" }}>
                <SideNav activePage={sideNav} onNavigate={setSideNav} />
              </div>
            </div>
          </Section>

          {/* TABS + BREADCRUMBS */}
          <Section title="Tabs · Breadcrumbs" description="Controlled tabs with count badges. Breadcrumbs for page hierarchy.">
            <div style={{ width: "100%", marginBottom: 32 }}>
              <Tabs
                tabs={[
                  { key: "all",      label: "All Experiences", count: 24 },
                  { key: "active",   label: "Active",          count: 18 },
                  { key: "draft",    label: "Drafts",          count: 4  },
                  { key: "archived", label: "Archived",        count: 2  },
                ]}
                active={activeTab}
                onChange={setActiveTab}
              />
              <div style={{ padding: "16px 0", fontSize: "0.8125rem", color: t.textDim, fontFamily: t.body }}>
                Showing tab: <span style={{ color: t.glacierHover }}>{activeTab}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: t.textDim, marginBottom: 12, fontFamily: t.body }}>Breadcrumbs</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Experiences" }]} />
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Experiences", href: "/experiences" }, { label: "The Silent Alps" }]} />
                <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Bookings", href: "/bookings" }, { label: "BK-0042" }]} />
              </div>
            </div>
          </Section>

          {/* ACCORDION */}
          <Section title="Accordion" description="FAQ / expandable content with smooth reveal and rotating chevron.">
            <div style={{ maxWidth: 560 }}>
              <Accordion items={[
                { title: "What is included in each experience package?", content: "All Swissperiences packages include private transfers in a Range Rover, curated local guides, restaurant reservations, and a bespoke post-experience ebook delivered within 48 hours." },
                { title: "What is your cancellation policy?", content: "Cancellations made 14+ days in advance receive a full refund. Within 7–14 days: 50% refund. Under 7 days: non-refundable. We strongly recommend travel insurance for all bookings." },
                { title: "Can experiences be fully customised?", content: "Absolutely. All experiences are starting templates. Contact us and we'll design an itinerary around your preferences, dietary requirements, and travel dates." },
                { title: "Do you offer corporate or group bookings?", content: "Yes. We offer dedicated corporate rates for groups of 6+ with bespoke programming, private venue buy-outs, and white-label options for companies." },
              ]} />
            </div>
          </Section>

          {/* TABLE */}
          <Section title="Data Table" description="Sortable columns, hover row highlight, alternating rows, and custom cell rendering.">
            <Table columns={experienceColumns} rows={experienceRows} />
          </Section>

          {/* PROGRESS */}
          <Section title="Progress" description="Linear progress bar for booking completion, revenue targets, and onboarding flows.">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
              <Progress label="Booking Completion"  value={78} showValue color={t.glacier} />
              <Progress label="Monthly Revenue Goal" value={61} showValue color={t.gold} />
              <Progress label="Profile Setup"        value={40} showValue color={t.textMuted} />
              <Progress label="Sold Out"             value={100} showValue color={t.error} />
            </div>
          </Section>

        </div>
      </div>

      {/* MODALS */}
      <Modal open={modal1} onClose={() => setModal1(false)} title="Book Experience" subtitle="The Silent Alps — Villars-sur-Ollon" size="md"
        footer={<><Btn ghost onClick={() => setModal1(false)}>Cancel</Btn><Btn primary onClick={() => { setModal1(false); addToast("success"); }}>Confirm Booking</Btn></>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 4, padding: "16px 18px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body, marginBottom: 4 }}>Duration</div>
              <div style={{ fontSize: "0.9375rem", color: t.text, fontFamily: t.display, fontWeight: 300 }}>3 Nights</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body, marginBottom: 4 }}>Total</div>
              <div style={{ fontSize: "1.375rem", color: t.gold, fontFamily: t.display, fontWeight: 300 }}>CHF 4,200</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Arrival</div>
              <input type="date" style={{ width: "100%", background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 2, padding: "9px 12px", color: t.text, fontFamily: t.body, fontSize: "0.875rem", outline: "none" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.6875rem", color: t.textDim, fontFamily: t.body, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guests</div>
              <input type="number" defaultValue={2} min={1} max={8} style={{ width: "100%", background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 2, padding: "9px 12px", color: t.text, fontFamily: t.body, fontSize: "0.875rem", outline: "none" }} />
            </div>
          </div>
          <textarea placeholder="Special requests or notes…" rows={3} style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 2, padding: "10px 12px", color: t.text, fontFamily: t.body, fontSize: "0.875rem", outline: "none", resize: "vertical" }} />
        </div>
      </Modal>

      <Modal open={modal2} onClose={() => setModal2(false)} title="Cancel Experience" subtitle="This action cannot be undone." size="sm"
        footer={<><Btn ghost onClick={() => setModal2(false)}>Keep Booking</Btn><Btn danger onClick={() => { setModal2(false); addToast("error"); }}>Cancel Booking</Btn></>}
      >
        <p style={{ color: t.textMuted, fontSize: "0.875rem", fontFamily: t.body, lineHeight: 1.7, margin: 0 }}>
          You are about to cancel <span style={{ color: t.text }}>The Silent Alps</span> for <span style={{ color: t.text }}>March 14–17</span>. Per our policy, bookings cancelled within 7 days are non-refundable.
        </p>
      </Modal>

      {/* TOAST CONTAINER */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
