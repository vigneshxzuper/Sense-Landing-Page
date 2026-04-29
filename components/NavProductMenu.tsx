"use client";

import { useTheme } from "./ThemeProvider";
import {
  ArrowUpRight,
  ClipboardCheck,
  ListChecks,
  Calculator,
  FileText,
  CalendarDays,
  Headphones,
  WifiOff,
  Camera,
  ClipboardList,
  LayoutDashboard,
  Boxes,
  Smartphone,
  Package,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type LinkItem = { label: string; icon: LucideIcon };

const ROOFING: LinkItem[] = [
  { label: "Guided selling", icon: ClipboardCheck },
  { label: "Hands-Free Checklists", icon: ListChecks },
  { label: "Intelligent Quoting", icon: Calculator },
  { label: "Instant Estimates", icon: FileText },
  { label: "Website Booking", icon: CalendarDays },
  { label: "Live Remote Assist", icon: Headphones },
  { label: "Offline Mobile Access", icon: WifiOff },
  { label: "Photo & Video Capture", icon: Camera },
];

const FSM: LinkItem[] = [
  { label: "Work Orders", icon: ClipboardList },
  { label: "Dispach Board", icon: LayoutDashboard },
  { label: "Inventory", icon: Boxes },
  { label: "Mobile app", icon: Smartphone },
  { label: "Asset Management", icon: Package },
  { label: "Invoice Management", icon: Receipt },
];

type Product = { name: string; image: string };

const PRODUCTS: Product[] = [
  { name: "Zuper Glass", image: "/nav/product-glass.png" },
  { name: "Zuper Pay", image: "/nav/product-pay.png" },
  { name: "Zuper Connect", image: "/nav/product-connect.png" },
  { name: "Zuper Fleet", image: "/nav/product-fleet.png" },
];

export default function NavProductMenu() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surface = isDark ? "#1E1E23" : "#ffffff";
  const surfaceBottom = isDark ? "#16161A" : "#f9f8f6";
  const panelBg = `linear-gradient(180deg, ${surface} 0%, ${surfaceBottom} 100%)`;
  const ink = isDark ? "rgba(255,255,255,0.95)" : "#1a1714";
  const ink2 = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const iconInk = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,18,24,0.09)";
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accent = "#E85D3A";

  const renderColumn = (heading: string, sub: string, items: LinkItem[], showMore?: boolean) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: ink, letterSpacing: "-0.01em" }}>
          {heading}
        </span>
        <ArrowUpRight style={{ width: 14, height: 14, color: accent }} />
      </div>
      <div style={{ fontSize: "12px", color: ink2, lineHeight: 1.4, maxWidth: "200px" }}>{sub}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px" }}>
        {items.map(({ label, icon: Icon }) => (
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
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
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
        ))}
        {showMore && (
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
            }}
          >
            See more Features
            <ArrowUpRight style={{ width: 13, height: 13 }} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        background: panelBg,
        border: `1px solid ${border}`,
        borderRadius: "22px",
        padding: "32px",
        boxShadow: isDark
          ? "0 16px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 12px 32px rgba(15,18,24,0.08), 0 2px 6px rgba(15,18,24,0.04)",
        display: "grid",
        gridTemplateColumns: "440px 1fr",
        gap: "32px",
        width: "1000px",
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

      {/* LEFT: Two columns of features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "24px",
        }}
      >
        {renderColumn(
          "Roofing and Exteriors",
          "Purpose built for your roofing business",
          ROOFING,
        )}
        {renderColumn(
          "Field Service Management",
          "Power every step from lead to payment.",
          FSM,
          true,
        )}
      </div>

      {/* RIGHT: products + integrations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          paddingLeft: "32px",
          borderLeft: `1px solid ${divider}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {PRODUCTS.map((p) => (
            <button
              key={p.name}
              type="button"
              aria-label={p.name}
              style={{
                position: "relative",
                display: "block",
                padding: 0,
                borderRadius: "14px",
                overflow: "hidden",
                border: `1px solid ${border}`,
                cursor: "pointer",
                fontFamily: "inherit",
                background: "transparent",
                aspectRatio: "433 / 296",
                width: "100%",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </button>
          ))}
        </div>

        <div
          style={{
            paddingTop: "14px",
            borderTop: `1px solid ${divider}`,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, color: ink, letterSpacing: "-0.01em" }}>
            Integrations
          </div>
          <div style={{ fontSize: "12px", color: ink2 }}>
            Zuper plays nice with the tools you love
          </div>
          <button
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "4px",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              color: accent,
              alignSelf: "flex-start",
            }}
          >
            See 60+ integrations
            <ArrowUpRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
