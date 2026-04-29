"use client";

import { useTheme } from "./ThemeProvider";
import {
  ArrowUpRight,
  Fence,
  Trees,
  Droplets,
  Sun,
  Warehouse,
  Home,
  AppWindow,
  ArrowDownToLine,
  Zap,
  Wind,
  Plug,
  Wrench,
  Waves,
  Factory,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LinkItem = { label: string; icon: LucideIcon };

const ROOFING_LEFT: LinkItem[] = [
  { label: "Fencing", icon: Fence },
  { label: "Landscaping", icon: Trees },
  { label: "Pressure Washing", icon: Droplets },
  { label: "Solar", icon: Sun },
  { label: "Garage Doors", icon: Warehouse },
];

const ROOFING_RIGHT: LinkItem[] = [
  { label: "Siding", icon: Home },
  { label: "Windows", icon: AppWindow },
  { label: "Gutters", icon: ArrowDownToLine },
  { label: "Generators", icon: Zap },
];

const FSM: LinkItem[] = [
  { label: "HVAC", icon: Wind },
  { label: "Electrical", icon: Plug },
  { label: "Plumbing", icon: Wrench },
  { label: "Pool Service", icon: Waves },
  { label: "Manufacturing", icon: Factory },
];

export default function NavSolutionsMenu() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surface = isDark ? "#1E1E23" : "#ffffff";
  const surfaceBottom = isDark ? "#16161A" : "#f9f8f6";
  const panelBg = `linear-gradient(180deg, ${surface} 0%, ${surfaceBottom} 100%)`;
  const ink = isDark ? "rgba(255,255,255,0.95)" : "#1a1714";
  const ink2 = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const iconInk = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const iconBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,18,24,0.09)";
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accent = "#E85D3A";

  const renderItem = ({ label, icon: Icon }: LinkItem) => (
    <button
      key={label}
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 8px",
        margin: "0 -8px",
        background: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.03)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "6px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 12, height: 12, color: iconInk }} />
      </span>
      <span style={{ fontSize: "13px", color: ink, letterSpacing: "-0.005em" }}>{label}</span>
    </button>
  );

  return (
    <div
      style={{
        position: "relative",
        background: panelBg,
        border: `1px solid ${border}`,
        borderRadius: "22px",
        padding: "24px",
        boxShadow: isDark
          ? "0 16px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 12px 32px rgba(15,18,24,0.08), 0 2px 6px rgba(15,18,24,0.04)",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: "28px",
        width: "820px",
      }}
    >
      {/* Caret */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-7px",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: "12px",
          height: "12px",
          background: surface,
          borderTop: `1px solid ${border}`,
          borderLeft: `1px solid ${border}`,
        }}
      />

      {/* LEFT: Zuper For Roofing */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Banner */}
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            minHeight: "84px",
            background: "#ffffff",
            border: `1px solid ${border}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "60%", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: accent, letterSpacing: "-0.01em" }}>
                Zuper For Roofing
              </span>
              <ArrowUpRight style={{ width: 14, height: 14, color: accent }} />
            </div>
            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.65)", lineHeight: 1.4 }}>
              Purpose built for your roofing business
            </div>
          </div>
          <img
            src="/nav/solutions-roofing.png"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              height: "100%",
              width: "auto",
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        </div>

        {/* Two columns of trades */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "20px",
            rowGap: "0",
            paddingLeft: "4px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {ROOFING_LEFT.map(renderItem)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {ROOFING_RIGHT.map(renderItem)}
          </div>
        </div>
      </div>

      {/* RIGHT: Field Service Management */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingLeft: "24px",
          borderLeft: `1px solid ${divider}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: accent, letterSpacing: "-0.01em" }}>
            Field Service Management
          </span>
          <ArrowUpRight style={{ width: 14, height: 14, color: accent }} />
        </div>
        <div style={{ fontSize: "12px", color: ink2, lineHeight: 1.4 }}>
          Power every step from lead to payment.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "6px" }}>
          {FSM.map(renderItem)}
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px",
              margin: "4px -8px 0",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              color: accent,
              textAlign: "left",
              alignSelf: "flex-start",
            }}
          >
            See more Trades
            <ArrowUpRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
