"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SenseChat } from "@/components/ui/sense-chat";
import ScrollFloat from "@/components/ScrollFloat";
import { Sparkles, CheckCircle2, Loader2, Phone, Mail, MessageSquare, Zap } from "lucide-react";
import { useDeployedTopic, type DeployTopic } from "@/components/TopicContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

function BrowserOutlineBackdrop({ revealed, parallax }: { revealed: boolean; parallax: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        transform: `translateY(${parallax + 35}px)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: "min(1240px, 94%)",
          position: "relative",
          opacity: revealed ? 1 : 0,
          transform: revealed
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.97)",
          transition:
            "opacity 900ms cubic-bezier(0.32, 0.72, 0, 1), transform 1100ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform, opacity",
        }}
      >
      {/* Glass fill matching window frame */}
      <div
        style={{
          position: "absolute",
          left: "1.25%",
          top: "3.57%",
          right: "1.25%",
          bottom: "3.57%",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 100%)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
      <svg
        viewBox="0 0 1600 1120"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter:
            "drop-shadow(0 0 0.5px rgba(255,255,255,0.6)) drop-shadow(0 0 6px rgba(255,255,255,0.28)) drop-shadow(0 0 18px rgba(255,255,255,0.16)) drop-shadow(0 0 40px rgba(255,255,255,0.08))",
          maskImage:
            "radial-gradient(ellipse 95% 95% at center, #000 75%, rgba(0,0,0,0.35) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 95% at center, #000 75%, rgba(0,0,0,0.35) 100%)",
        }}
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Window frame */}
          <rect x="20" y="40" width="1560" height="1040" rx="22" />
          {/* Title bar divider */}
          <line x1="20" y1="110" x2="1580" y2="110" />
        </g>

        {/* Traffic light dots — macOS canonical */}
        <g>
          <circle cx="58" cy="75" r="8" fill="#FF5F56" />
          <circle cx="86" cy="75" r="8" fill="#FFBD2E" />
          <circle cx="114" cy="75" r="8" fill="#27C93F" />
        </g>

        {/* URL pill — centered, minimal */}
        <rect x="640" y="60" width="320" height="28" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" />
      </svg>
      </div>
    </div>
  );
}

type Topic = "performance" | "sla" | "revenue" | null;

/* ── TOPIC CONFIG ── */
const TOPIC_CONFIG = {
  revenue: {
    question: "Calls I missed yesterday",
    aiText: "11 missed calls. 3 look like storm damage, 2 are existing customers, 6 are new leads.",
  },
  performance: {
    question: "Aging supplements by carrier",
    aiText: "7 supplements are past 30 days. $164,300 waiting across 4 carriers.",
  },
  sla: {
    question: "Estimates over $25K that need follow-up",
    aiText: "12 estimates totaling $483,000. Average age since last touch: 14 days.",
  },
};

/* ── CHART DATA ── */
const missedCallKpis = [
  { label: "MISSED", value: "11" },
  { label: "PIPELINE AT RISK", value: "$78K" },
  { label: "URGENT", value: "3", accent: "#ef4444" },
];
const missedCallRows = [
  { time: "4:47 PM", caller: "918-555-0144", reason: "Storm damage, roof leaking", value: "~$22K", urgent: true },
  { time: "5:12 PM", caller: "Meridian Builders", reason: "Commercial re-roof inquiry", value: "~$40K" },
  { time: "6:03 PM", caller: "Unknown", reason: "Called twice, no voicemail", value: "Unknown" },
];
const missedCallMore = 8;
const carrierAgingRows = [
  { carrier: "State Farm", pending: 72400, days: 47 },
  { carrier: "Allstate", pending: 41800, days: 38 },
  { carrier: "USAA", pending: 29600, days: 33 },
  { carrier: "Farmers", pending: 20500, days: 31 },
];
const carrierAgingChart = {
  labels: carrierAgingRows.map((r) => r.carrier),
  datasets: [
    {
      label: "$ pending",
      data: carrierAgingRows.map((r) => r.pending),
      backgroundColor: ["rgba(232,93,58,0.85)", "rgba(232,93,58,0.6)", "rgba(232,93,58,0.45)", "rgba(232,93,58,0.32)"],
      borderRadius: 6,
      barPercentage: 0.7,
    },
  ],
};
const carrierChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1e1e24",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#A1A1AA",
      cornerRadius: 8,
      padding: 10,
      callbacks: {
        label: (ctx: any) => `$${ctx.parsed.x.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.08)" },
      ticks: {
        color: "rgba(255,255,255,0.7)",
        font: { size: 12 },
        callback: (v: any) => `$${(Number(v) / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { color: "#ffffff", font: { size: 13, weight: 500 } },
      border: { display: false },
    },
  },
};
const chartOpts = (max: number) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" as const, labels: { color: "var(--ink2)", padding: 20, usePointStyle: true, font: { size: 13 } } },
    tooltip: { backgroundColor: "#1e1e24", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, titleColor: "#fff", bodyColor: "#A1A1AA", cornerRadius: 8, padding: 10 },
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "var(--ink2)", font: { size: 12 } }, border: { display: false } },
    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "var(--ink2)", font: { size: 12 } }, border: { display: false }, max },
  },
});

const estimateKpis = [
  { label: "ESTIMATES", value: "12" },
  { label: "TOTAL VALUE", value: "$483K" },
  { label: "AT RISK OF AGING OUT", value: "$318K" },
];
const estimateRows = [
  { name: "Hargrove residence", value: 68400, days: 19 },
  { name: "Elmwood HOA", value: 54200, days: 16 },
  { name: "Okafor residence", value: 41900, days: 12 },
];
const estimateMore = 9;
/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 20, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);
  return { displayed, done };
}

/* ── COMPONENT ── */
type ActVariant = {
  agent: { name: string; role: string; status: string; tagline: string };
  steps: string[];
  capabilities: string[];
  log: { icon: "call" | "email" | "text"; text: string; time: string }[];
  recap: { value: string; label: string }[];
  caption: string;
};

const ACT_VARIANTS: Record<DeployTopic, ActVariant> = {
  performance: {
    agent: { name: "Casey", role: "Collections Agent", status: "Working", tagline: "Collections Agent working those aging supplements live." },
    steps: ["Pulling supplements aged 30+ days", "Scoring claims by payout likelihood", "Drafting outreach to adjusters", "Placing calls to top 4 carriers", "Logging responses back to the job"],
    capabilities: ["Carrier AR", "Homeowner balances", "Supplement payouts"],
    log: [
      { icon: "call", text: "Called State Farm on claim 47220", time: "4 min ago" },
      { icon: "email", text: "Escalated Allstate claim AL-2210", time: "11 min ago" },
      { icon: "call", text: "Called USAA on claim 88041", time: "18 min ago" },
      { icon: "call", text: "Swept Farmers on 4 smaller claims", time: "26 min ago" },
    ],
    recap: [
      { value: "$31,400", label: "committed Thursday" },
      { value: "$20,500", label: "in flight" },
      { value: "$24,020", label: "escalated" },
    ],
    caption: "Casey worked 7 stuck supplements · Carrier DSO 72 → 41 days",
  },
  sla: {
    agent: { name: "Morgan", role: "Sales Coach Agent", status: "Working", tagline: "Sales Coach Agent re-engaging your biggest dormant estimates." },
    steps: ["Ranking estimates by value and age", "Pulling inspection notes for each", "Drafting personalized outreach", "Calling top 5 prospects", "Scheduling second inspections"],
    capabilities: ["Estimate follow-up", "Objection handling", "Financing options"],
    log: [
      { icon: "call", text: "Called Hargrove residence", time: "6 min ago" },
      { icon: "text", text: "Texted Elmwood HOA board", time: "13 min ago" },
      { icon: "call", text: "Called Okafor residence", time: "21 min ago" },
      { icon: "email", text: "Emailed 9 smaller estimates", time: "34 min ago" },
    ],
    recap: [
      { value: "1", label: "walk-through booked" },
      { value: "$218,500", label: "re-pitched" },
      { value: "3", label: "warm replies" },
    ],
    caption: "Morgan worked 12 dormant estimates · $167K recovered and climbing",
  },
  revenue: {
    agent: { name: "Nova", role: "CSR Agent", status: "Calling back", tagline: "CSR Agent working through yesterday's missed calls, one by one." },
    steps: ["Transcribing yesterday's voicemails", "Scoring each call by urgency and lead value", "Placing callbacks in priority order", "Booking inspections that qualify", "Flagging calls that need you personally"],
    capabilities: ["Call triage", "Callbacks and scheduling", "Routing to the owner"],
    log: [
      { icon: "call", text: "Called back the storm damage lead", time: "7 min ago" },
      { icon: "call", text: "Called Meridian Builders", time: "15 min ago" },
      { icon: "call", text: "Reached 4 new residential leads", time: "23 min ago" },
      { icon: "email", text: "Answered Mrs. Delacroix's warranty question", time: "31 min ago" },
    ],
    recap: [
      { value: "3", label: "inspections booked" },
      { value: "1", label: "flagged for you" },
      { value: "2", label: "left to reach" },
    ],
    caption: "Nova worked 11 missed calls in 31 minutes · Storm lead on the truck before coffee went cold",
  },
};

export default function AnalyzeSection() {
  const [topic, setTopic] = useState<Topic>(null);
  const [view, setView] = useState<"ask" | "analyze" | "act">("ask");
  const { deployedTopic, setDeployedTopic } = useDeployedTopic();
  const [actCompleted, setActCompleted] = useState<number[]>([]);
  const [actActive, setActActive] = useState(-1);
  const handleDeploy = (variant: "performance" | "sla" | "revenue") => {
    setDeployedTopic(variant);
    setView("act");
  };
  const VIEW_INDEX: Record<"ask" | "analyze" | "act", number> = { ask: 0, analyze: 1, act: 2 };
  // Smaller slide distance + opacity so we don't need overflow:hidden (which clipped the Mac shadow).
  const offsetFor = (own: "ask" | "analyze" | "act") => (VIEW_INDEX[own] - VIEW_INDEX[view]) * 28;
  const isActive = (own: "ask" | "analyze" | "act") => own === view;
  const slideTransition = "transform 760ms cubic-bezier(0.65, 0, 0.35, 1), opacity 600ms cubic-bezier(0.65, 0, 0.35, 1)";

  // Run the Act stepper sequence whenever view enters "act".
  useEffect(() => {
    if (view !== "act") return;
    setActCompleted([]);
    setActActive(-1);
    const variant = ACT_VARIANTS[deployedTopic];
    const timers: ReturnType<typeof setTimeout>[] = [];
    variant.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setActActive(i), i * 720));
      timers.push(setTimeout(() => setActCompleted((p) => [...p, i]), i * 720 + 540));
    });
    return () => timers.forEach(clearTimeout);
  }, [view, deployedTopic]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const config = topic ? TOPIC_CONFIG[topic] : null;
  const { displayed: aiText, done: aiDone } = useTypewriter(config?.aiText || "", 8, showAiResponse);

  // Show chart once typing finishes
  useEffect(() => {
    if (aiDone) {
      const t = setTimeout(() => setShowChart(true), 150);
      return () => clearTimeout(t);
    }
  }, [aiDone]);

  const hasTriggered = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const [askProgress, setAskProgress] = useState(0);
  const [backdropRevealed, setBackdropRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = askRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const distance = vh - rect.top;
      const total = vh;
      const p = Math.max(0, Math.min(1, distance / total));
      setAskProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (askProgress > 0.15 && !backdropRevealed) {
      const t = setTimeout(() => setBackdropRevealed(true), 500);
      return () => clearTimeout(t);
    }
  }, [askProgress, backdropRevealed]);

  const parallaxOffset = (askProgress - 0.5) * -50;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const triggerTopic = (t: Topic) => {
    setShowQuestion(false);
    setShowAiResponse(false);
    setShowChart(false);
    setTopic(t);
    setSelectedIdx(0);
    setView("analyze");
    setTimeout(() => setShowQuestion(true), 100);
    setTimeout(() => setShowAiResponse(true), 350);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const t = (e as CustomEvent).detail?.topic as Topic;
      hasTriggered.current = true;
      triggerTopic(t);
    };
    window.addEventListener("sense-chip-click", handler);
    return () => window.removeEventListener("sense-chip-click", handler);
  }, []);

  // No auto-trigger — page lands on the Ask view; user picks a prompt to advance.

  const cardStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "var(--card-shadow)",
  };

  return (
    <section
      id="analyze-section"
      ref={sectionRef}
      style={{ background: "var(--bg)", padding: "0 24px", position: "relative" }}
    >
      {/* Ask — centered header + chat. View state swaps Ask / Analyze / Act inside the Mac window. */}
      <div ref={askRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 0", position: "relative" }}>
        <BrowserOutlineBackdrop revealed={backdropRevealed} parallax={parallaxOffset} />
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
            transform:
              view === "ask"
                ? `translateY(calc(${(1 - Math.min(1, askProgress / 0.3)) * 24}px))`
                : `translateY(${offsetFor("ask")}%)`,
            opacity: view === "ask" ? Math.min(1, askProgress / 0.25) : 0,
            pointerEvents: view === "ask" ? "auto" : "none",
            transition:
              view === "ask" && askProgress < 1
                ? "none"
                : slideTransition,
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <ScrollFloat as="h2" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.05, color: "var(--ink)", marginBottom: "14px" }}>
              Ask.
            </ScrollFloat>
            <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "var(--ink2)", lineHeight: 1.5, maxWidth: "480px", margin: "0 auto", fontWeight: 400 }}>
              Pick a prompt below or type your own.
            </p>
          </div>

          <div>
            <SenseChat />
          </div>
        </div>
      </div>

      {/* Analyze — chat + chart, overlays the Mac window when view === "analyze" */}
      <div
        id="analyze-content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: isActive("analyze") ? 1 : 0,
          transform: `translateY(${offsetFor("analyze")}%)`,
          pointerEvents: view === "analyze" ? "auto" : "none",
          transition: slideTransition,
        }}
      >
        <div style={{ width: "min(1240px, 94vw)", height: "min(868px, 65.8vw)", maxHeight: "88vh", position: "relative" }}>
        <div style={{ position: "absolute", top: "9.82%", left: "1.25%", right: "1.25%", bottom: "3.57%", overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", gap: "8px" }}>
        <h2 style={{ fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.25, color: "var(--ink)", marginBottom: "4px", marginTop: 0 }}>
          Analyze.
        </h2>
        <p style={{ fontSize: "12px", color: "var(--ink2)", lineHeight: 1.5, margin: "0 0 10px 0", fontWeight: 400 }}>
          See how Sense breaks down the answer.
        </p>


        {/* Chat conversation */}
        {topic && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>

            {/* User question bubble */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                opacity: showQuestion ? 1 : 0,
                transform: showQuestion ? "translateX(0)" : "translateX(16px)",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                style={{
                  background: "rgba(232,93,58,0.08)",
                  border: "1px solid rgba(232,93,58,0.2)",
                  borderRadius: "16px 16px 4px 16px",
                  padding: "12px 18px",
                  fontSize: "15px",
                  color: "var(--ink)",
                  maxWidth: "400px",
                }}
              >
                {config?.question}
              </div>
            </div>

            {/* AI response */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                opacity: showAiResponse ? 1 : 0,
                transform: showAiResponse ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #E85D3A, #C4472A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 0 16px rgba(232,93,58,0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                  <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                  <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                  <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                {/* Label */}
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#E85D3A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  Sense
                  {!aiDone && (
                    <span style={{ display: "inline-flex", gap: "3px" }}>
                      <span className="typing-dot" style={{ animationDelay: "0s" }} />
                      <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                      <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                    </span>
                  )}
                </div>

                {/* Text bubble */}
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "4px 16px 16px 16px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--ink2)",
                    lineHeight: 1.7,
                    minHeight: "60px",
                  }}
                >
                  {aiText}
                  {!aiDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "16px",
                        background: "#E85D3A",
                        marginLeft: "2px",
                        verticalAlign: "text-bottom",
                        animation: "blink 1s step-end infinite",
                      }}
                    />
                  )}
                </div>

                {/* Chart / Data — slides in after typing */}
                <div
                  style={{
                    marginTop: "10px",
                    opacity: showChart ? 1 : 0,
                    transform: showChart ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                    ...(showChart ? {} : { pointerEvents: "none" as const }),
                  }}
                >
                  {/* REVENUE — Calls I missed yesterday */}
                  {topic === "revenue" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* KPI row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--glass-bg)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
                        {missedCallKpis.map((k) => (
                          <div key={k.label} style={{ background: "var(--surface)", padding: "12px 16px" }}>
                            <div style={{ fontSize: "10px", color: "var(--ink2)", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                            <div style={{ fontSize: "22px", fontWeight: 700, color: k.accent || "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sorted table — missed calls by urgency */}
                      <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "70px 150px 1fr 80px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span>Time</span><span>Caller</span><span>Reason</span><span style={{ textAlign: "right" }}>Value</span>
                        </div>
                        {missedCallRows.map((r, i) => (
                          <div
                            key={i}
                            style={{
                              display: "grid", gridTemplateColumns: "70px 150px 1fr 80px", padding: "10px 16px", gap: "8px",
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                              opacity: 0, animation: showChart ? `fadeUp 0.4s ${0.1 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                            }}
                          >
                            <span style={{ color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.time}</span>
                            <span style={{ color: "var(--ink)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                              {r.urgent && (
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.7)", flexShrink: 0 }} />
                              )}
                              {r.caller}
                            </span>
                            <span style={{ color: "var(--ink2)", fontSize: "12px" }}>{r.reason}</span>
                            <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
                          </div>
                        ))}
                        <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--ink2)", fontWeight: 500 }}>
                          + {missedCallMore} more
                        </div>
                      </div>

                      {/* Insight callout */}
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#FCA5A5", lineHeight: 1.55 }}>
                        <span style={{ fontSize: "16px", lineHeight: 1.2 }}>⚠️</span>
                        <span>
                          <strong>The storm caller is the priority.</strong> Same zip code as Tuesday&apos;s hail report and they&apos;re calling a competitor next if no one picks up.
                        </span>
                      </div>

                      {/* Action button */}
                      <div style={{ display: "flex" }}>
                        <button
                          type="button"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #E85D3A, #C4472A)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 24px rgba(232,93,58,0.32), 0 2px 6px rgba(0,0,0,0.18)",
                            transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s",
                          }}
                          onClick={() => handleDeploy("revenue")}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          <Sparkles style={{ width: 14, height: 14 }} />
                          Deploy CSR Agent
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PERFORMANCE — Aging supplements by carrier */}
                  {topic === "performance" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Chart + table side-by-side */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "stretch" }}>
                        {/* Horizontal bar — $ pending by carrier */}
                        <div style={{ ...cardStyle, boxShadow: "none", position: "relative", overflow: "hidden" }}>
                          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>$ pending by carrier</div>
                          <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "20px" }}>Outstanding supplement value across carriers</div>
                          <div style={{ height: "140px" }}><Bar data={carrierAgingChart} options={carrierChartOpts as any} /></div>
                        </div>

                        {/* Table — carrier rows */}
                        <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            <span>Carrier</span><span style={{ textAlign: "right" }}>Pending</span><span style={{ textAlign: "right" }}>Days aging</span>
                          </div>
                          {carrierAgingRows.map((r, i) => (
                            <div
                              key={r.carrier}
                              style={{
                                display: "grid", gridTemplateColumns: "1fr 110px 90px", padding: "10px 16px",
                                borderBottom: i < carrierAgingRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                                opacity: 0, animation: showChart ? `fadeUp 0.4s ${0.1 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                              }}
                            >
                              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.carrier}</span>
                              <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>${r.pending.toLocaleString()}</span>
                              <span style={{ textAlign: "right", color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.days} days</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insight callout */}
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#FCA5A5", lineHeight: 1.55 }}>
                        <span style={{ fontSize: "16px", lineHeight: 1.2 }}>⚠️</span>
                        <span>
                          <strong>State Farm is the biggest exposure.</strong> 3 of the 7 claims sit with one adjuster.
                        </span>
                      </div>

                      {/* Action button */}
                      <div style={{ display: "flex" }}>
                        <button
                          type="button"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #E85D3A, #C4472A)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 24px rgba(232,93,58,0.32), 0 2px 6px rgba(0,0,0,0.18)",
                            transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s",
                          }}
                          onClick={() => handleDeploy("performance")}
                          onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                          onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          <Sparkles style={{ width: 14, height: 14 }} />
                          Deploy Collections Agent
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SLA */}
                  {topic === "sla" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* KPI row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--glass-bg)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
                        {estimateKpis.map((k) => (
                          <div key={k.label} style={{ background: "var(--surface)", padding: "12px 16px" }}>
                            <div style={{ fontSize: "10px", color: "var(--ink2)", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                            <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sorted table */}
                      <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 100px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span>Estimate</span><span style={{ textAlign: "right" }}>Value</span><span style={{ textAlign: "right" }}>Days aging</span>
                        </div>
                        {estimateRows.map((r, i) => (
                          <div
                            key={r.name}
                            style={{
                              display: "grid", gridTemplateColumns: "1fr 110px 100px", padding: "10px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                              opacity: 0, animation: showChart ? `fadeUp 0.4s ${0.1 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                            }}
                          >
                            <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.name}</span>
                            <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>${r.value.toLocaleString()}</span>
                            <span style={{ textAlign: "right", color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.days} days</span>
                          </div>
                        ))}
                        <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--ink2)", fontWeight: 500 }}>
                          + {estimateMore} more
                        </div>
                      </div>

                      {/* Insight callout */}
                      <div style={{ background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.22)", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "rgba(255,196,170,0.95)", lineHeight: 1.55 }}>
                        <span style={{ fontSize: "16px", lineHeight: 1.2 }}>💡</span>
                        <span>
                          Estimates this size close <strong>3× more often</strong> when re-engaged in the first 2 weeks.
                        </span>
                      </div>

                      {/* Action button */}
                      <div style={{ display: "flex" }}>
                        <button
                          type="button"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: "linear-gradient(135deg, #E85D3A, #C4472A)",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 24px rgba(232,93,58,0.32), 0 2px 6px rgba(0,0,0,0.18)",
                            transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s",
                          }}
                          onClick={() => handleDeploy("sla")}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          <Sparkles style={{ width: 14, height: 14 }} />
                          Deploy Sales Coach Agent
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!topic && (
          <div style={{ color: "var(--ink3)", fontSize: "16px", padding: "60px 0", textAlign: "center" }}>
            Select a question above to see the analysis
          </div>
        )}

        </div>
        </div>
      </div>

      {/* Act overlay — shows when view === "act" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: isActive("act") ? 1 : 0,
          transform: `translateY(${offsetFor("act")}%)`,
          pointerEvents: view === "act" ? "auto" : "none",
          transition: slideTransition,
        }}
      >
        <div style={{ width: "min(1240px, 94vw)", height: "min(868px, 65.8vw)", maxHeight: "88vh", position: "relative" }}>
        <div style={{ position: "absolute", top: "9.82%", left: "1.25%", right: "1.25%", bottom: "3.57%", overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center", gap: "8px" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.25, color: "var(--ink)", marginBottom: "6px", marginTop: 0 }}>
            Act.
          </h2>
          <p style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: "var(--ink2)", lineHeight: 1.5, maxWidth: "560px", margin: "0 0 18px 0", fontWeight: 400 }}>
            {ACT_VARIANTS[deployedTopic].agent.tagline}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {/* Agent + steps */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px", boxShadow: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #2A1810, #1a0e08)",
                    border: "1px solid rgba(232,93,58,0.35)",
                    boxShadow: "0 4px 14px -4px rgba(232,93,58,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <Image
                    src="/assets/agent-casey.png"
                    alt={`${ACT_VARIANTS[deployedTopic].agent.name} portrait`}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>{ACT_VARIANTS[deployedTopic].agent.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--ink3)" }}>{ACT_VARIANTS[deployedTopic].agent.role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                  <span style={{ fontSize: "10px", color: "#4ADE80" }}>{ACT_VARIANTS[deployedTopic].agent.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "14px" }}>
                {ACT_VARIANTS[deployedTopic].capabilities.map((tag) => (
                  <span key={tag} style={{ background: "var(--glass-bg)", border: "1px solid var(--card-border)", borderRadius: "5px", padding: "2px 8px", fontSize: "10px", color: "var(--ink2)" }}>{tag}</span>
                ))}
              </div>
              {ACT_VARIANTS[deployedTopic].steps.map((label, i) => {
                const done = actCompleted.includes(i);
                const active = actActive === i && !done;
                return (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", opacity: actActive >= i ? 1 : 0.3, transition: "opacity 0.4s", marginBottom: "8px" }}>
                    <div style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "1px" }}>
                      {done ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: "var(--green)" }} />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#E85D3A" }} />
                      ) : (
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1.5px solid #3F3F46" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: done ? "#A1A1AA" : active ? "#FAFAFA" : "#52525B" }}>{label}</div>
                  </div>
                );
              })}
            </div>

            {/* Activity feed */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px", boxShadow: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                <span style={{ fontSize: "10px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ACT_VARIANTS[deployedTopic].agent.name} · Live activity</span>
              </div>
              {ACT_VARIANTS[deployedTopic].log.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "8px" : 0, paddingBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "8px" : 0, borderBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ marginTop: "2px", flexShrink: 0, color: entry.icon === "call" ? "#60a5fa" : entry.icon === "text" ? "#34d399" : "#a78bfa" }}>
                    {entry.icon === "call" ? <Phone className="w-3 h-3" /> : entry.icon === "text" ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                  </div>
                  <div style={{ flex: 1, fontSize: "12px", color: "var(--ink)" }}>{entry.text}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink3)", whiteSpace: "nowrap", marginTop: "2px" }}>{entry.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recap */}
          <div style={{ marginTop: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {ACT_VARIANTS[deployedTopic].recap.map((r) => (
                <div key={r.label} style={{ background: "rgba(34,197,94,0.06)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--green)", letterSpacing: "-0.02em" }}>{r.value}</div>
                  <div style={{ fontSize: "10px", color: "#86EFAC", marginTop: "2px" }}>{r.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "11px", color: "var(--ink3)", marginTop: "10px", textAlign: "center" }}>
              {ACT_VARIANTS[deployedTopic].caption}
            </div>
          </div>
        </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .typing-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #E85D3A;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      ` }} />
    </section>
  );
}
