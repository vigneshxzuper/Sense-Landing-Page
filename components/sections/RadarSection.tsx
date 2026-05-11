"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, Clock, FileText, Users, DollarSign, TrendingUp, TrendingDown, BarChart3, Activity, Wrench, MapPin, CalendarDays, Phone, HardHat } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ALERT_CARDS = [
  { icon: FileText, label: "Stuck supplements", value: "7", sub: "$164,300 sitting with carriers", detail: "Submitted 30+ days ago. Oldest is State Farm at 47 days.", color: "#FCD34D", bg: "linear-gradient(160deg, rgba(245,158,11,0.14) 0%, var(--surface2) 100%)", border: "rgba(245,158,11,0.30)", glow: "rgba(245,158,11,0.25)" },
  { icon: Clock, label: "Dormant estimates", value: "12", sub: "$318,000 aging out", detail: "No touch in 10+ days. Sales Coach Agent is ready.", color: "#FCA5A5", bg: "linear-gradient(160deg, rgba(239,68,68,0.14) 0%, var(--surface2) 100%)", border: "rgba(239,68,68,0.30)", glow: "rgba(239,68,68,0.25)" },
  { icon: AlertTriangle, label: "Unsent invoices", value: "9", sub: "$87,450 in completed work", detail: "Jobs closed out. Invoices never went.", color: "#F5A788", bg: "linear-gradient(160deg, rgba(232,93,58,0.14) 0%, var(--surface2) 100%)", border: "rgba(232,93,58,0.30)", glow: "rgba(232,93,58,0.25)" },
  { icon: Phone, label: "Missed calls", value: "11", sub: "3 urgent", detail: "CSR Agent has cleared 9 of them since this morning.", color: "#C4B5FD", bg: "linear-gradient(160deg, rgba(139,92,246,0.14) 0%, var(--surface2) 100%)", border: "rgba(139,92,246,0.30)", glow: "rgba(139,92,246,0.25)" },
];

const KPI_CARDS = [
  { label: "Pipeline value", value: "$1.82M", change: "+9.4%", up: true, icon: DollarSign, accent: "#22C55E", tint: "rgba(34,197,94,0.12)", glow: "rgba(34,197,94,0.28)" },
  { label: "Jobs in production", value: "31", change: "+4", up: true, icon: Wrench, accent: "#38BDF8", tint: "rgba(56,189,248,0.12)", glow: "rgba(56,189,248,0.28)" },
  { label: "Open supplements", value: "18", change: "+3", up: false, icon: FileText, accent: "#A78BFA", tint: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.28)" },
  { label: "Same-day close rate", value: "54%", change: "+6 pts", up: true, icon: Activity, accent: "#F59E0B", tint: "rgba(245,158,11,0.12)", glow: "rgba(245,158,11,0.28)" },
];

const RECEIVABLES_BUCKETS = [
  { label: "0–30 days", value: 74200, pct: 31, color: "var(--yellow)" },
  { label: "31–60 days", value: 83900, pct: 35, color: "#E85D3A" },
  { label: "60+ days", value: 83700, pct: 34, color: "var(--red)" },
];

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
  const [alertOrder, setAlertOrder] = useState([0, 1, 2, 3]);
  const [grabbedCard, setGrabbedCard] = useState<number | null>(null);
  const [liftPhase, setLiftPhase] = useState<"idle" | "lifting" | "moving" | "dropping">("idle");

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
    let active = false;
    let rafId = 0;

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
      if (analyzeBottom >= window.innerHeight) {
        desiredCenter = baseCenter;
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
        active = rawP > 0;
      }
      void vpCenter; // retained for future tuning, intentionally unused

      return {
        dx: desiredCenter.x - baseCenter.x,
        dy: desiredCenter.y - baseCenter.y,
      };
    };

    // Per-frame lerp toward desired. 0.055 ≈ 320 ms half-life at 60 fps —
    // the card visibly trails scroll for a slower, more cinematic
    // arrival. Combined with the extended progress range above, the
    // flight reads as a deliberate handoff rather than a snap.
    const LERP = 0.055;
    const tick = () => {
      const { dx, dy } = computeDesired();
      currentDx += (dx - currentDx) * LERP;
      currentDy += (dy - currentDy) * LERP;
      // Snap when close enough so we don't churn forever.
      if (Math.abs(dx - currentDx) < 0.05) currentDx = dx;
      if (Math.abs(dy - currentDy) < 0.05) currentDy = dy;
      source.style.transform = `translate3d(${currentDx}px, ${currentDy}px, 0)`;
      source.style.zIndex = active ? "20" : "";
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      source.style.transform = "";
      source.style.zIndex = "";
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

  // Simulate grab-and-drag rearrange
  useEffect(() => {
    if (!visible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 1: Grab card index 1 (Jobs Behind SLA)
    timers.push(setTimeout(() => {
      setGrabbedCard(1);
      setLiftPhase("lifting");
    }, 2200));

    // Step 2: Lift it up
    timers.push(setTimeout(() => {
      setLiftPhase("moving");
    }, 2600));

    // Step 3: Move it to position 0 (swap with Stuck Quotes)
    timers.push(setTimeout(() => {
      setAlertOrder([1, 0, 2, 3]);
    }, 3000));

    // Step 4: Drop it
    timers.push(setTimeout(() => {
      setLiftPhase("dropping");
    }, 3600));

    // Step 5: Reset grab state
    timers.push(setTimeout(() => {
      setGrabbedCard(null);
      setLiftPhase("idle");
    }, 4000));

    // Step 6: Grab card index 2 (Pending Invoices) and move to pos 1
    timers.push(setTimeout(() => {
      setGrabbedCard(2);
      setLiftPhase("lifting");
    }, 5000));
    timers.push(setTimeout(() => {
      setLiftPhase("moving");
    }, 5400));
    timers.push(setTimeout(() => {
      setAlertOrder([1, 2, 0, 3]);
    }, 5800));
    timers.push(setTimeout(() => {
      setLiftPhase("dropping");
    }, 6400));
    timers.push(setTimeout(() => {
      setGrabbedCard(null);
      setLiftPhase("idle");
    }, 6800));

    return () => timers.forEach(clearTimeout);
  }, [visible]);

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
    <section id="radar-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "60px 24px 120px", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px" }}>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", color: "#E85D3A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
            Task Radar
          </div>
          <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "8px" }}>
            Your dashboard is whatever you ask for.
          </ScrollFloat>
          <p style={{ fontSize: "16px", color: "var(--ink3)", maxWidth: "560px" }}>
            Pin any answer as a live widget. It keeps itself current.
          </p>
        </div>

        {/* Top dashboard row — Live Activity landing slot + Crews today.
            Both sit at the top so the card flying in from the Act view
            settles at the top of the dashboard rather than buried below. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", marginTop: "40px" }}>
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
          <div style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "none", position: "relative", overflow: "hidden", ...stagger(0) }}>
            <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Crews today</div>
            {CREWS.map((c, i) => (
              <div
                key={c.name}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  marginBottom: i < CREWS.length - 1 ? "10px" : 0,
                  paddingBottom: i < CREWS.length - 1 ? "10px" : 0,
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
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.active ? "#22C55E" : "#F59E0B", boxShadow: c.active ? "0 0 6px #22C55E" : "none", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
          {KPI_CARDS.map((k, i) => (
            <div
              key={k.label}
              style={{
                ...card,
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "none",
                position: "relative",
                overflow: "hidden",
                ...stagger(i),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
                <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: `${k.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <k.icon className="w-3.5 h-3.5" style={{ color: k.accent, opacity: 0.9 }} />
                </div>
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em" }}>{k.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                {k.up ? <TrendingUp className="w-3 h-3 text-[#22C55E]" /> : <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
                <span style={{ fontSize: "12px", color: k.up ? "#22C55E" : "#EF4444" }}>{k.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alert cards row — with grab & drag rearrange */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
          {ALERT_CARDS.map((a, i) => {
            const targetPos = alertOrder.indexOf(i);
            const offset = targetPos - i;
            const isGrabbed = grabbedCard === i;
            const isLifted = isGrabbed && (liftPhase === "lifting" || liftPhase === "moving");
            const isDropping = isGrabbed && liftPhase === "dropping";

            // Build transform
            let transform = "translateY(20px)"; // initial hidden state
            if (visible) {
              if (isLifted) {
                // Card is grabbed — lift up, tilt, and move to target
                const moveX = liftPhase === "moving" ? `calc(${offset * 100}% + ${offset * 12}px)` : "0px";
                transform = `translateX(${moveX}) translateY(-16px) rotate(-2deg) scale(1.05)`;
              } else if (isDropping) {
                // Dropping down into place
                transform = `translateX(calc(${offset * 100}% + ${offset * 12}px)) translateY(0) rotate(0deg) scale(1)`;
              } else if (offset !== 0) {
                // Settled in new position
                transform = `translateX(calc(${offset * 100}% + ${offset * 12}px))`;
              } else {
                transform = "translateY(0)";
              }
            }

            return (
            <div
              key={a.label}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${isLifted ? "rgba(255,255,255,0.25)" : "var(--card-border)"}`,
                borderRadius: "14px",
                padding: "18px",
                cursor: isLifted ? "grabbing" : "default",
                transform,
                opacity: visible ? 1 : 0,
                zIndex: isGrabbed ? 10 : 1,
                boxShadow: isLifted
                  ? "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                  : isDropping
                  ? "0 4px 12px rgba(0,0,0,0.3)"
                  : "none",
                transition: isLifted
                  ? "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s"
                  : isDropping
                  ? "all 0.4s cubic-bezier(0.22,1,0.36,1)"
                  : grabbedCard !== null && !isGrabbed
                  ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)"
                  : `all 0.6s ${0.08 * (i + 4)}s cubic-bezier(0.22,1,0.36,1)`,
                position: "relative",
              }}
            >
              {/* Grab handle dots — visible on grabbed card */}
              {isGrabbed && (
                <div style={{
                  position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: "3px", opacity: 0.5,
                }}>
                  {[0,1,2,3,4,5].map(d => (
                    <div key={d} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: a.color }}>{a.label}</span>
              </div>
              <div style={{ fontSize: "32px", fontWeight: 700, color: a.color, letterSpacing: "-0.03em", marginBottom: "4px" }}>{a.value}</div>
              <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "2px" }}>{a.sub}</div>
              <div style={{ fontSize: "11px", color: "var(--ink3)" }}>{a.detail}</div>
            </div>
            );
          })}
        </div>

        {/* Bottom grid: 2 columns × 2 rows. One slot in the second row
            is the target landing zone for the live activity card that
            travels in from AnalyzeSection. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          {/* Revenue MTD vs target */}
          <div style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "none", position: "relative", overflow: "hidden", ...stagger(8) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue MTD vs. target</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "2px" }}>$612,400</div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>+$52K</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
              {[45, 58, 42, 65, 55, 70, 62, 78, 72, 85, 80, 90, 85, 92].map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}%`, background: i >= 12 ? "#E85D3A" : "rgba(255,255,255,0.08)", borderRadius: "2px 2px 0 0", transition: "height 0.6s" }} />
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

          {/* Aging receivables */}
          <div style={{ ...card, background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "none", position: "relative", overflow: "hidden", ...stagger(9) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Aging receivables</span>
              <span style={{ fontSize: "12px", color: "var(--red)", fontWeight: 600 }}>$241,800</span>
            </div>
            {/* Horizontal bars */}
            {RECEIVABLES_BUCKETS.map((b) => (
              <div key={b.label} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--ink2)" }}>{b.label}</span>
                  <span style={{ color: "var(--ink2)", fontWeight: 500 }}>${(b.value / 1000).toFixed(1)}K</span>
                </div>
                <div style={{ height: "6px", background: "var(--glass-bg)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: visible ? `${b.pct}%` : "0%", background: b.color, borderRadius: "3px", transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "14px" }}>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Open invoices</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>22</div>
              </div>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Avg age</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>38 days</div>
              </div>
            </div>
          </div>

        </div>

        {/* Upcoming jobs — full width */}
        <div style={{ ...card, marginTop: "16px", background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "none", position: "relative", overflow: "hidden", ...stagger(11) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <CalendarDays className="w-4 h-4 text-[#3F3F46]" />
            <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Next 24 hours</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {UPCOMING_JOBS.map((j) => (
              <div
                key={j.title}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "10px",
                  padding: "14px",
                  transition: "all 0.2s",
                  cursor: "default",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500, marginBottom: "6px", lineHeight: 1.3 }}>{j.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  <Wrench className="w-3 h-3 text-[#3F3F46]" />
                  <span style={{ fontSize: "11px", color: j.tech === "Unassigned" ? "#EF4444" : "#71717A" }}>{j.tech}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <MapPin className="w-3 h-3 text-[#3F3F46]" />
                  <span style={{ fontSize: "11px", color: "var(--ink3)" }}>{j.time}</span>
                </div>
                <span style={{ fontSize: "10px", fontWeight: 500, color: j.statusColor, background: `${j.statusColor}15`, padding: "2px 8px", borderRadius: "100px" }}>
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
