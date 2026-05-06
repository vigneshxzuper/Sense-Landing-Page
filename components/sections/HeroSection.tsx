"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ComponentType } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { GradientBlindsProps } from "../GradientBlinds";
import { Sparkles, BookOpen } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionTemplate,
} from "framer-motion";

const GradientBlinds = dynamic<GradientBlindsProps>(
  () =>
    import("../GradientBlinds").then(
      (m) => m.default as ComponentType<GradientBlindsProps>
    ),
  { ssr: false }
);

// Screen rect center inside the illustration. Drives zoom origin + Ken Burns translate.
const SCREEN_CX = 66.5;
const SCREEN_CY = 28.9;
const ZOOM_END = 4.2; // pushes past screen edges so only black interior remains
// Translate values (vw/vh) that move screen center to viewport center at end of zoom.
const SCENE_TX_END = 50 - SCREEN_CX; // -16.5
const SCENE_TY_END = 50 - SCREEN_CY; // 21.1
// Title intro offset — pushes the headline left of the monitor at p=0.
const TITLE_DX_START = -28; // vw
const TITLE_SCALE_START = 0.78;

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Section 360vh; sticky releases at p ≈ 0.722 → ~100vh of held full hero before handoff.
  // Phase 1 (0 → 0.2): zoom + translate so screen rect fully fills viewport (pure black).
  // Phase 2 (0.2 → 0.26): hold black — viewer is "inside" the monitor.
  // Phase 3 (0.26 → 0.36): blinds fade in over the black.
  // Phase 4 (0.34 → 0.44): badge / subtitle / CTAs fade in around the title.
  // Phase 5 (0.44 → 0.722): held full hero (≈100vh of dwell).
  // Phase 6 (>0.722): sticky released, hero scrolls up into Ask section.
  // All transforms include a final hold keyframe at p=1 to prevent extrapolation
  // (useTransform extrapolates past the last range value by default).
  // Tightened: full hero visible by p=0.2 (~72vh). Held window p=0.2 → 0.722 ≈ 188vh.
  const sceneScale = useTransform(scrollYProgress, [0, 0.15, 1], [1, ZOOM_END, ZOOM_END]);
  const sceneTx = useTransform(scrollYProgress, [0, 0.15, 1], [0, SCENE_TX_END, SCENE_TX_END]);
  const sceneTy = useTransform(scrollYProgress, [0, 0.15, 1], [0, SCENE_TY_END, SCENE_TY_END]);
  const sceneTransform = useMotionTemplate`translate(${sceneTx}vw, ${sceneTy}vh) scale(${sceneScale})`;
  const sceneOpacity = useTransform(scrollYProgress, [0.15, 0.18, 1], [1, 0, 0]);
  const blindsOpacity = useTransform(scrollYProgress, [0.15, 0.2, 1], [0, 1, 1]);

  const titleX = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    [TITLE_DX_START, 0, 0]
  );
  const titleScale = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    [TITLE_SCALE_START, 1, 1]
  );
  const titleTransform = useMotionTemplate`translateX(${titleX}vw) scale(${titleScale})`;

  const titleShadow = useTransform(
    scrollYProgress,
    [0.12, 0.22, 1],
    [
      "0 0 1px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.75), 0 4px 28px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.55)",
      "0 1px 8px rgba(0,0,0,0.22)",
      "0 1px 8px rgba(0,0,0,0.22)",
    ]
  );

  const sidekickOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.17, 1],
    [0, 1, 1]
  );
  const sidekickY = useTransform(scrollYProgress, [0.14, 0.17, 1], [16, 0, 0]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-no-snap
      style={{
        position: "relative",
        height: "360vh",
        background: "var(--bg)",
        transition: "background 0.5s",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Blinds backdrop — fades in once we're inside the screen */}
        {isDark && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: reduce ? 1 : blindsOpacity,
              willChange: "opacity",
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

        {/* Illustration — zooms+translates so screen rect fills viewport, then stays as black */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              transformOrigin: `${SCREEN_CX}% ${SCREEN_CY}%`,
              transform: sceneTransform,
              opacity: sceneOpacity,
              willChange: "transform, opacity",
            }}
          >
            <Image
              src="/hero-scene.png"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: `${SCREEN_CX}% ${SCREEN_CY}%`,
              }}
            />
          </motion.div>
        )}

        {/* Hero column — title morphs from intro pos to center; sidekicks fade in around it */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "880px",
            }}
          >
            {/* Eyebrow badge */}
            <motion.div
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
                opacity: reduce ? 1 : sidekickOpacity,
                y: reduce ? 0 : sidekickY,
              }}
            >
              Zuper Sense &middot; Intelligence Layer
            </motion.div>

            {/* Headline — single element that travels through the zoom */}
            <motion.h1
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
                transform: reduce ? undefined : titleTransform,
                textShadow: reduce ? "0 1px 8px rgba(0,0,0,0.22)" : titleShadow,
                transformOrigin: "center center",
                opacity: mounted ? 1 : 0,
                transition: mounted
                  ? "none"
                  : "opacity 0.6s cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
              }}
            >
              Command center for
              <br />
              <span style={{ whiteSpace: "nowrap" }}>
                your roofing operation.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              style={{
                fontSize: "clamp(18px, 2.2vw, 22px)",
                color: "rgba(255,255,255,0.88)",
                textAlign: "center",
                maxWidth: "36rem",
                lineHeight: 1.55,
                fontWeight: 450,
                margin: 0,
                opacity: reduce ? 1 : sidekickOpacity,
                y: reduce ? 0 : sidekickY,
              }}
            >
              Type a question, get an answer, deploy an agent.
            </motion.p>

            {/* CTA row */}
            <motion.div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "40px",
                opacity: reduce ? 1 : sidekickOpacity,
                y: reduce ? 0 : sidekickY,
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
                    className={
                      primary
                        ? "hero-cta btn-glow-primary"
                        : "hero-cta btn-glow-secondary"
                    }
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
                      transition:
                        "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s",
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
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
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
                                <span className="cta-roll-line">
                                  {ch === " " ? " " : ch}
                                </span>
                                <span className="cta-roll-line">
                                  {ch === " " ? " " : ch}
                                </span>
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>
                    </a>
                  </div>
                );
              })}
            </motion.div>
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
