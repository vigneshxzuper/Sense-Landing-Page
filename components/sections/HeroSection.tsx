"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { SenseChat } from "@/components/ui/sense-chat";
import { useTheme } from "@/components/ThemeProvider";
import type { GradientBlindsProps } from "../GradientBlinds";

const GradientBlinds = dynamic<GradientBlindsProps>(
  () => import("../GradientBlinds").then((m) => m.default as ComponentType<GradientBlindsProps>),
  { ssr: false }
);

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      {/* === LAYER 1: GradientBlinds background === */}
      {/* Dark mode version */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.6s",
          pointerEvents: isDark ? "auto" : "none",
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
      {/* Light mode version */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: isDark ? 0 : 1,
          transition: "opacity 0.6s",
          pointerEvents: isDark ? "none" : "auto",
        }}
      >
        <GradientBlinds
          gradientColors={["#FFDAB9", "#FFB088"]}
          angle={180}
          noise={0.4}
          blindCount={26}
          blindMinWidth={40}
          spotlightRadius={0.65}
          spotlightSoftness={1.2}
          spotlightOpacity={0.8}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="darken"
        />
      </div>

      {/* === LAYER 2: Content === */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          filter: isDark
            ? "drop-shadow(0 0 80px rgba(0,0,0,0.6))"
            : "drop-shadow(0 0 60px rgba(0,0,0,0.15))",
          transition: "filter 0.5s",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: isDark
              ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)",
            backdropFilter: "blur(16px) saturate(140%)",
            WebkitBackdropFilter: "blur(16px) saturate(140%)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)"}`,
            borderRadius: "100px",
            padding: "6px 14px",
            marginBottom: "32px",
            fontSize: "13px",
            color: "var(--ink)",
            letterSpacing: "0.01em",
            textShadow: isDark ? "0 1px 6px rgba(0,0,0,0.6)" : "none",
            boxShadow: isDark
              ? "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
            transition: "all 0.5s",
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
          Zuper Sense · Intelligence Layer
        </div>

        {/* Headline */}
        <h1
          className="hero-headline"
          style={{
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "16px",
            color: "var(--ink)",
            textShadow: isDark
              ? "0 0 12px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.7), 0 8px 48px rgba(0,0,0,0.5), 0 0 60px rgba(255,69,0,0.12)"
              : "0 1px 4px rgba(0,0,0,0.1)",
            transition: "text-shadow 0.5s, color 0.5s",
            cursor: "default",
          }}
        >
          Your business,{" "}
          <span
            className="hero-italic"
            style={{
              fontStyle: "italic",
              color: isDark ? "#FFFFFF" : "#E85D3A",
              textShadow: isDark
                ? "0 0 12px rgba(0,0,0,1), 0 0 20px rgba(255,69,0,0.8), 0 0 60px rgba(255,69,0,0.4), 0 0 120px rgba(255,69,0,0.2), 0 2px 8px rgba(0,0,0,0.9)"
                : "0 1px 4px rgba(232,93,58,0.2)",
              transition: "all 0.5s",
            }}
          >
            finally speaking.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--ink2)",
            textAlign: "center",
            maxWidth: "560px",
            lineHeight: 1.6,
            marginBottom: "40px",
            textShadow: isDark
              ? "0 0 10px rgba(0,0,0,1), 0 1px 6px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 8px 40px rgba(0,0,0,0.5)"
              : "none",
            transition: "all 0.5s",
          }}
        >
          Zuper Sense turns your operational data into plain-English answers —
          and turns those answers into action.
        </p>

        {/* Chat component */}
        <SenseChat />
      </div>

      <style>{`
        .hero-headline:hover {
          text-shadow: 0 2px 8px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.6), 0 0 80px rgba(255,120,50,0.35), 0 0 140px rgba(255,69,0,0.2) !important;
        }
        .hero-headline:hover .hero-italic {
          text-shadow: 0 0 30px rgba(255,69,0,1), 0 0 80px rgba(255,69,0,0.6), 0 0 140px rgba(255,69,0,0.3), 0 2px 8px rgba(0,0,0,0.7) !important;
        }
      `}</style>
    </section>
  );
}
