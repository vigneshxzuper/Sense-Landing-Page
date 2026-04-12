"use client";

import { useEffect, useRef } from "react";

const GRID = [
  [true, false, true],
  [false, true, false],
  [true, false, true],
];

export default function SenseLogo3D() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      mx = ((e.clientX / window.innerWidth) - 0.5) * 2;
      my = ((e.clientY / window.innerHeight) - 0.5) * 2;
    };

    let raf = 0;
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      el.style.transform = `translate(-50%, -50%) rotateY(${cx * 22}deg) rotateX(${-cy * 16}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        zIndex: 0,
        pointerEvents: "none",
        perspective: "1200px",
        perspectiveOrigin: "50% 40%",
      }}
    >
      <div
        ref={wrapRef}
        style={{
          transform: "translate(-50%, -50%)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ambient glow */}
        <div
          className="logo-glow"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) translateZ(-60px)",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,93,58,0.22) 0%, rgba(232,93,58,0.06) 45%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div
          className="logo-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
            width: "360px",
            height: "360px",
            transformStyle: "preserve-3d",
          }}
        >
          {GRID.flat().map((solid, i) => {
            const depth = solid ? 28 : 10;
            const delay = i * 0.12;
            return (
              <div
                key={i}
                className="glass-cube"
                style={{
                  position: "relative",
                  transformStyle: "preserve-3d",
                  animationDelay: `${delay}s`,
                }}
              >
                {/* Bottom shadow on ground plane */}
                <div
                  style={{
                    position: "absolute",
                    inset: "6%",
                    borderRadius: "24%",
                    transform: `translateZ(-${depth + 4}px)`,
                    background: "rgba(232,93,58,0.25)",
                    filter: "blur(18px)",
                  }}
                />

                {/* Back face */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "24%",
                    transform: `translateZ(-${depth / 2}px)`,
                    background: solid
                      ? "rgba(160,50,25,0.5)"
                      : "rgba(120,50,30,0.08)",
                  }}
                />

                {/* Front face — the glass surface */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "24%",
                    transform: `translateZ(${depth}px)`,
                    background: solid
                      ? "linear-gradient(155deg, rgba(232,93,58,0.80) 0%, rgba(210,75,40,0.55) 40%, rgba(180,60,30,0.70) 100%)"
                      : "linear-gradient(155deg, rgba(232,93,58,0.18) 0%, rgba(232,93,58,0.06) 40%, rgba(232,93,58,0.12) 100%)",
                    border: solid
                      ? "1px solid rgba(255,150,120,0.45)"
                      : "1px solid rgba(232,93,58,0.15)",
                    boxShadow: solid
                      ? "0 24px 48px -12px rgba(232,93,58,0.5), 0 12px 20px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)"
                      : "0 12px 28px -8px rgba(232,93,58,0.12), 0 6px 12px -4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px) saturate(140%)",
                    WebkitBackdropFilter: "blur(12px) saturate(140%)",
                  }}
                />

                {/* Top edge / thickness strip */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "4%",
                    right: "4%",
                    height: `${depth * 1.6}px`,
                    transform: `rotateX(90deg) translateZ(-${depth * 0.1}px)`,
                    transformOrigin: "top center",
                    background: solid
                      ? "linear-gradient(180deg, rgba(255,140,100,0.4) 0%, rgba(200,65,35,0.3) 100%)"
                      : "linear-gradient(180deg, rgba(255,180,160,0.12) 0%, rgba(200,100,70,0.05) 100%)",
                    borderRadius: "2px",
                  }}
                />

                {/* Specular highlight — glass reflection */}
                <div
                  style={{
                    position: "absolute",
                    top: "10%",
                    left: "14%",
                    right: "14%",
                    height: "32%",
                    borderRadius: "40% 40% 60% 60%",
                    transform: `translateZ(${depth + 1}px)`,
                    background: solid
                      ? "linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
                  }}
                />

                {/* Bottom inner refraction */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8%",
                    left: "18%",
                    right: "18%",
                    height: "18%",
                    borderRadius: "50%",
                    transform: `translateZ(${depth + 0.5}px)`,
                    background: solid
                      ? "radial-gradient(ellipse, rgba(255,200,170,0.18) 0%, transparent 70%)"
                      : "radial-gradient(ellipse, rgba(255,200,170,0.06) 0%, transparent 70%)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Floor reflection */}
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 20px)",
            left: "50%",
            transform: "translateX(-50%) scaleY(-0.3)",
            width: "360px",
            height: "360px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
            opacity: 0.1,
            filter: "blur(8px)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 70%)",
          }}
        >
          {GRID.flat().map((solid, i) => (
            <div
              key={i}
              style={{
                borderRadius: "24%",
                background: solid
                  ? "rgba(232,93,58,0.6)"
                  : "rgba(232,93,58,0.15)",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .glass-cube {
          animation: cubeFloat 4s ease-in-out infinite;
        }
        @keyframes cubeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .logo-glow {
          animation: glowBreath 5s ease-in-out infinite;
        }
        @keyframes glowBreath {
          0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) translateZ(-60px) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) translateZ(-60px) scale(1.12); }
        }
      `}</style>
    </div>
  );
}
