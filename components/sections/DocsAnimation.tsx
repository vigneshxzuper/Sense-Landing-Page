"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Receipt, ClipboardList, BarChart3, PenTool, FolderOpen, Shield, Briefcase, Wrench, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import RollText from "@/components/RollText";

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
  playing: boolean;
};

function FlyingDoc({ i, playing }: FlyingDocProps) {
  const from = ICONS[i];
  const to = GRID[i];
  const solid = SOLID[i];
  const Icon = from.Icon;

  // Animation fires once when the section enters the viewport: each
  // tile springs from its scatter pose to its slot in the 3×3 grid.
  // Per-tile staggered delay so the formation reads as a sequence
  // rather than a synchronised pop.
  const stagger = i * 0.06;

  return (
    <motion.div
      initial={{ x: from.x, y: from.y, rotate: from.rot, scale: from.scatterScale }}
      animate={
        playing
          ? { x: to.x, y: to.y, rotate: 0, scale: 1 }
          : { x: from.x, y: from.y, rotate: from.rot, scale: from.scatterScale }
      }
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 32,
        mass: 1.1,
        delay: playing ? stagger : 0,
      }}
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
        willChange: "transform",
      }}
    >
      {/* 3D extruded tile — Sense palette, deeper bevel + smoother light */}
      <div
        style={{
          position: "absolute", inset: 0,
          borderRadius: "26%",
          background: solid
            ? "radial-gradient(120% 100% at 30% 20%, #FFC59E 0%, #FF8B5A 30%, #F2613C 60%, #D24A1F 100%)"
            : "radial-gradient(120% 100% at 30% 20%, #FFFFFB 0%, #FFF1DE 35%, #FFD9B8 65%, #E0BC95 100%)",
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
            // glossy rim — brighter so the tile reads against the
            // orange aurora behind it
            "inset 0 0 0 1px rgba(255,255,255,0.55)",
            // outer glow to pop off the dark bg
            solid ? "0 0 24px -2px rgba(255,140,90,0.45)" : "0 0 22px -2px rgba(255,235,210,0.32)",
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

      {/* White frosted glyph inside — visible scattered + at grid */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
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
      </div>
    </motion.div>
  );
}

export default function DocsAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fire the scatter → grid morph the first time the section enters
  // the viewport. No scroll-scrubbing — once `playing` flips true,
  // each FlyingDoc springs to its grid slot with a staggered delay.
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);


  return (
    <div
      id="docs-section"
      ref={sectionRef}
      style={{ position: "relative" }}
    >
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "120px 0",
        }}
      >

        {/* Split layout — Sense logo formation on the left, copy + CTA
            on the right. Both columns sit on top of the aurora/grain
            backdrop layers. */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            maxWidth: "1240px",
            padding: "0 48px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "48px",
          }}
        >
          {/* Left — icons formation anchor */}
          <div
            style={{
              position: "relative",
              height: "520px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "relative", width: 0, height: 0 }}>
              {ICONS.map((_, i) => (
                <FlyingDoc key={i} i={i} playing={playing} />
              ))}
            </div>
          </div>

          {/* Right — title + button */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
            }}
          >
            <h2 style={{ fontSize: "clamp(32px, 4.4vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1.05, marginBottom: "16px", maxWidth: "560px" }}>
              Entire Zuper inside a prompt box.
            </h2>
            <p style={{ fontSize: "17px", color: "var(--ink2)", maxWidth: "480px", lineHeight: 1.6, marginBottom: "28px" }}>
              Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
            </p>
            <a
              href="#analyze-section"
              className="btn-roll"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#analyze-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#111",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "-0.005em",
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(232,93,58,0.25), 0 2px 8px rgba(0,0,0,0.3)",
                pointerEvents: "auto",
              }}
            >
              <RollText>Try Sense</RollText>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
