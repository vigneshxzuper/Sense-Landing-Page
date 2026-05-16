"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import RollText from "@/components/RollText";
import NavZuperAIMenu from "./NavZuperAIMenu";
import NavProductMenu from "./NavProductMenu";
import NavSolutionsMenu from "./NavSolutionsMenu";
import NavResourcesMenu from "./NavResourcesMenu";
import SenseLogo from "./SenseLogo";

const NAV_LINKS: Array<{ label: string; menu?: "zuperAI" | "product" | "solutions" | "resources" }> = [
  { label: "Zuper AI", menu: "zuperAI" },
  { label: "Product", menu: "product" },
  { label: "Solutions", menu: "solutions" },
  { label: "Resources", menu: "resources" },
];

export default function Navbar() {
  const isDark = true;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal nav as the in-monitor zoom completes and the "Command center"
  // hero settles full-screen — that's ~t=0.85 of the 300vh pinned timeline
  // (zoom from t=0.30, duration 0.55). 2.5 × vh lands a hair before so the
  // nav slides in as the headline locks in, not after pin release.
  const [navReady, setNavReady] = useState(false);
  useEffect(() => {
    // On mobile the CRT hero is replaced by the static hero, so the
    // nav can show immediately. On desktop, wait for the 300vh pinned
    // CRT timeline to finish.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      setNavReady(true);
      return;
    }
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 2.5) {
        if (!navReady) setNavReady(true);
      } else if (navReady) {
        setNavReady(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navReady]);

  const openWithLabel = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 220);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        transform: navReady ? "translateY(0)" : "translateY(-100%)",
        opacity: navReady ? 1 : 0,
        pointerEvents: navReady ? "auto" : "none",
        transition:
          "opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 9999,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          padding: "0 24px",
          background: isDark
            ? "rgba(12,12,14,0.82)"
            : "rgba(255,255,255,0.78)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          transition: "background 0.5s, border-color 0.5s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <SenseLogo size={20} />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Zuper Sense
          </span>
        </div>

        {/* Center links */}
        <div className="nav-center-links" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV_LINKS.map((link) => {
            const isOpen = openMenu === link.label;
            return (
              <div
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() => link.menu && openWithLabel(link.label)}
                onMouseLeave={() => link.menu && scheduleClose()}
              >
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 450,
                    color: isOpen
                      ? (isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)")
                      : (isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)"),
                    background: isOpen
                      ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                      : "transparent",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    transition:
                      "background 200ms cubic-bezier(0.22, 1, 0.36, 1), color 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (openMenu !== link.label) {
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = openMenu === link.label
                      ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                      : "transparent";
                  }}
                >
                  {link.label}
                  <ChevronDown
                    style={{
                      width: 12,
                      height: 12,
                      opacity: 0.7,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </button>

                {link.menu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 22px)",
                      left: "50%",
                      transformOrigin: "top center",
                      transform: isOpen
                        ? "translateX(-50%) translateY(0) scale(1)"
                        : "translateX(-50%) translateY(-10px) scale(0.97)",
                      opacity: isOpen ? 1 : 0,
                      pointerEvents: isOpen ? "auto" : "none",
                      transition:
                        "opacity 420ms cubic-bezier(0.32, 0.72, 0, 1), transform 520ms cubic-bezier(0.32, 0.72, 0, 1)",
                      willChange: "opacity, transform",
                      zIndex: 10000,
                      paddingTop: "12px",
                    }}
                    onMouseEnter={() => openWithLabel(link.label)}
                    onMouseLeave={scheduleClose}
                  >
                    {link.menu === "zuperAI" && <NavZuperAIMenu />}
                    {link.menu === "product" && <NavProductMenu />}
                    {link.menu === "solutions" && <NavSolutionsMenu />}
                    {link.menu === "resources" && <NavResourcesMenu />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <a
            href="#analyze-section"
            className="btn-roll nav-press"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#analyze-section")?.scrollIntoView({ behavior: "smooth" });
            }}
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
              transition: "opacity 200ms cubic-bezier(0.22, 1, 0.36, 1), transform 140ms cubic-bezier(0.22, 1, 0.36, 1), background 500ms, color 500ms, border-color 500ms",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <RollText>Try Sense</RollText>
          </a>
        </div>
      </div>
    </nav>
  );
}
