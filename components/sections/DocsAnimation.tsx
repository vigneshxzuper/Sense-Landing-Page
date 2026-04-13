"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Receipt, ClipboardList, BarChart3, PenTool, FolderOpen, Shield, Briefcase, Wrench } from "lucide-react";

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

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = () => {
    // Clear any pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setPhase("idle");
    // Small delay to let idle state apply before restarting
    const t0 = setTimeout(() => setPhase("scattered"), 50);
    const t1 = setTimeout(() => setPhase("converging"), 1550);
    const t2 = setTimeout(() => setPhase("logo"), 3550);
    timersRef.current = [t0, t1, t2];
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
        } else {
          // Reset when leaving so it replays on re-entry
          timersRef.current.forEach(clearTimeout);
          timersRef.current = [];
          setPhase("idle");
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

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
        <div style={{ height: "1px", background: "var(--line)" }} />
      </div>

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0.6)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(232,93,58,0.30) 0%, rgba(232,93,58,0.08) 40%, transparent 65%)",
          pointerEvents: "none",
          opacity: phase === "logo" ? 1 : 0,
          filter: "blur(30px)",
          transition: "opacity 1s, transform 1s",
          ...(phase === "logo" ? { transform: "translate(-50%, -50%) scale(1)" } : {}),
        }}
      />

      {/* Icons container */}
      <div
        style={{
          position: "relative",
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
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "12px" }}>
          Every document. Every insight.{" "}
          <span style={{ color: "#E85D3A", fontStyle: "italic" }}>One place.</span>
        </h2>
        <p style={{ fontSize: "16px", color: "var(--ink3)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
          Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
        </p>
      </div>
    </section>
  );
}
