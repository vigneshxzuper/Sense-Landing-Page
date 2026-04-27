"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { GradientBlindsProps } from "../GradientBlinds";
import { Sparkles, BookOpen } from "lucide-react";
import VariableProximity from "@/components/VariableProximity";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
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
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            y: reduce ? "0%" : bgY,
            scale: reduce ? 1 : bgScale,
            willChange: "transform",
          }}
        >
          <GradientBlinds
            gradientColors={["#FD8627", "#EA0602"]}
            angle={180}
            noise={0.15}
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
        </motion.div>
      )}


      {/* Content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "880px",
          y: reduce ? "0%" : contentY,
          opacity: reduce ? 1 : contentOpacity,
          willChange: "transform, opacity",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 16px",
            borderRadius: "999px",
            marginBottom: "28px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.02em",
            color: isDark ? "rgba(255,255,255,0.95)" : "var(--ink)",
            background: isDark
              ? "rgba(10,10,12,0.65)"
              : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid rgba(0,0,0,0.08)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1), color 0.5s",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#E85D3A",
              boxShadow: "0 0 8px rgba(232,93,58,0.8)",
              flexShrink: 0,
            }}
          />
          Zuper Sense &middot; Intelligence Layer
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          style={{
            fontSize: "clamp(52px, 9vw, 100px)",
            fontWeight: 500,
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
            position: "relative",
          }}
        >
          <VariableProximity
            label="Command center for"
            containerRef={headlineRef}
            radius={260}
            falloff="linear"
            fromFontVariationSettings="'wght' 560, 'opsz' 40"
            toFontVariationSettings="'wght' 900, 'opsz' 144"
          />
          <br />
          <VariableProximity
            label="your roofing operation."
            className="hero-italic"
            containerRef={headlineRef}
            radius={260}
            falloff="linear"
            fromFontVariationSettings="'wght' 560, 'opsz' 40"
            toFontVariationSettings="'wght' 900, 'opsz' 144"
            style={{
              fontStyle: "italic",
              color: isDark ? "#FFFFFF" : "#E85D3A",
              textShadow: isDark
                ? "0 0 40px rgba(255,255,255,0.2), 0 2px 10px rgba(0,0,0,0.5)"
                : "0 1px 4px rgba(232,93,58,0.2)",
              transition: "color 0.5s, text-shadow 0.5s",
            }}
          />
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "540px",
            lineHeight: 1.65,
            fontWeight: 500,
            textShadow: isDark ? "0 2px 12px rgba(0,0,0,0.5)" : "none",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.24s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.24s, color 0.5s, text-shadow 0.5s",
          }}
        >
          Type a question, get an answer, deploy an agent.
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
              label: "Request early access",
              href: "#analyze-section",
              icon: <Sparkles style={{ width: 14, height: 14 }} />,
              variant: "primary" as const,
            },
            {
              label: "Watch a demo",
              href: "#docs-section",
              icon: <BookOpen style={{ width: 14, height: 14 }} />,
              variant: "secondary" as const,
            },
          ].map((btn) => {
            const primary = btn.variant === "primary";
            const innerBg = primary
              ? isDark
                ? "#ffffff"
                : "#111111"
              : isDark
              ? "rgba(20,20,20,0.9)"
              : "rgba(245,245,245,0.95)";
            const innerColor = primary
              ? isDark
                ? "#111"
                : "#ffffff"
              : isDark
              ? "rgba(255,255,255,0.92)"
              : "#1a1714";
            return (
              <div
                key={btn.label}
                className={primary ? "hero-cta btn-glow-primary" : "hero-cta btn-glow-secondary"}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  borderRadius: "999px",
                  padding: "1.5px",
                  boxShadow: primary
                    ? isDark
                      ? "0 6px 24px rgba(232,93,58,0.25), 0 2px 8px rgba(0,0,0,0.3)"
                      : "0 6px 24px rgba(232,93,58,0.2), 0 2px 8px rgba(0,0,0,0.12)"
                    : "none",
                  transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s",
                }}
              >
                <a
                  href={btn.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(btn.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 22px",
                    borderRadius: "999px",
                    background: innerBg,
                    color: innerColor,
                    fontSize: "13.5px",
                    fontWeight: 500,
                    textDecoration: "none",
                    letterSpacing: "-0.005em",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    {btn.icon}
                    <span className="cta-roll-word" aria-label={btn.label}>
                      {Array.from(btn.label).map((ch, i) => (
                        <span
                          key={i}
                          className="cta-roll"
                          style={{ transitionDelay: `${i * 22}ms` }}
                          aria-hidden
                        >
                          <span
                            className="cta-roll-inner"
                            style={{ transitionDelay: `${i * 22}ms` }}
                          >
                            <span className="cta-roll-line">{ch === " " ? "\u00A0" : ch}</span>
                            <span className="cta-roll-line">{ch === " " ? "\u00A0" : ch}</span>
                          </span>
                        </span>
                      ))}
                    </span>
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </motion.div>

      <style>{`
        @property --angle-p {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @property --angle-s {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes btn-spin-p {
          to { --angle-p: 360deg; }
        }
        @keyframes btn-spin-s {
          to { --angle-s: 360deg; }
        }
        .btn-glow-primary {
          background: conic-gradient(from var(--angle-p), transparent 0%, transparent 50%, rgba(251,146,60,1) 68%, rgba(255,220,180,1) 80%, rgba(251,146,60,1) 92%, transparent 100%);
          animation: btn-spin-p 2.5s linear infinite;
        }
        .btn-glow-secondary {
          background: conic-gradient(from var(--angle-s), transparent 0%, transparent 70%, rgba(180,180,180,0.25) 82%, rgba(220,220,220,0.3) 88%, rgba(180,180,180,0.25) 94%, transparent 100%);
          animation: btn-spin-s 4s linear infinite;
        }
        .hero-cta:hover {
          transform: translateY(-1px) !important;
        }
        .hero-cta:active {
          transform: translateY(0) !important;
        }
        .hero-italic {
          transition: filter 0.3s ease;
        }
        .cta-roll-word {
          display: inline-flex;
          vertical-align: middle;
          line-height: 1.2;
        }
        .cta-roll {
          position: relative;
          display: inline-block;
          overflow: hidden;
          height: 1.2em;
          line-height: 1.2;
          min-height: 0;
          flex: 0 0 auto;
          vertical-align: middle;
        }
        .cta-roll-inner {
          display: block;
          transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
          will-change: transform;
        }
        .cta-roll-line {
          display: block;
          height: 1.2em;
          line-height: 1.2;
          white-space: pre;
        }
        .hero-cta:hover .cta-roll-inner {
          transform: translateY(-1.2em);
        }
      `}</style>
    </section>
  );
}
