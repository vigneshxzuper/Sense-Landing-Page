"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Clock, FileText, Users, DollarSign, TrendingUp, TrendingDown, BarChart3, Activity, Wrench, MapPin, CalendarDays } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const ALERT_CARDS = [
  { icon: FileText, label: "Stuck Quotes", value: "3", sub: "$84,000 potential revenue", detail: "Quotes sent but no response in 7+ days", color: "#FCD34D", bg: "linear-gradient(160deg, rgba(245,158,11,0.14) 0%, var(--surface2) 100%)", border: "rgba(245,158,11,0.30)", glow: "rgba(245,158,11,0.25)" },
  { icon: Clock, label: "Jobs Behind SLA", value: "4", sub: "Mostly re-roofing jobs", detail: "Overdue by 2–5 days, SLA breach risk", color: "#FCA5A5", bg: "linear-gradient(160deg, rgba(239,68,68,0.14) 0%, var(--surface2) 100%)", border: "rgba(239,68,68,0.30)", glow: "rgba(239,68,68,0.25)" },
  { icon: AlertTriangle, label: "Pending Invoices", value: "6", sub: "$42,600 unbilled revenue", detail: "Jobs completed but invoices not sent", color: "#F5A788", bg: "linear-gradient(160deg, rgba(232,93,58,0.14) 0%, var(--surface2) 100%)", border: "rgba(232,93,58,0.30)", glow: "rgba(232,93,58,0.25)" },
  { icon: Users, label: "Unassigned Jobs", value: "5", sub: "3 urgent, 2 standard", detail: "Waiting for tech assignment since yesterday", color: "#C4B5FD", bg: "linear-gradient(160deg, rgba(139,92,246,0.14) 0%, var(--surface2) 100%)", border: "rgba(139,92,246,0.30)", glow: "rgba(139,92,246,0.25)" },
];

const KPI_CARDS = [
  { label: "Revenue MTD", value: "$284,500", change: "+14.2%", up: true, icon: DollarSign, accent: "#22C55E", tint: "rgba(34,197,94,0.12)", glow: "rgba(34,197,94,0.28)" },
  { label: "Jobs Completed", value: "142", change: "+8%", up: true, icon: BarChart3, accent: "#38BDF8", tint: "rgba(56,189,248,0.12)", glow: "rgba(56,189,248,0.28)" },
  { label: "Active Technicians", value: "24", change: "−2", up: false, icon: Users, accent: "#A78BFA", tint: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.28)" },
  { label: "Avg Response Time", value: "2.4h", change: "−18min", up: true, icon: Activity, accent: "#F59E0B", tint: "rgba(245,158,11,0.12)", glow: "rgba(245,158,11,0.28)" },
];

const OVERDUE = [
  { name: "Apex Facilities", amount: "$14,400", age: "72 days", risk: "high" },
  { name: "Ridge Corp", amount: "$9,800", age: "61 days", risk: "high" },
  { name: "GreenLeaf Realty", amount: "$7,200", age: "45 days", risk: "mid" },
  { name: "Summit Engineering", amount: "$6,100", age: "38 days", risk: "mid" },
  { name: "Metro HVAC Solutions", amount: "$4,300", age: "22 days", risk: "low" },
];

const UPCOMING_JOBS = [
  { title: "HVAC Maintenance — Premier Properties", tech: "Mike Chen", time: "Today, 2:00 PM", status: "On Track", statusColor: "#22C55E" },
  { title: "Roof Inspection — Lakeside Dental", tech: "Sarah Kim", time: "Today, 4:30 PM", status: "At Risk", statusColor: "#F59E0B" },
  { title: "Electrical Panel — Metro School", tech: "Unassigned", time: "Tomorrow, 9:00 AM", status: "Unassigned", statusColor: "#EF4444" },
  { title: "Plumbing Repair — Horizon Group", tech: "Jake Torres", time: "Tomorrow, 11:00 AM", status: "On Track", statusColor: "#22C55E" },
];

const TEAM_STATUS = [
  { name: "Mike Chen", role: "HVAC Specialist", jobs: 6, rating: 4.8, status: "active" },
  { name: "Sarah Kim", role: "General Tech", jobs: 4, rating: 4.5, status: "active" },
  { name: "Jake Torres", role: "Plumbing", jobs: 5, rating: 4.9, status: "active" },
  { name: "Lisa Wang", role: "Electrical", jobs: 3, rating: 4.7, status: "break" },
];

export default function RadarSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [alertOrder, setAlertOrder] = useState([0, 1, 2, 3]);
  const [grabbedCard, setGrabbedCard] = useState<number | null>(null);
  const [liftPhase, setLiftPhase] = useState<"idle" | "lifting" | "moving" | "dropping">("idle");

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
    <section id="radar-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "120px 24px", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "60px" }}>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", color: "#E85D3A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#E85D3A" }} />
            Radar
          </div>
          <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "8px" }}>
            Everything Happening. Everywhere. Now.
          </ScrollFloat>
          <p style={{ fontSize: "16px", color: "var(--ink3)", maxWidth: "500px" }}>
            Real-time operational intelligence across your entire business.
          </p>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px", marginTop: "40px" }}>
          {KPI_CARDS.map((k, i) => (
            <div
              key={k.label}
              style={{
                ...card,
                background: `linear-gradient(160deg, ${k.tint} 0%, var(--surface2) 100%)`,
                border: `1px solid ${k.glow}`,
                boxShadow: `0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px ${k.glow}`,
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
                background: a.bg,
                border: `1px solid ${isLifted ? "rgba(255,255,255,0.25)" : a.border}`,
                borderRadius: "14px",
                padding: "18px",
                cursor: isLifted ? "grabbing" : "default",
                transform,
                opacity: visible ? 1 : 0,
                zIndex: isGrabbed ? 10 : 1,
                boxShadow: isLifted
                  ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), 0 0 30px ${a.glow}`
                  : isDropping
                  ? `0 4px 12px rgba(0,0,0,0.3)`
                  : `0 2px 12px rgba(0,0,0,0.45), 0 8px 24px -8px ${a.glow}`,
                transition: isLifted
                  ? "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s"
                  : isDropping
                  ? "all 0.4s cubic-bezier(0.22,1,0.36,1)"
                  : grabbedCard !== null && !isGrabbed
                  ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)"
                  : `all 0.6s ${0.08 * (i + 4)}s cubic-bezier(0.22,1,0.36,1)`,
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!grabbedCard) e.currentTarget.style.boxShadow = `0 10px 24px -12px ${a.glow}`; }}
              onMouseLeave={(e) => { if (!grabbedCard) e.currentTarget.style.boxShadow = `0 4px 14px -10px ${a.glow}`; }}
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

        {/* Bottom grid: 3 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>

          {/* Revenue chart */}
          <div style={{ ...card, background: "linear-gradient(160deg, rgba(34,197,94,0.11) 0%, var(--surface2) 100%)", border: "1px solid rgba(34,197,94,0.26)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(34,197,94,0.16)", position: "relative", overflow: "hidden", ...stagger(8) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue MTD vs Target</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "2px" }}>$284,500</div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--green)", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>+$24.5K</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
              {[45, 58, 42, 65, 55, 70, 62, 78, 72, 85, 80, 90, 85, 92].map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}%`, background: i >= 12 ? "#E85D3A" : "rgba(255,255,255,0.08)", borderRadius: "2px 2px 0 0", transition: "height 0.6s" }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "14px" }}>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Target</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>$260,000</div>
              </div>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Days Left</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>20</div>
              </div>
            </div>
          </div>

          {/* Overdue invoices */}
          <div style={{ ...card, background: "linear-gradient(160deg, rgba(239,68,68,0.11) 0%, var(--surface2) 100%)", border: "1px solid rgba(239,68,68,0.26)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(239,68,68,0.16)", position: "relative", overflow: "hidden", ...stagger(9) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Overdue Invoices</span>
              <span style={{ fontSize: "12px", color: "var(--red)", fontWeight: 600 }}>$38,200</span>
            </div>
            {/* Horizontal bars */}
            {[
              { label: "0–30 days", value: 14200, pct: 37, color: "var(--yellow)" },
              { label: "31–60 days", value: 11800, pct: 31, color: "#E85D3A" },
              { label: "60+ days", value: 12200, pct: 32, color: "var(--red)" },
            ].map((b) => (
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
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Invoices</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>14</div>
              </div>
              <div style={{ background: "var(--glass-bg)", borderRadius: "8px", padding: "8px 10px" }}>
                <div style={{ fontSize: "10px", color: "var(--ink3)" }}>Avg Overdue</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>22 days</div>
              </div>
            </div>
          </div>

          {/* Team status */}
          <div style={{ ...card, background: "linear-gradient(160deg, rgba(167,139,250,0.11) 0%, var(--surface2) 100%)", border: "1px solid rgba(167,139,250,0.26)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(167,139,250,0.16)", position: "relative", overflow: "hidden", ...stagger(10) }}>
            <div style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Team Status</div>
            {TEAM_STATUS.map((t, i) => (
              <div
                key={t.name}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  marginBottom: i < TEAM_STATUS.length - 1 ? "10px" : 0,
                  paddingBottom: i < TEAM_STATUS.length - 1 ? "10px" : 0,
                  borderBottom: i < TEAM_STATUS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--glass-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "var(--ink2)" }}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink3)" }}>{t.role} · {t.jobs} jobs · ⭐ {t.rating}</div>
                </div>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.status === "active" ? "#22C55E" : "#F59E0B", boxShadow: t.status === "active" ? "0 0 6px #22C55E" : "none" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming jobs — full width */}
        <div style={{ ...card, marginTop: "16px", background: "linear-gradient(160deg, rgba(56,189,248,0.11) 0%, var(--surface2) 100%)", border: "1px solid rgba(56,189,248,0.26)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(56,189,248,0.16)", position: "relative", overflow: "hidden", ...stagger(11) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <CalendarDays className="w-4 h-4 text-[#3F3F46]" />
            <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Upcoming Schedule</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {UPCOMING_JOBS.map((j) => (
              <div
                key={j.title}
                style={{
                  background: `linear-gradient(160deg, ${j.statusColor}15 0%, rgba(255,255,255,0.03) 70%)`,
                  border: `1px solid ${j.statusColor}40`,
                  borderRadius: "10px",
                  padding: "14px",
                  transition: "all 0.2s",
                  cursor: "default",
                  boxShadow: `0 6px 16px -10px ${j.statusColor}40`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${j.statusColor}70`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 24px -10px ${j.statusColor}60`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${j.statusColor}40`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 6px 16px -10px ${j.statusColor}40`; }}
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
