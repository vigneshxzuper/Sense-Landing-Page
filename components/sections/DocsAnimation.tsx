"use client";

import { useRef } from "react";
import { FileText, Receipt, ClipboardList, BarChart3, PenTool, FolderOpen, Shield, Briefcase, Wrench, LucideIcon } from "lucide-react";
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";

const ICONS: Array<{ x: number; y: number; rot: number; scatterScale: number; Icon: LucideIcon }> = [
  { x: -520, y: -260, rot: -18, scatterScale: 0.92, Icon: FileText },
  { x: -120, y: -320, rot: 10,  scatterScale: 1.0,  Icon: Receipt },
  { x: 340,  y: -300, rot: 16,  scatterScale: 0.95, Icon: ClipboardList },
  { x: 600,  y: -140, rot: -12, scatterScale: 0.88, Icon: BarChart3 },
  { x: -560, y: 40,   rot: 14,  scatterScale: 0.94, Icon: PenTool },
  { x: 560,  y: 120,  rot: 18,  scatterScale: 0.96, Icon: FolderOpen },
  { x: -380, y: 260,  rot: -8,  scatterScale: 0.92, Icon: Shield },
  { x: 80,   y: 300,  rot: -16, scatterScale: 1.0,  Icon: Briefcase },
  { x: 440,  y: 300,  rot: 22,  scatterScale: 0.93, Icon: Wrench },
];

const GRID = [
  { x: -118, y: -118 }, { x: 0, y: -118 }, { x: 118, y: -118 },
  { x: -118, y: 0 },    { x: 0, y: 0 },    { x: 118, y: 0 },
  { x: -118, y: 118 },  { x: 0, y: 118 },  { x: 118, y: 118 },
];

const SOLID = [true, false, true, false, true, false, true, false, true];

const SPRING = { stiffness: 140, damping: 32, mass: 1.1 };

type FlyingDocProps = {
  i: number;
  progress: MotionValue<number>;
};

function FlyingDoc({ i, progress }: FlyingDocProps) {
  const from = ICONS[i];
  const to = GRID[i];
  const solid = SOLID[i];
  const scatterScale = from.scatterScale;
  const Icon = from.Icon;

  const sDrift = i * 0.005;

  // 0-0.10: fade in scattered
  // 0.10-0.22: dwell
  // 0.22-0.48: fly to grid
  const entryOpacity = useTransform(progress, [0.0, 0.12 + sDrift], [0, 1]);
  const morphStart = 0.22 + sDrift;
  const morphEnd = 0.48 + sDrift;

  // Glyphs stay fully opaque through the whole morph — final 3×3 grid reads
  // as crisp icons rather than blank tiles.
  const iconOpacity = useTransform(progress, [0, 1], [1, 1]);

  const xRaw = useTransform(progress, [morphStart, morphEnd], [from.x, to.x]);
  const yRaw = useTransform(progress, [morphStart, morphEnd], [from.y, to.y]);
  const rotRaw = useTransform(progress, [morphStart, morphEnd], [from.rot, 0]);
  const scaleRaw = useTransform(
    progress,
    [0.0, 0.08, morphStart, morphEnd],
    [scatterScale * 0.7, scatterScale, scatterScale, 1]
  );

  const x = useSpring(xRaw, SPRING);
  const y = useSpring(yRaw, SPRING);
  const rotate = useSpring(rotRaw, SPRING);
  const scale = useSpring(scaleRaw, SPRING);

  return (
    <motion.div
      style={{
        position: "absolute",
        width: "96px",
        height: "96px",
        // Static -50% offset so x/y address the tile's CENTER, not its
        // top-left. Without these, the symmetric GRID values [-118, 0, 118]
        // produce visual centres at [-70, 48, 166] and the grid drifts
        // right by half a tile.
        left: "-48px",
        top: "-48px",
        x, y, rotate, scale,
        opacity: entryOpacity,
        willChange: "transform, opacity",
      }}
    >
      {/* 3D extruded tile — Sense palette, deeper bevel + smoother light */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: "26%",
          background: solid
            ? "radial-gradient(120% 100% at 30% 20%, #FFB085 0%, #FF7F4E 30%, #E85D3A 60%, #B8421A 100%)"
            : "radial-gradient(120% 100% at 30% 20%, #FFFAF2 0%, #FDEEDD 35%, #FBE0CE 65%, #D9B896 100%)",
          boxShadow: [
            // deeper staircase side face — smooth ramp from mid to deep shade
            solid ? "1px 1px 0 #CA4E24" : "1px 1px 0 #D7B095",
            solid ? "2px 2px 0 #C14923" : "2px 2px 0 #CBA487",
            solid ? "3px 3px 0 #B84422" : "3px 3px 0 #BF987A",
            solid ? "4px 4px 0 #AE4020" : "4px 4px 0 #B48D70",
            solid ? "5px 5px 0 #A53C1E" : "5px 5px 0 #A98267",
            solid ? "6px 6px 0 #9B391C" : "6px 6px 0 #9E785E",
            solid ? "7px 7px 0 #91351A" : "7px 7px 0 #936D55",
            solid ? "8px 8px 0 #863218" : "8px 8px 0 #88634D",
            solid ? "9px 9px 0 #7B2E16" : "9px 9px 0 "  + "#7D5945",
            solid ? "10px 10px 0 #702A14" : "10px 10px 0 #724F3D",
            // inner bevel (bright top-left → dark bottom-right)
            "inset 0 3px 2px rgba(255,255,255,0.7)",
            "inset 3px 0 3px rgba(255,255,255,0.4)",
            "inset 0 -4px 6px rgba(90,30,5,0.3)",
            "inset -3px 0 4px rgba(90,30,5,0.18)",
            // glossy rim
            "inset 0 0 0 1px rgba(255,255,255,0.35)",
            // ambient ground shadow
            "0 30px 50px -18px rgba(0,0,0,0.55)",
            "0 14px 24px -10px rgba(0,0,0,0.32)",
          ].join(", "),
        }}
      >
        {/* Large soft gloss arc (top face wetness) */}
        <div
          style={{
            position: "absolute", top: "4%", left: "10%", right: "14%", height: "44%",
            borderRadius: "50% 50% 60% 60%",
            background: solid
              ? "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
            filter: "blur(2px)",
            mixBlendMode: "screen",
          }}
        />
        {/* Tight specular hotspot (top-left) */}
        <div
          style={{
            position: "absolute", top: "8%", left: "14%", width: "28%", height: "12%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
            filter: "blur(3px)",
          }}
        />
        {/* Bottom inner bounce light */}
        <div
          style={{
            position: "absolute", bottom: "8%", left: "18%", right: "22%", height: "14%",
            borderRadius: "50%",
            background: solid
              ? "radial-gradient(ellipse, rgba(255,180,140,0.55) 0%, rgba(255,180,140,0) 70%)"
              : "radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
            filter: "blur(4px)",
          }}
        />
      </div>

      {/* White frosted glyph inside — visible scattered, fades at grid */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: iconOpacity, pointerEvents: "none",
        }}
      >
        <Icon
          style={{
            width: "44%",
            height: "44%",
            color: solid ? "#FFFFFF" : "#B24A22",
            strokeWidth: 2,
            filter: solid
              ? "drop-shadow(0 2px 3px rgba(120,40,15,0.45))"
              : "drop-shadow(0 2px 3px rgba(180,100,70,0.3))",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function DocsAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const auroraOpacity = useTransform(scrollYProgress, [0.0, 0.12, 0.25, 0.48, 1], [0, 0.85, 0.7, 0.55, 0.55]);
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const grainOpacity = useTransform(scrollYProgress, [0.0, 0.12, 0.40, 0.9], [0, 0.25, 0, 0]);

  const headlineOpacity = useTransform(scrollYProgress, [0.38, 0.50], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.38, 0.50], [24, 0]);

  return (
    <div
      id="docs-section"
      ref={wrapperRef}
      style={{ position: "relative", height: "300vh" }}
    >
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Aurora */}
        <motion.svg
          aria-hidden
          viewBox="0 0 800 800"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute", inset: "-10%",
            width: "120%", height: "120%",
            zIndex: 0, pointerEvents: "none",
            y: auroraY, opacity: auroraOpacity,
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

        {/* Grain */}
        <motion.svg
          aria-hidden viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            zIndex: 0, pointerEvents: "none",
            opacity: grainOpacity, mixBlendMode: "overlay",
          }}
        >
          <defs>
            <filter id="docs-grain-fx">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
              <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.4 0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#docs-grain-fx)" />
        </motion.svg>

        {/* Icons container — absolute full viewport, centered anchor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", width: 0, height: 0, transform: "translateY(-180px)" }}>
            {ICONS.map((_, i) => (
              <FlyingDoc
                key={i}
                i={i}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Headline */}
        <motion.div
          style={{
            textAlign: "center",
            opacity: headlineOpacity,
            y: headlineY,
            position: "relative",
            zIndex: 5,
            marginTop: "340px",
          }}
        >
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1.1, marginBottom: "12px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
            Entire Zuper inside a prompt box.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--ink2)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.6 }}>
            Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
