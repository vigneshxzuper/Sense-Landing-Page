"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "24px",
        zIndex: 9999,
      }}
    >
      <button
        onClick={toggle}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          borderRadius: "100px",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
          background: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
          width: "68px",
          height: "34px",
          boxShadow: isDark
            ? "0 2px 12px rgba(0,0,0,0.4)"
            : "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Track icons */}
        <div style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
          <Moon className="w-3.5 h-3.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ position: "absolute", right: "9px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
          <Sun className="w-3.5 h-3.5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.4)" }} />
        </div>
        {/* Thumb */}
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: isDark ? "#FAFAFA" : "#1a1a1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isDark ? "translateX(0)" : "translateX(34px)",
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.4s",
            boxShadow: "0 1px 6px rgba(0,0,0,0.25)",
          }}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5" style={{ color: "#09090B" }} />
          ) : (
            <Sun className="w-3.5 h-3.5" style={{ color: "#FAFAFA" }} />
          )}
        </div>
      </button>
    </div>
  );
}
