"use client";

import { useRef } from "react";
import { FileText, Receipt, ClipboardList, BarChart3, PenTool, FolderOpen, Shield, Briefcase, Wrench, LucideIcon } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";

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

const SPRING = { stiffness: 240, damping: 30, mass: 0.9 };

type FlyingDocProps = {
  i: number;
  scrollYProgress: MotionValue<number>;
  Icon: LucideIcon;
  label: string;
};

function FlyingDoc({ i, scrollYProgress, Icon, label }: FlyingDocProps) {
  const from = ICONS[i];
  const to = GRID[i];
  const solid = SOLID[i];

  // Subtle per-icon stagger across scroll (±1.5% window drift)
  const sDrift = i * 0.006;
  const morphStart = 0.30 + sDrift;
  const morphEnd = 0.52 + sDrift;

  // Entry: fade + scale up as we scroll into the section, then stay scattered
  const entryOpacity = useTransform(scrollYProgress, [0.02, 0.10 + sDrift], [0, 1]);

  // Position morph — fromScattered → grid
  const xRaw = useTransform(scrollYProgress, [morphStart, morphEnd], [from.x, to.x]);
  const yRaw = useTransform(scrollYProgress, [morphStart, morphEnd], [from.y, to.y]);
  const rotRaw = useTransform(scrollYProgress, [morphStart, morphEnd], [from.rot, 0]);
  // Scale: entry 0.7→1, dwell scattered, then morph 1→0.58
  const scaleRaw = useTransform(
    scrollYProgress,
    [0.02, 0.10, morphStart, morphEnd],
    [0.7, 1, 1, 0.58]
  );

  const x = useSpring(xRaw, SPRING);
  const y = useSpring(yRaw, SPRING);
  const rotate = useSpring(rotRaw, SPRING);
  const scale = useSpring(scaleRaw, SPRING);

  // Cross-fade paper bg → logo square
  const paperOpacity = useTransform(
    scrollYProgress,
    [morphStart + 0.04, morphStart + 0.22],
    [1, 0]
  );
  const squareOpacity = useTransform(
    scrollYProgress,
    [morphStart + 0.08, morphEnd],
    [0, 1]
  );

  // Icon + label fade just before morph starts (so paper empties before square arrives)
  const iconOpacity = useTransform(
    scrollYProgress,
    [morphStart, morphStart + 0.12],
    [1, 0]
  );
  const labelOpacity = useTransform(
    scrollYProgress,
    [morphStart - 0.08, morphStart + 0.02],
    [1, 0]
  );

  // Logo bloom: extra glow strength as morph lands
  const bloom = useTransform(
    scrollYProgress,
    [morphEnd, Math.min(morphEnd + 0.10, 0.96)],
    [0, 1]
  );
  const bloomSpread = useTransform(bloom, (v) => 10 + v * 16);
  const bloomAlpha = useTransform(bloom, (v) => 0.45 + v * 0.25);
  const boxShadow = useTransform(
    [bloomSpread, bloomAlpha] as [MotionValue<number>, MotionValue<number>],
    ([sp, al]: number[]) =>
      solid
        ? `0 ${sp}px ${sp * 2.6}px rgba(232,93,58,${al.toFixed(3)}), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -3px 6px rgba(0,0,0,0.18)`
        : `0 ${Math.round(sp * 0.5)}px ${Math.round(sp * 1.2)}px rgba(232,93,58,${(al * 0.35).toFixed(3)}), inset 0 1px 0 rgba(255,255,255,0.1)`
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        width: "80px",
        height: "80px",
        x,
        y,
        rotate,
        scale,
        opacity: entryOpacity,
        willChange: "transform, opacity",
      }}
    >
      {/* Paper card (initial state) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background: "linear-gradient(145deg, rgba(232,93,58,0.14) 0%, rgba(232,93,58,0.05) 100%)",
          border: "1px solid rgba(232,93,58,0.22)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 16px 36px -14px rgba(232,93,58,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          opacity: paperOpacity,
        }}
      />

      {/* Logo square (final state) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "22%",
          background: solid
            ? "linear-gradient(145deg, #F27454 0%, #D24B2A 100%)"
            : "linear-gradient(145deg, rgba(232,93,58,0.26) 0%, rgba(232,93,58,0.12) 100%)",
          border: solid ? "1px solid rgba(255,170,140,0.55)" : "1px solid rgba(232,93,58,0.22)",
          opacity: squareOpacity,
          boxShadow,
        }}
      >
        {solid && (
          <div
            style={{
              position: "absolute",
              top: "8%",
              left: "14%",
              right: "14%",
              height: "36%",
              borderRadius: "40% 40% 60% 60%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>

      {/* Icon glyph */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: iconOpacity,
          pointerEvents: "none",
        }}
      >
        <Icon style={{ width: "28px", height: "28px", color: "#E85D3A", strokeWidth: 1.5 }} />
      </motion.div>

      {/* Label */}
      <motion.span
        style={{
          position: "absolute",
          bottom: "-22px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "10px",
          color: "var(--ink2)",
          whiteSpace: "nowrap",
          opacity: labelOpacity,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

export default function DocsAnimation() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const auroraY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.88, 1],
    [0, 0.9, 1, 0.4]
  );
  const grainOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.9],
    [0, 0.35, 0.35]
  );

  const headlineOpacity = useTransform(scrollYProgress, [0.54, 0.66], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.54, 0.66], [20, 0]);

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
      {/* Aurora illustration */}
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
          <FlyingDoc
            key={i}
            i={i}
            scrollYProgress={scrollYProgress}
            Icon={item.Icon}
            label={item.label}
          />
        ))}
      </div>

      {/* Headline */}
      <motion.div
        style={{
          textAlign: "center",
          opacity: headlineOpacity,
          y: headlineY,
          position: "relative",
          zIndex: 5,
        }}
      >
        <ScrollFloat as="h2" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "12px" }}>
          Every document. Every insight. One place.
        </ScrollFloat>
        <ScrollFloat as="p" style={{ fontSize: "16px", color: "var(--ink2)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
          Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
        </ScrollFloat>
      </motion.div>
    </section>
  );
}
