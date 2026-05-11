"use client";

import { useEffect, useRef, useState } from "react";
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

interface HeroSectionStaticProps {
  /** When provided, parent controls the reveal (skip own IntersectionObserver). */
  externalBooted?: boolean;
  /** Hide the badge/h1/p/CTA block — chrome only. Used by HeroScrollAnimation
   * so the in-laptop preview can act as the live content while this section
   * fades in only the blinds + mac peek + bg around it. */
  hideContent?: boolean;
}

export default function HeroSectionStatic({ externalBooted, hideContent = false }: HeroSectionStaticProps = {}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // When mounted as a child of HeroScrollAnimation, the parent's GSAP
  // timeline drives the dissolve, so the per-element fade-up would cause
  // a second visible shift on top of the timeline crossfade. Skip it
  // when externalBooted is provided.
  const [mounted, setMounted] = useState(externalBooted !== undefined);
  const [internalBooted, setInternalBooted] = useState(false);
  const booted = externalBooted ?? internalBooted;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (externalBooted !== undefined) return;
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [externalBooted]);

  useEffect(() => {
    if (externalBooted !== undefined) return; // parent-driven, skip own observer
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInternalBooted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [externalBooted]);

  return (
    <section
      ref={sectionRef}
      className={booted ? "crt-boot booted" : "crt-boot"}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        transition: "background 0.5s",
      }}
    >
      {/* CRT power-on flash + scanline */}
      <div aria-hidden className="crt-boot-flash" />
      <div aria-hidden className="crt-boot-scanline" />
      {/* Mac window peek + Ask copy — fills the empty space below the
          CTAs and tees up the AnalyzeSection that follows. Decorative
          only; the live chat lives in AnalyzeSection. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-44vh",
          transform: "translateX(-50%)",
          width: "min(1240px, 94vw)",
          pointerEvents: "none",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "9% 1.25% 0",
            borderRadius: "22px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 100%)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
        />
        <svg
          viewBox="0 0 1600 1120"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            filter:
              "drop-shadow(0 0 0.5px rgba(255,255,255,0.6)) drop-shadow(0 0 6px rgba(255,255,255,0.28)) drop-shadow(0 0 18px rgba(255,255,255,0.16)) drop-shadow(0 0 40px rgba(255,255,255,0.08))",
            maskImage:
              "radial-gradient(ellipse 95% 95% at center, #000 75%, rgba(0,0,0,0.35) 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 95% at center, #000 75%, rgba(0,0,0,0.35) 100%)",
          }}
        >
          <g
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="20" y="40" width="1560" height="1040" rx="22" />
            <line x1="20" y1="110" x2="1580" y2="110" />
          </g>
          <g>
            <circle cx="58" cy="75" r="8" fill="#FF5F56" />
            <circle cx="86" cy="75" r="8" fill="#FFBD2E" />
            <circle cx="114" cy="75" r="8" fill="#27C93F" />
          </g>
          <rect
            x="640"
            y="60"
            width="320"
            height="28"
            rx="14"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.8"
          />
          {/* Ask. headline */}
          <text
            x="800"
            y="320"
            textAnchor="middle"
            fill="rgba(255,255,255,0.95)"
            fontSize="84"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            letterSpacing="-3"
          >
            Ask.
          </text>
          <text
            x="800"
            y="370"
            textAnchor="middle"
            fill="rgba(255,255,255,0.55)"
            fontSize="20"
            fontFamily="Inter, system-ui, sans-serif"
          >
            Pick a prompt below or type your own.
          </text>
          {/* Prompt input outline */}
          <rect
            x="200"
            y="430"
            width="1200"
            height="160"
            rx="20"
            fill="none"
            stroke="rgba(232,93,58,0.55)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="crt-boot-inner" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "42vh" }}>
      {/* Blinds backdrop in dark mode */}
      {isDark && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
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
            staticFrame
          />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 2, display: hideContent ? "none" : "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "880px" }}>
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
            background: isDark ? "rgba(10,10,12,0.65)" : "rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1), color 0.5s",
          }}
        >
          Zuper Sense &middot; Intelligence Layer
        </div>

        <h1
          style={{
            fontSize: "clamp(48px, 7.5vw, 96px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textAlign: "center",
            maxWidth: "1100px",
            marginBottom: "24px",
            marginTop: 0,
            color: "#FFFFFF",
            fontFeatureSettings: '"ss01", "cv11"',
            textShadow: "0 1px 8px rgba(0,0,0,0.22)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 1.6s cubic-bezier(0.22,1,0.36,1) 0.08s, transform 1.6s cubic-bezier(0.22,1,0.36,1) 0.08s",
            // Reserve a stable two-line block so the scramble never causes
            // layout jump when characters cycle.
            minHeight: "calc(2em * 1.05)",
          }}
        >
          Command center for your roofing operation.
        </h1>

        <p
          style={{
            fontSize: "clamp(18px, 2.2vw, 22px)",
            color: "rgba(255,255,255,0.88)",
            textAlign: "center",
            maxWidth: "36rem",
            lineHeight: 1.55,
            fontWeight: 450,
            margin: 0,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.3s cubic-bezier(0.22,1,0.36,1) 0.22s, transform 1.3s cubic-bezier(0.22,1,0.36,1) 0.22s",
          }}
        >
          Type a question, get an answer, deploy an agent.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "40px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 1.3s cubic-bezier(0.22,1,0.36,1) 0.36s, transform 1.3s cubic-bezier(0.22,1,0.36,1) 0.36s",
          }}
        >
          {[
            { label: "Request early access", href: "#analyze-section", icon: <Sparkles style={{ width: 14, height: 14 }} />, variant: "primary" as const },
            { label: "Watch a demo", href: "#docs-section", icon: <BookOpen style={{ width: 14, height: 14 }} />, variant: "secondary" as const },
          ].map((btn) => {
            const primary = btn.variant === "primary";
            const innerBg = primary ? (isDark ? "#ffffff" : "#111111") : isDark ? "rgba(20,20,20,0.9)" : "rgba(245,245,245,0.95)";
            const innerColor = primary ? (isDark ? "#111" : "#ffffff") : isDark ? "rgba(255,255,255,0.92)" : "#1a1714";
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
                    document.querySelector(btn.href)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "999px",
                    background: innerBg,
                    color: innerColor,
                    fontSize: "16px",
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
                            <span className="cta-roll-line">{ch === " " ? " " : ch}</span>
                            <span className="cta-roll-line">{ch === " " ? " " : ch}</span>
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
      </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </section>
  );
}
