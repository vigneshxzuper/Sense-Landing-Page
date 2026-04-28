"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { label: "Ask", href: "#analyze-section" },
  { label: "Analyze", href: "#analyze-section" },
  { label: "Act", href: "#act-section" },
  { label: "Radar", href: "#radar-section" },
  { label: "Docs", href: "#docs-section" },
  { label: "Showcase", href: "#showcase-section" },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: "14px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "calc(100% - 48px)",
        maxWidth: "1100px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
          padding: "0 6px 0 20px",
          borderRadius: "14px",
          background: isDark
            ? "rgba(12,12,14,0.82)"
            : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark
            ? "0 4px 32px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 4px 32px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.7)",
          transition: "background 0.5s, border-color 0.5s, box-shadow 0.5s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2px",
              width: "16px",
              height: "16px",
            }}
          >
            <div style={{ borderRadius: "2.5px", background: "#E85D3A" }} />
            <div style={{ borderRadius: "2.5px", background: "#E85D3A", opacity: 0.6 }} />
            <div style={{ borderRadius: "2.5px", background: "#E85D3A", opacity: 0.6 }} />
            <div style={{ borderRadius: "2.5px", background: "#E85D3A", opacity: 0.3 }} />
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 650,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Zuper Sense
          </span>
        </div>

        {/* Center links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className="nav-link"
              style={{
                fontSize: "13px",
                fontWeight: 450,
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                transition: "background 0.15s, transform 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: theme + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <button
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {isDark ? (
              <Moon style={{ width: 14, height: 14, color: "rgba(255,255,255,0.5)" }} />
            ) : (
              <Sun style={{ width: 14, height: 14, color: "rgba(0,0,0,0.45)" }} />
            )}
          </button>

          <a
            href="#analyze-section"
            onClick={(e) => handleNav(e, "#analyze-section")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              borderRadius: "8px",
              background: isDark ? "rgba(255,255,255,0.9)" : "#1a1714",
              color: isDark ? "#0a0a0a" : "#ffffff",
              fontSize: "13px",
              fontWeight: 550,
              textDecoration: "none",
              whiteSpace: "nowrap",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "transparent"}`,
              transition: "opacity 0.15s, background 0.5s, color 0.5s, border-color 0.5s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Try Sense
          </a>
        </div>
      </div>
    </nav>
  );
}
