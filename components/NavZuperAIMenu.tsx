"use client";

import { useTheme } from "./ThemeProvider";
import { Mic, ArrowUp } from "lucide-react";

type Agent = {
  name: string;
  desc?: string;
  comingSoon?: boolean;
  image: string;
};

const AGENTS: Agent[] = [
  { name: "CSR Agent", desc: "Never miss another call", image: "/nav/csr.png" },
  { name: "Collection Agent", comingSoon: true, image: "/nav/collection.png" },
  { name: "Field Agent", desc: "Your sidekick on every job", image: "/nav/field.png" },
  { name: "Sales Agent", comingSoon: true, image: "/nav/sales.png" },
  { name: "Billing Agent", comingSoon: true, image: "/nav/billing.png" },
];

export default function NavZuperAIMenu() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surface = isDark ? "#1E1E23" : "#ffffff";
  const surfaceBottom = isDark ? "#16161A" : "#f9f8f6";
  const panelBg = `linear-gradient(180deg, ${surface} 0%, ${surfaceBottom} 100%)`;
  const ink = isDark ? "rgba(255,255,255,0.95)" : "#1a1714";
  const ink2 = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,18,24,0.09)";
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const cardHover = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.025)";

  return (
    <div
      style={{
        position: "relative",
        background: panelBg,
        border: `1px solid ${border}`,
        borderRadius: "22px",
        padding: "40px",
        boxShadow: isDark
          ? "0 16px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 12px 32px rgba(15,18,24,0.08), 0 2px 6px rgba(15,18,24,0.04)",
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: "44px",
        width: "960px",
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

      {/* LEFT: Sense preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            position: "relative",
            height: "240px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#0e0e10",
            border: `1px solid ${border}`,
          }}
        >
          {/* Blinds image — stretched to fill the whole card */}
          <img
            src="/nav/blinds.png"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left center",
            }}
          />

          {/* Subtle dark gradient over image for legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          {/* Chat input mock */}
          <div
            style={{
              position: "absolute",
              left: "20px",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.97)",
              borderRadius: "14px",
              padding: "16px 16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "rgba(0,0,0,0.6)",
                letterSpacing: "-0.005em",
              }}
            >
              Show me my overdue invoices
            </span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Mic style={{ width: 15, height: 15, color: "rgba(0,0,0,0.45)" }} />
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#1a1714",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowUp style={{ width: 14, height: 14, color: "#fff" }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "16px", fontWeight: 650, color: ink, letterSpacing: "-0.01em" }}>
            Zuper Sense
          </div>
          <div style={{ fontSize: "13px", color: ink2, marginTop: "4px" }}>
            Your Intelligent Command Center
          </div>
        </div>
      </div>

      {/* RIGHT: Agent grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "28px",
          rowGap: "22px",
          paddingLeft: "40px",
          borderLeft: `1px solid ${divider}`,
          alignContent: "start",
        }}
      >
        {AGENTS.map((a) => (
          <button
            key={a.name + (a.comingSoon ? "-soon" : "")}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "8px",
              margin: "-8px",
              borderRadius: "12px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = cardHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                flexShrink: 0,
                overflow: "hidden",
                backgroundImage: `url(${a.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                boxShadow: "0 4px 12px rgba(180,55,30,0.22)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 650,
                  color: ink,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {a.name}
              </div>
              {a.comingSoon ? (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "5px",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#ffffff",
                    background: "#E85D3A",
                    borderRadius: "999px",
                    padding: "2px 10px",
                    letterSpacing: "0.01em",
                  }}
                >
                  Coming Soon
                </span>
              ) : (
                <div style={{ fontSize: "13px", color: ink2, marginTop: "3px", lineHeight: 1.4 }}>
                  {a.desc}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
