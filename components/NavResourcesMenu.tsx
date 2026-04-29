"use client";

import { useTheme } from "./ThemeProvider";
import {
  FileText,
  FileSpreadsheet,
  Users,
  BookOpen,
  CalendarDays,
  Wrench,
  Search,
  Video,
  ScrollText,
  Megaphone,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LinkItem = { label: string; icon: LucideIcon };

const RESOURCES_LEFT: LinkItem[] = [
  { label: "Blogs", icon: FileText },
  { label: "Case Studies", icon: FileSpreadsheet },
  { label: "Customer Stories", icon: Users },
  { label: "eBooks", icon: BookOpen },
  { label: "Events & Webinars", icon: CalendarDays },
];

const RESOURCES_RIGHT: LinkItem[] = [
  { label: "Free Tools", icon: Wrench },
  { label: "Research", icon: Search },
  { label: "Videos", icon: Video },
  { label: "White Papers", icon: ScrollText },
];

const ROOFING: LinkItem[] = [
  { label: "No Quit Community", icon: Users },
  { label: "Raise the Roof", icon: Megaphone },
  { label: "Success Stories", icon: Trophy },
];

export default function NavResourcesMenu() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surface = isDark ? "#1E1E23" : "#ffffff";
  const surfaceBottom = isDark ? "#16161A" : "#f9f8f6";
  const panelBg = `linear-gradient(180deg, ${surface} 0%, ${surfaceBottom} 100%)`;
  const ink = isDark ? "rgba(255,255,255,0.95)" : "#1a1714";
  const inkMuted = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
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

  const sectionHead = (label: string) => (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: inkMuted,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "14px",
      }}
    >
      {label}
    </div>
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
        gridTemplateColumns: "1.4fr 1fr 1.1fr",
        gap: "28px",
        width: "920px",
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

      {/* Col 1: Resources, two-column */}
      <div>
        {sectionHead("Resources")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {RESOURCES_LEFT.map(renderItem)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {RESOURCES_RIGHT.map(renderItem)}
          </div>
        </div>
      </div>

      {/* Col 2: Roofing */}
      <div style={{ paddingLeft: "20px", borderLeft: `1px solid ${divider}` }}>
        {sectionHead("Roofing")}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {ROOFING.map(renderItem)}
        </div>
      </div>

      {/* Col 3: Featured story */}
      <div style={{ paddingLeft: "20px", borderLeft: `1px solid ${divider}` }}>
        <button
          type="button"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            padding: 0,
            border: `1px solid ${border}`,
            borderRadius: "14px",
            overflow: "hidden",
            cursor: "pointer",
            fontFamily: "inherit",
            background: "transparent",
            aspectRatio: "292 / 240",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <img
            src="/nav/resource-maven.png"
            alt="Maven Roofing"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "55%",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
            }}
          />
          {/* Badge */}
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: accent,
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              padding: "4px 10px",
              borderRadius: "4px",
              textTransform: "lowercase",
            }}
          >
            success story
          </span>
          {/* Title */}
          <div
            style={{
              position: "absolute",
              left: "14px",
              right: "14px",
              bottom: "14px",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              textAlign: "left",
            }}
          >
            How Maven Roofing Modernized Operations with Zuper
          </div>
        </button>
      </div>
    </div>
  );
}
