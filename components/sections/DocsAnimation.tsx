"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Receipt, ClipboardList, BarChart3, PenTool, FolderOpen, Shield, Briefcase, Wrench } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";
import { useScroll, useMotionValueEvent, useTransform, motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const ICONS = [
  { Icon: FileText,      label: "Quotes",      x: -280, y: -160, rot: -14 },
  { Icon: Receipt,       label: "Invoices",     x: 0,    y: -220, rot: 6 },
  { Icon: ClipboardList, label: "Work Orders",  x: 280,  y: -160, rot: 16 },
  { Icon: BarChart3,     label: "Reports",      x: -340, y: 20,   rot: -8 },
  { Icon: PenTool,       label: "Contracts",    x: 340,  y: 20,   rot: 10 },
  { Icon: FolderOpen,    label: "Job Sheets",   x: -260, y: 190,  rot: 12 },
  { Icon: Shield,        label: "SLA Docs",     x: 0,    y: 240,  rot: -5 },
  { Icon: Briefcase,     label: "Proposals",    x: 260,  y: 190,  rot: -12 },
  { Icon: Wrench,        label: "Assets",       x: 380,  y: -60,  rot: 20 },
];

const GRID = [
  { x: -52, y: -52 }, { x: 0, y: -52 }, { x: 52, y: -52 },
  { x: -52, y: 0 },   { x: 0, y: 0 },   { x: 52, y: 0 },
  { x: -52, y: 52 },  { x: 0, y: 52 },   { x: 52, y: 52 },
];

const SOLID = [true, false, true, false, true, false, true, false, true];

export default function DocsAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"idle" | "scattered" | "converging" | "logo">("idle");
  const { setTheme } = useTheme();

  // Scroll-driven theme: dark from Docs section onward, with hysteresis dead-zone
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let current: "dark" | "light" = "light";
    let raf = 0;
    const check = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh * 0.35 && current !== "dark") {
        current = "dark";
        setTheme("dark", { persist: false });
      } else if (r.top > vh * 0.65 && current !== "light") {
        current = "light";
        setTheme("light", { persist: false });
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [setTheme]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.22) setPhase("idle");
    else if (v < 0.5) setPhase("scattered");
    else if (v < 0.82) setPhase("converging");
    else setPhase("logo");
  });

  const auroraY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.85, 1],
    [0, 0.9, 1, 0.4]
  );
  const grainOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.9],
    [0, 0.35, 0.35]
  );

  const getIconStyle = (i: number): React.CSSProperties => {
    const icon = ICONS[i];
    const target = GRID[i];
    const solid = SOLID[i];

    if (phase === "idle") {
      return {
        transform: `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rot}deg) scale(0.8)`,
        opacity: 0,
        transition: "none",
      };
    }

    if (phase === "scattered") {
      return {
        transform: `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rot}deg) scale(1)`,
        opacity: 1,
        background: "linear-gradient(145deg, rgba(232,93,58,0.12) 0%, rgba(232,93,58,0.05) 100%)",
        borderColor: "rgba(232,93,58,0.1)",
        boxShadow: "0 20px 40px rgba(232,93,58,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
        transition: `all 0.8s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1)`,
      };
    }

    if (phase === "converging") {
      return {
        transform: `translate(${target.x}px, ${target.y}px) rotate(0deg) scale(0.58)`,
        opacity: 1,
        borderRadius: "26%",
        background: solid
          ? "linear-gradient(145deg, rgba(232,93,58,0.7) 0%, rgba(200,65,30,0.5) 100%)"
          : "linear-gradient(145deg, rgba(232,93,58,0.18) 0%, rgba(232,93,58,0.08) 100%)",
        borderColor: solid ? "rgba(255,150,120,0.4)" : "rgba(232,93,58,0.15)",
        boxShadow: solid
          ? "0 8px 24px rgba(232,93,58,0.35), inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(232,93,58,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
        transition: `all 1.2s ${i * 0.05}s cubic-bezier(0.22,1,0.36,1)`,
      };
    }

    // logo phase — same as converging but with stronger glow
    return {
      transform: `translate(${target.x}px, ${target.y}px) rotate(0deg) scale(0.58)`,
      opacity: 1,
      borderRadius: "26%",
      background: solid
        ? "linear-gradient(145deg, rgba(232,93,58,0.85) 0%, rgba(200,65,30,0.65) 100%)"
        : "linear-gradient(145deg, rgba(232,93,58,0.22) 0%, rgba(232,93,58,0.10) 100%)",
      borderColor: solid ? "rgba(255,150,120,0.5)" : "rgba(232,93,58,0.18)",
      boxShadow: solid
        ? "0 10px 30px rgba(232,93,58,0.45), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.15)"
        : "0 6px 16px rgba(232,93,58,0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
      transition: `all 0.6s ${i * 0.03}s cubic-bezier(0.22,1,0.36,1)`,
    };
  };

  const converged = phase === "converging" || phase === "logo";

  return (
    <section
      id="docs-section"
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        padding: "120px 24px",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Divider */}
      <div style={{ position: "absolute", top: "120px", left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "900px", padding: "0 24px" }}>
      </div>

      {/* Aurora illustration (scroll-linked) */}
      <motion.svg
        aria-hidden
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: "-10%",
          width: "120%",
          height: "120%",
          zIndex: 0,
          pointerEvents: "none",
          y: auroraY,
          opacity: auroraOpacity,
        }}
      >
        <defs>
          <radialGradient id="docs-blob-a" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#E85D3A" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#C4472A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="docs-blob-b" cx="30%" cy="70%" r="45%">
            <stop offset="0%" stopColor="#FD8627" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#E85D3A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0A0A0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="docs-blob-c" cx="75%" cy="28%" r="38%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="docs-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
          <filter id="docs-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0" />
          </filter>
        </defs>
        <g filter="url(#docs-soft)" style={{ mixBlendMode: "screen" }}>
          <ellipse cx="400" cy="380" rx="360" ry="300" fill="url(#docs-blob-a)" />
          <ellipse cx="260" cy="540" rx="240" ry="200" fill="url(#docs-blob-b)" />
          <ellipse cx="580" cy="240" rx="180" ry="160" fill="url(#docs-blob-c)" />
        </g>
      </motion.svg>

      {/* Grain overlay */}
      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          opacity: grainOpacity,
          mixBlendMode: "overlay",
        }}
      >
        <defs>
          <filter id="docs-grain-fx">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="5"
            />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#docs-grain-fx)" />
      </motion.svg>

      {/* Icons container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "200px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "80px",
        }}
      >
        {ICONS.map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "80px",
              height: "80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(232,93,58,0.1)",
              borderRadius: "20px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              willChange: "transform, opacity",
              overflow: "hidden",
              ...getIconStyle(i),
            }}
          >
            {/* Specular highlight */}
            <div
              style={{
                position: "absolute",
                top: "8%",
                left: "14%",
                right: "14%",
                height: "35%",
                borderRadius: "40% 40% 60% 60%",
                background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                opacity: converged ? (SOLID[i] ? 0.45 : 0.18) : 0,
                transition: "opacity 0.8s",
                pointerEvents: "none",
              }}
            />
            {/* Icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                zIndex: 1,
                opacity: converged ? 0 : 1,
                transition: "opacity 0.6s",
              }}
            >
              <item.Icon style={{ width: "28px", height: "28px", color: "#E85D3A", strokeWidth: 1.5 }} />
            </div>
            {/* Label */}
            <span
              style={{
                position: "absolute",
                bottom: "-22px",
                fontSize: "10px",
                color: "var(--ink3)",
                whiteSpace: "nowrap",
                zIndex: 1,
                opacity: converged ? 0 : 1,
                transition: "opacity 0.4s",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Headline */}
      <div
        style={{
          textAlign: "center",
          opacity: phase !== "idle" ? 1 : 0,
          transform: phase !== "idle" ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <ScrollFloat as="h2" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "12px" }}>
          Every document. Every insight. One place.
        </ScrollFloat>
        <ScrollFloat as="p" style={{ fontSize: "16px", color: "#ffffff", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
          Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
        </ScrollFloat>
      </div>
    </section>
  );
}
