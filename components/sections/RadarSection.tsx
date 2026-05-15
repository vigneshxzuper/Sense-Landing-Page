"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, BarChart3, Wrench, MapPin, CalendarDays, HardHat } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const UPCOMING_JOBS = [
  { title: "Re-roof · Hargrove residence", tech: "Reyes crew", time: "Today, 1:00 PM", status: "On track", statusColor: "#22C55E" },
  { title: "Supplement inspection · Chen residence", tech: "Patel", time: "Today, 3:30 PM", status: "At risk, material delay", statusColor: "#F59E0B" },
  { title: "Gutter install · Elmwood HOA", tech: "Bennett crew", time: "Tomorrow, 8:00 AM", status: "On track", statusColor: "#22C55E" },
  { title: "Emergency tarp · Okafor residence", tech: "Unassigned", time: "Tomorrow, 7:00 AM", status: "Needs a crew", statusColor: "#EF4444" },
];

const CREWS = [
  { name: "Reyes", role: "Tear-off and install", status: "2 jobs", active: true },
  { name: "Kowalski", role: "Install", status: "wrapping at 1 PM", active: true },
  { name: "Patel", role: "Inspections", status: "4 stops", active: true },
  { name: "Bennett", role: "Gutter and trim", status: "on schedule", active: true },
];

export default function RadarSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetSlotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Shared-element transition. The live activity card lives in
  // AnalyzeSection's Act view; we don't render a copy. Instead, as the
  // user scrolls toward this section, we apply a transform to the
  // SAME DOM node (#live-activity-source) so it physically travels
  // from its slot in the Mac window to the empty placeholder slot
  // here. Both source and target rects are recomputed each frame, so
  // the lerp stays correct even with intermediate layout shifts.
  useGSAP(() => {
    const source = document.getElementById("live-activity-source") as HTMLElement | null;
    const target = targetSlotRef.current;
    if (!source || !target) return;

    // Smooth-follow state. We compute a `desired` position from scroll
    // each frame, then ease the rendered transform toward it with a
    // light lerp — that absorbs scroll event jitter and gives the card
    // a soft inhabited feel without lagging behind input perceptibly.
    let currentDx = 0;
    let currentDy = 0;
    let currentScale = 1;
    let active = false;
    let rafId = 0;

    // Centre-origin so scale doesn't shift the centre we just lerped to.
    source.style.transformOrigin = "center center";

    const computeDesired = () => {
      // Strip our inline transform momentarily so getBoundingClientRect
      // reflects the source's rendered position WITHOUT our contribution,
      // but WITH any parent transforms (view-state translates etc.).
      const inline = source.style.transform;
      source.style.transform = "none";
      const baseRect = source.getBoundingClientRect();
      source.style.transform = inline;

      const baseCenter = {
        x: baseRect.left + baseRect.width / 2,
        y: baseRect.top + baseRect.height / 2,
      };
      const tRect = target.getBoundingClientRect();
      const tCenter = {
        x: tRect.left + tRect.width / 2,
        y: tRect.top + tRect.height / 2,
      };
      // Uniform scale so text/icons don't distort. The Mac-frame grid
      // is tuned so the source card's natural width ≈ target slot width,
      // making scale ≈ 1 with the size mismatch under a couple percent.
      const scaleW = baseRect.width > 0 ? tRect.width / baseRect.width : 1;
      const scaleH = baseRect.height > 0 ? tRect.height / baseRect.height : 1;
      const desiredScaleTarget = Math.min(scaleW, scaleH);
      const vpCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      // Phase decisions read AnalyzeSection's bottom edge so the card
      // lifts the moment the user scrolls away from the Act view, not
      // when the radar dashboard slot finally crosses the fold.
      //   • analyze bottom still below viewport bottom → card at source
      //     (user is still inside Act, mac at centre)
      //   • analyze bottom rising toward viewport top → card floats
      //     toward viewport centre, then onto target slot
      const analyzeSection = document.getElementById("analyze-section");
      const aRect = analyzeSection?.getBoundingClientRect();
      const analyzeBottom = aRect ? aRect.bottom : window.innerHeight + 1;
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
      // easeOutQuint — crisp, decelerating curve. Same family as the
      // cubic-bezier(0.22, 1, 0.36, 1) we use across the site so this
      // motion feels native to the system's overall easing language.
      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

      // Single continuous trajectory from the source slot directly to
      // the target slot. NO viewport-centre waypoint — the card never
      // "parks" mid-flight. Progress is driven by how far analyze's
      // bottom edge has scrolled above the viewport bottom.
      //
      // The denominator is innerHeight * 1.55 (not 1×) — extends the
      // scroll range that drives the flight, so the card travels slower
      // than the scroll for a more cinematic, deliberate arrival.
      let desiredCenter: { x: number; y: number };
      let desiredScale: number;
      if (analyzeBottom >= window.innerHeight) {
        desiredCenter = baseCenter;
        desiredScale = 1;
        active = false;
      } else {
        const rawP = clamp01(
          (window.innerHeight - analyzeBottom) / (window.innerHeight * 1.55)
        );
        const p = easeOutQuint(rawP);
        desiredCenter = {
          x: lerp(baseCenter.x, tCenter.x, p),
          y: lerp(baseCenter.y, tCenter.y, p),
        };
        desiredScale = lerp(1, desiredScaleTarget, p);
        active = rawP > 0;
      }
      void vpCenter; // retained for future tuning, intentionally unused

      return {
        dx: desiredCenter.x - baseCenter.x,
        dy: desiredCenter.y - baseCenter.y,
        scale: desiredScale,
      };
    };

    // Per-frame lerp toward desired. 0.055 ≈ 320 ms half-life at 60 fps —
    // the card visibly trails scroll for a slower, more cinematic
    // arrival. Combined with the extended progress range above, the
    // flight reads as a deliberate handoff rather than a snap.
    const LERP = 0.055;
    const tick = () => {
      const { dx, dy, scale } = computeDesired();
      currentDx += (dx - currentDx) * LERP;
      currentDy += (dy - currentDy) * LERP;
      currentScale += (scale - currentScale) * LERP;
      // Snap when close enough so we don't churn forever.
      if (Math.abs(dx - currentDx) < 0.05) currentDx = dx;
      if (Math.abs(dy - currentDy) < 0.05) currentDy = dy;
      if (Math.abs(scale - currentScale) < 0.001) currentScale = scale;
      source.style.transform = `translate3d(${currentDx}px, ${currentDy}px, 0) scale(${currentScale})`;
      source.style.zIndex = active ? "20" : "";
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      source.style.transform = "";
      source.style.zIndex = "";
      source.style.transformOrigin = "";
    };
  }, { scope: sectionRef });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);


  const card: React.CSSProperties = {
    background: "var(--surface2)",
    border: "1px solid var(--card-border)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 8px 32px -8px rgba(0,0,0,0.25)",
  };

  const stagger = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.6s ${0.08 * i}s cubic-bezier(0.22,1,0.36,1)`,
  });

  return (
    <section id="radar-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "120px 24px 140px", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px" }}>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", color: "#E85D3A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
            Task Radar
          </div>
          <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "8px" }}>
            Your dashboard is whatever you ask for.
          </ScrollFloat>
          <p style={{ fontSize: "16px", color: "var(--ink3)", maxWidth: "560px" }}>
            Pin any answer as a live widget. It keeps itself current.
          </p>
        </div>

        {/* Top dashboard row — Live Activity landing slot + Crews today.
            Both sit at the top so the card flying in from the Act view
            settles at the top of the dashboard rather than buried below. */}
        <div className="radar-grid-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", marginTop: "40px" }}>
          <div
            ref={targetSlotRef}
            aria-hidden
            style={{
              borderRadius: "14px",
              border: "1px dashed var(--card-border)",
              opacity: 0,
              minHeight: "100%",
            }}
          />
          <div className="card-depth" style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", position: "relative", overflow: "hidden", ...stagger(0) }}>
            <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Crews today</div>
            {CREWS.map((c, i) => (
              <div
                key={c.name}
                className="row-hover"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  marginBottom: i < CREWS.length - 1 ? "10px" : 0,
                  paddingTop: "4px",
                  paddingBottom: i < CREWS.length - 1 ? "14px" : "4px",
                  borderBottom: i < CREWS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(167,139,250,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <HardHat className="w-4 h-4" style={{ color: "#A78BFA" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>
                    {c.name} · <span style={{ color: "var(--ink2)", fontWeight: 400 }}>{c.role}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink3)" }}>{c.status}</div>
                </div>
                <div
                  className={c.active ? "live-dot" : "live-dot-amber"}
                  style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.active ? "#22C55E" : "#F59E0B", flexShrink: 0 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid: Revenue MTD + Next 24 hours side-by-side. */}
        <div className="radar-grid-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          {/* Revenue MTD vs target */}
          <div className="card-depth" style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", position: "relative", overflow: "hidden", ...stagger(8) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue MTD vs. target</div>
                <div style={{ fontSize: "24px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "2px" }}>$612,400</div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>+$52K</span>
            </div>
            <div className="sparkline-in" style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
              {[45, 58, 42, 65, 55, 70, 62, 78, 72, 85, 80, 90, 85, 92].map((v, i) => (
                <div
                  key={i}
                  className="sparkline-bar"
                  style={{
                    flex: 1,
                    height: `${v}%`,
                    background: i >= 12 ? "#E85D3A" : "rgba(255,255,255,0.08)",
                    borderRadius: "2px 2px 0 0",
                    transitionDelay: `${i * 30}ms`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "14px" }}>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Target</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>$560,000</div>
              </div>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Days left</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>11 days</div>
              </div>
            </div>
          </div>

          {/* Next 24 hours — sits next to Revenue MTD. Compact 2×2 grid
              of the upcoming jobs. */}
          <div className="card-depth" style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", position: "relative", overflow: "hidden", ...stagger(9) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <CalendarDays className="w-4 h-4 text-[#3F3F46]" />
              <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Next 24 hours</span>
            </div>
            <div className="radar-jobs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {UPCOMING_JOBS.map((j) => (
                <div
                  key={j.title}
                  className="card-depth card-depth-lift"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "10px",
                    padding: "12px",
                    cursor: "default",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 500, marginBottom: "6px", lineHeight: 1.3 }}>{j.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                    <Wrench className="w-3 h-3 text-[#3F3F46]" />
                    <span style={{ fontSize: "10.5px", color: j.tech === "Unassigned" ? "#EF4444" : "#71717A" }}>{j.tech}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                    <MapPin className="w-3 h-3 text-[#3F3F46]" />
                    <span style={{ fontSize: "10.5px", color: "var(--ink3)" }}>{j.time}</span>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 500, color: j.statusColor, background: `${j.statusColor}15`, padding: "2px 8px", borderRadius: "100px" }}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
