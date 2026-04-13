"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { GradientBlindsProps } from "../GradientBlinds";
import { Sparkles, BookOpen } from "lucide-react";

const GradientBlinds = dynamic<GradientBlindsProps>(
  () =>
    import("../GradientBlinds").then(
      (m) => m.default as ComponentType<GradientBlindsProps>
    ),
  { ssr: false }
);

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the animation is visible after paint
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s",
      }}
    >
      {/* GradientBlinds background (dark mode only) */}
      {isDark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <GradientBlinds
            gradientColors={["#FD8627", "#EA0602"]}
            angle={180}
            noise={0.6}
            blindCount={26}
            blindMinWidth={40}
            spotlightRadius={0.55}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
        </div>
      )}

      {/* Dark mode: subtle overlay to boost text readability */}
      {isDark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(9,9,11,0.55) 0%, rgba(9,9,11,0.25) 60%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: isDark
              ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)"
              : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px) saturate(140%)",
            WebkitBackdropFilter: "blur(16px) saturate(140%)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: "100px",
            padding: "7px 16px",
            marginBottom: "36px",
            fontSize: "13px",
            fontWeight: 500,
            color: isDark ? "rgba(255,255,255,0.9)" : "var(--ink2)",
            letterSpacing: "0.02em",
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1), background 0.5s, border-color 0.5s, box-shadow 0.5s, color 0.5s",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#E85D3A",
              boxShadow: "0 0 10px #E85D3A",
              flexShrink: 0,
            }}
          />
          Zuper Sense &middot; Intelligence Layer
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(52px, 9vw, 100px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            textAlign: "center",
            maxWidth: "880px",
            marginBottom: "24px",
            color: "var(--ink)",
            textShadow: isDark
              ? "0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.3)"
              : "none",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.12s, text-shadow 0.5s, color 0.5s",
            cursor: "default",
          }}
        >
          Your business,
          <br />
          <span
            className="hero-italic"
            style={{
              fontStyle: "italic",
              color: isDark ? "#FFFFFF" : "#E85D3A",
              textShadow: isDark
                ? "0 0 40px rgba(255,255,255,0.2), 0 2px 10px rgba(0,0,0,0.5)"
                : "0 1px 4px rgba(232,93,58,0.2)",
              transition: "color 0.5s, text-shadow 0.5s",
            }}
          >
            finally speaking.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: isDark ? "rgba(255,255,255,0.75)" : "var(--ink2)",
            textAlign: "center",
            maxWidth: "540px",
            lineHeight: 1.65,
            fontWeight: 400,
            textShadow: isDark ? "0 2px 12px rgba(0,0,0,0.5)" : "none",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.24s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.24s, color 0.5s, text-shadow 0.5s",
          }}
        >
          Zuper Sense turns your operational data into plain-English
          answers&nbsp;&mdash; and turns those answers into action.
        </p>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "40px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s",
          }}
        >
          {[
            {
              label: "Try Sense",
              href: "#analyze-section",
              icon: <Sparkles style={{ width: 14, height: 14 }} />,
            },
            {
              label: "Documentation",
              href: "#docs-section",
              icon: <BookOpen style={{ width: 14, height: 14 }} />,
            },
          ].map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector(btn.href)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hero-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                background: isDark
                  ? "rgba(255,255,255,0.93)"
                  : "#ffffff",
                color: isDark ? "#111" : "#1a1714",
                fontSize: "13.5px",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "-0.005em",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                boxShadow: isDark
                  ? "0 1px 3px rgba(0,0,0,0.3)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
                transition:
                  "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s, background 0.5s, color 0.5s, border-color 0.5s",
              }}
            >
              {btn.icon}
              {btn.label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .hero-cta:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        }
        .hero-cta:active {
          transform: translateY(0) !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
        }
        .hero-italic {
          transition: filter 0.3s ease;
        }
      `}</style>
    </section>
  );
}
