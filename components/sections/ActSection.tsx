"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Phone, PhoneCall, Mail, MessageSquare, Zap, ArrowRight, Calculator, Clock, Banknote, Percent } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";
import { useDeployedTopic, type DeployTopic } from "@/components/TopicContext";

type IconKey = "calc" | "clock" | "cash" | "percent" | "phone";
type LogIcon = "call" | "email" | "text";

type Variant = {
  agent: { name: string; role: string; status: string; tagline: string };
  steps: { label: string; delay: number }[];
  capabilities: string[];
  metrics: { label: string; before: string; after: string; icon: IconKey }[];
  log: { icon: LogIcon; text: string; detail: string; time: string }[];
  recap: { value: string; label: string }[];
  caption: string;
};

const VARIANTS: Record<DeployTopic, Variant> = {
  performance: {
    agent: {
      name: "Casey",
      role: "Collections Agent",
      status: "Working",
      tagline: "Below, a Collections Agent working those aging supplements live.",
    },
    steps: [
      { label: "Pulling supplements aged 30+ days", delay: 0 },
      { label: "Scoring claims by payout likelihood", delay: 800 },
      { label: "Drafting outreach to adjusters", delay: 1600 },
      { label: "Placing calls to the top 4 carriers", delay: 2400 },
      { label: "Logging responses back to the job", delay: 3200 },
    ],
    capabilities: ["Carrier AR", "Homeowner balances", "Supplement payouts"],
    metrics: [
      { label: "Supplements tracked", before: "0", after: "7", icon: "calc" },
      { label: "Carrier DSO", before: "72 days", after: "41 days", icon: "clock" },
      { label: "Cash recovered this month", before: "$52K", after: "$127K", icon: "cash" },
    ],
    log: [
      { icon: "call", text: "Called State Farm on claim 47220", detail: "$31,400 supplement, 47 days out. Adjuster committed to Thursday payout.", time: "4 min ago" },
      { icon: "email", text: "Escalated Allstate claim AL-2210", detail: "$14,820 pending 38 days. Sent follow-up to adjuster Holloway.", time: "11 min ago" },
      { icon: "call", text: "Called USAA on claim 88041", detail: "$9,200 supplement. Sent back for missing photo coverage.", time: "18 min ago" },
      { icon: "call", text: "Swept Farmers on 4 smaller claims", detail: "$20,500 across 4 homeowners. Two adjusters responded.", time: "26 min ago" },
    ],
    recap: [
      { value: "$31,400", label: "committed Thursday" },
      { value: "$20,500", label: "in flight" },
      { value: "$24,020", label: "escalated" },
    ],
    caption: "Casey worked 7 stuck supplements this shift · Carrier DSO trending 72 → 41 days",
  },
  sla: {
    agent: {
      name: "Morgan",
      role: "Sales Coach Agent",
      status: "Working",
      tagline: "Below, the Sales Coach Agent re-engaging your biggest dormant estimates.",
    },
    steps: [
      { label: "Ranking estimates by value and age", delay: 0 },
      { label: "Pulling inspection notes for each", delay: 800 },
      { label: "Drafting personalized outreach", delay: 1600 },
      { label: "Calling top 5 prospects", delay: 2400 },
      { label: "Scheduling second inspections", delay: 3200 },
    ],
    capabilities: ["Estimate follow-up", "Objection handling", "Financing options"],
    metrics: [
      { label: "Close rate on re-engaged estimates", before: "14%", after: "37%", icon: "percent" },
      { label: "Recovered this week", before: "$0", after: "$167K", icon: "cash" },
    ],
    log: [
      { icon: "call", text: "Called Hargrove residence", detail: "$68,400 re-roof estimate, 19 days stale. Booked a second walk-through Saturday.", time: "6 min ago" },
      { icon: "text", text: "Texted Elmwood HOA board", detail: "$54,200 estimate. Sent financing breakdown. Reply opened.", time: "13 min ago" },
      { icon: "call", text: "Called Okafor residence", detail: "$41,900 estimate. Handled the getting-other-quotes objection. Re-pitched warranty.", time: "21 min ago" },
      { icon: "email", text: "Emailed 9 smaller estimates", detail: "$218,500 combined. Three homeowners replied.", time: "34 min ago" },
    ],
    recap: [
      { value: "1", label: "walk-through booked" },
      { value: "$218,500", label: "re-pitched" },
      { value: "3", label: "warm replies" },
    ],
    caption: "Morgan worked 12 dormant estimates this shift · $167K recovered and climbing",
  },
  revenue: {
    agent: {
      name: "Nova",
      role: "CSR Agent",
      status: "Calling back",
      tagline: "Below, the CSR Agent working through yesterday's missed calls, one by one.",
    },
    steps: [
      { label: "Transcribing yesterday's voicemails", delay: 0 },
      { label: "Scoring each call by urgency and lead value", delay: 800 },
      { label: "Placing callbacks in priority order", delay: 1600 },
      { label: "Booking inspections that qualify", delay: 2400 },
      { label: "Flagging calls that need you personally", delay: 3200 },
    ],
    capabilities: ["Call triage", "Callbacks and scheduling", "Routing to the owner"],
    metrics: [
      { label: "Calls resolved", before: "0 of 11", after: "9 of 11", icon: "phone" },
      { label: "Avg callback time", before: "Next morning", after: "14 minutes", icon: "clock" },
    ],
    log: [
      { icon: "call", text: "Called back the storm damage lead", detail: "918-555-0144. Active leak. Inspection booked for today 11 AM with Patel.", time: "7 min ago" },
      { icon: "call", text: "Called Meridian Builders", detail: "Commercial re-roof, 18 squares. Flagged for you to call back personally.", time: "15 min ago" },
      { icon: "call", text: "Reached 4 new residential leads", detail: "2 scheduled for inspection this week. 1 price shopper. 1 wrong number.", time: "23 min ago" },
      { icon: "email", text: "Answered Mrs. Delacroix's warranty question", detail: "Routed to the production team. No owner attention needed.", time: "31 min ago" },
    ],
    recap: [
      { value: "3", label: "inspections booked" },
      { value: "1", label: "flagged for you" },
      { value: "2", label: "left to reach" },
    ],
    caption: "Nova worked 11 missed calls in 31 minutes · The storm lead was in the truck before your coffee went cold",
  },
};

const ICON_MAP: Record<IconKey, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  calc: Calculator,
  clock: Clock,
  cash: Banknote,
  percent: Percent,
  phone: PhoneCall,
};

export default function ActSection() {
  const { deployedTopic } = useDeployedTopic();
  const variant = VARIANTS[deployedTopic];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [showLog, setShowLog] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !started) setStarted(true); },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Replay the sequence whenever the deployed agent changes (or first start).
  useEffect(() => {
    if (!started) return;
    setCompletedSteps([]);
    setActiveStep(-1);
    setShowLog(false);
    setVisibleLogs(0);
    setShowResult(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    variant.steps.forEach((step, i) => {
      timers.push(setTimeout(() => setActiveStep(i), step.delay));
      timers.push(setTimeout(() => setCompletedSteps((prev) => [...prev, i]), step.delay + 700));
    });
    timers.push(setTimeout(() => setShowLog(true), 4200));
    variant.log.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLogs(i + 1), 4600 + i * 400));
    });
    timers.push(setTimeout(() => setShowResult(true), 6400));

    return () => timers.forEach(clearTimeout);
  }, [started, deployedTopic, variant]);

  const cardStyle: React.CSSProperties = {
    background: "var(--surface2)",
    border: "1px solid var(--card-border)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.35), 0 8px 32px -8px rgba(0,0,0,0.25)",
  };

  return (
    <section id="act-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "160px 24px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto 60px" }}>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "12px" }}>
          Act.
        </ScrollFloat>
        <p style={{ fontSize: "17px", color: "var(--ink2)", maxWidth: "560px", lineHeight: 1.6, marginBottom: "60px" }}>
          {variant.agent.tagline}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* LEFT: Agent + Stepper */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Agent card */}
            <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(232,93,58,0.13) 0%, var(--surface2) 100%)", border: "1px solid rgba(232,93,58,0.30)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(232,93,58,0.18)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #E85D3A, #C4472A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(232,93,58,0.25)" }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>{variant.agent.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--ink3)" }}>{variant.agent.role}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: started ? "#22C55E" : "#3F3F46", boxShadow: started ? "0 0 8px #22C55E" : "none", animation: started ? "blink 2s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: "11px", color: started ? "#4ADE80" : "#3F3F46" }}>{started ? variant.agent.status : "Idle"}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                {variant.capabilities.map((tag) => (
                  <span key={tag} style={{ background: "var(--glass-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "3px 10px", fontSize: "11px", color: "var(--ink2)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stepper */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {variant.steps.map((step, i) => {
                  const done = completedSteps.includes(i);
                  const active = activeStep === i && !done;
                  return (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: activeStep >= i ? 1 : 0.3, transition: "opacity 0.4s" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                        {done ? (
                          <CheckCircle2 className="w-[18px] h-[18px]" style={{ color: "var(--green)", flexShrink: 0 }} />
                        ) : active ? (
                          <Loader2 className="w-[18px] h-[18px] animate-spin" style={{ color: "#E85D3A", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #3F3F46" }} />
                        )}
                        {i < variant.steps.length - 1 && (
                          <div style={{ width: "1.5px", height: "20px", background: done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)", transition: "background 0.4s" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: "12px" }}>
                        <div style={{ fontSize: "13px", color: done ? "#A1A1AA" : active ? "#FAFAFA" : "#52525B", transition: "color 0.3s" }}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metric cards — independent tiles, each with its own arrow */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {variant.metrics.map((m) => {
                const Icon = ICON_MAP[m.icon];
                return (
                  <div
                    key={m.label}
                    style={{
                      ...cardStyle,
                      background: "linear-gradient(160deg, rgba(34,197,94,0.10), var(--surface2) 70%)",
                      border: "1px solid rgba(34,197,94,0.28)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(34,197,94,0.14)",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon className="w-[18px] h-[18px]" style={{ color: "#4ADE80" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--ink3)", textDecoration: "line-through" }}>{m.before}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#E85D3A]" />
                        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--green)" }}>{m.after}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live log + Result */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Activity feed */}
            <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(96,165,250,0.11) 0%, var(--surface2) 100%)", border: "1px solid rgba(96,165,250,0.28)", boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(96,165,250,0.16)", position: "relative", overflow: "hidden", flex: 1, opacity: showLog ? 1 : 0, transform: showLog ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E", animation: "blink 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{variant.agent.name} · Live activity</span>
              </div>

              {variant.log.map((entry, i) => (
                <div
                  key={`${deployedTopic}-${i}`}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: i < variant.log.length - 1 ? "10px" : 0,
                    paddingBottom: i < variant.log.length - 1 ? "10px" : 0,
                    borderBottom: i < variant.log.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    opacity: i < visibleLogs ? 1 : 0,
                    transform: i < visibleLogs ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div style={{ marginTop: "2px", flexShrink: 0, color: entry.icon === "call" ? "#60a5fa" : entry.icon === "text" ? "#34d399" : "#a78bfa" }}>
                    {entry.icon === "call" ? <Phone className="w-3.5 h-3.5" /> : entry.icon === "text" ? <MessageSquare className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{entry.text}</div>
                    <div style={{ fontSize: "11px", color: "var(--ink3)", marginTop: "2px" }}>{entry.detail}</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--ink3)", whiteSpace: "nowrap", marginTop: "2px" }}>{entry.time}</div>
                </div>
              ))}
            </div>

            {/* Shift recap */}
            <div
              style={{
                background: "linear-gradient(160deg, rgba(34,197,94,0.16) 0%, var(--surface2) 100%)",
                border: "1px solid rgba(34,197,94,0.32)",
                borderRadius: "14px",
                padding: "20px",
                opacity: showResult ? 1 : 0,
                transform: showResult ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
                transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.45), 0 8px 28px -8px rgba(34,197,94,0.20)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>Shift recap</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {variant.recap.map((r) => (
                  <div key={r.label} style={{ background: "rgba(34,197,94,0.06)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--green)", letterSpacing: "-0.02em" }}>{r.value}</div>
                    <div style={{ fontSize: "11px", color: "#86EFAC", marginTop: "2px" }}>{r.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink3)", marginTop: "12px", textAlign: "center" }}>
                {variant.caption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
