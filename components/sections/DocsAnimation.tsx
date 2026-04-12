"use client";

import { useEffect, useRef } from "react";

const DOCS = [
  { x: -380, y: -160, rot: -18, icon: "📄", label: "Quote #8821" },
  { x: 280, y: -200, rot: 14, icon: "🧾", label: "Invoice" },
  { x: -320, y: 60, rot: -8, icon: "📋", label: "Work Order" },
  { x: 340, y: 40, rot: 20, icon: "📊", label: "Report" },
  { x: -180, y: 220, rot: 12, icon: "📝", label: "Contract" },
  { x: 200, y: 200, rot: -15, icon: "🗂", label: "Job Sheet" },
  { x: -60, y: -240, rot: 6, icon: "📑", label: "SLA Doc" },
  { x: 420, y: -100, rot: -10, icon: "💼", label: "Proposal" },
];

export default function DocsAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const g = await import("gsap");
      const st = await import("gsap/ScrollTrigger");
      const gsap = g.default;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!containerRef.current) return;
        const docEls = containerRef.current.querySelectorAll(".doc-icon");

        // Initial scatter positions already set via CSS transforms
        // On scroll, converge to center
        gsap.fromTo(
          docEls,
          (i: number) => ({
            x: DOCS[i].x,
            y: DOCS[i].y,
            rotation: DOCS[i].rot,
            opacity: 0,
            scale: 0.8,
          }),
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: (i: number) => (i === 0 ? 0 : 0), // they'll go to 0
            scale: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.5,
              onUpdate: (self: any) => {
                const p = self.progress;
                docEls.forEach((el: Element, i: number) => {
                  const htmlEl = el as HTMLElement;
                  // Show docs in first half, converge in second half
                  const showProgress = Math.min(p * 3, 1); // 0→1 in first third
                  const convergeProgress = Math.max((p - 0.4) / 0.6, 0); // 0→1 in last 60%

                  const currentX = DOCS[i].x * (1 - convergeProgress);
                  const currentY = DOCS[i].y * (1 - convergeProgress);
                  const currentRot = DOCS[i].rot * (1 - convergeProgress);
                  const currentOpacity = showProgress * (1 - convergeProgress * 0.8);
                  const currentScale = 0.85 + 0.15 * showProgress - 0.15 * convergeProgress;

                  htmlEl.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg) scale(${currentScale})`;
                  htmlEl.style.opacity = String(currentOpacity);
                });
              },
            },
          }
        );

        // Logo pulse at end
        const logo = containerRef.current.querySelector(".sense-logo-center");
        if (logo) {
          gsap.fromTo(
            logo,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "60% top",
                end: "bottom bottom",
                scrub: 1,
              },
            }
          );
        }

        if (headRef.current) {
          gsap.fromTo(
            headRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#09090B",
        minHeight: "250vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            background: "radial-gradient(ellipse, rgba(232,93,58,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Doc icons container */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "200px",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "60px",
          }}
        >
          {DOCS.map((doc, i) => (
            <div
              key={i}
              className="doc-icon"
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                transform: `translate(${doc.x}px, ${doc.y}px) rotate(${doc.rot}deg)`,
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "64px",
                  background: "#18181B",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                {doc.icon}
              </div>
              <span style={{ fontSize: "9px", color: "#52525B", whiteSpace: "nowrap" }}>{doc.label}</span>
            </div>
          ))}

          {/* Center Sense Logo */}
          <div
            className="sense-logo-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #E85D3A, #C4472A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(232,93,58,0.5), 0 0 120px rgba(232,93,58,0.2)",
              opacity: 0,
              zIndex: 10,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="3" width="15" height="15" rx="3" fill="white" />
              <rect x="22" y="3" width="15" height="15" rx="3" fill="white" fillOpacity="0.65" />
              <rect x="3" y="22" width="15" height="15" rx="3" fill="white" fillOpacity="0.65" />
              <rect x="22" y="22" width="15" height="15" rx="3" fill="white" fillOpacity="0.35" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div ref={headRef} style={{ textAlign: "center", opacity: 0 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#FAFAFA",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            Every document. Every insight.{" "}
            <span style={{ color: "#E85D3A", fontStyle: "italic" }}>One place.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#52525B", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            Quotes, invoices, work orders, contracts — Sense ingests it all and turns it into answers you can act on.
          </p>
        </div>
      </div>
    </section>
  );
}
