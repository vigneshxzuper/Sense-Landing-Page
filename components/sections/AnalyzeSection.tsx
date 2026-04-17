"use client";

import { useEffect, useRef, useState } from "react";
import { SenseChat } from "@/components/ui/sense-chat";
import ScrollFloat from "@/components/ScrollFloat";
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

type Topic = "performance" | "sla" | "revenue" | null;

/* ── TOPIC CONFIG ── */
const TOPIC_CONFIG = {
  revenue: {
    question: "Revenue this month",
    aiText: "I've analyzed your revenue data for this period. Monthly revenue is trending above target with strong growth in commercial accounts. Here's the full breakdown with expenses comparison and quarterly KPIs.",
  },
  performance: {
    question: "Team performance this week",
    aiText: "Looking at this week's team performance metrics, I can see CPU utilization peaked during business hours while memory usage remained relatively stable. The system handled load well with no critical thresholds breached.",
  },
  sla: {
    question: "Why are SLAs slipping?",
    aiText: "I've identified the root cause of your SLA issues. Three out of five recent jobs have breached their service level agreements, primarily in commercial HVAC and electrical categories. The average overrun is 2.4 hours.",
  },
};

/* ── CHART DATA ── */
const revenueChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { label: "Revenue", data: [3800, 2900, 4800, 2700, 2000, 2200], backgroundColor: "rgba(94,234,212,0.8)", borderRadius: 4, barPercentage: 0.6 },
    { label: "Expenses", data: [2300, 1200, 3100, 3500, 4700, 3600], backgroundColor: "rgba(251,113,133,0.8)", borderRadius: 4, barPercentage: 0.6 },
  ],
};
const perfChartData = {
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  datasets: [
    { label: "CPU %", data: [45, 32, 65, 92, 75, 55], borderColor: "#4ade80", pointBackgroundColor: "#fff", pointBorderColor: "#4ade80", pointBorderWidth: 2, pointRadius: 5, tension: 0.4, fill: false },
    { label: "Memory %", data: [62, 58, 68, 85, 78, 64], borderColor: "#fb7185", pointBackgroundColor: "#fff", pointBorderColor: "#fb7185", pointBorderWidth: 2, pointRadius: 5, tension: 0.4, fill: false },
  ],
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

const slaRows = [
  { id: "JOB-401", desc: "Premier Properties — HVAC Repair", sla: "4 hrs", actual: "6.2 hrs", status: "Breached", color: "#ef4444" },
  { id: "JOB-389", desc: "Sunrise HVAC — Annual Maintenance", sla: "8 hrs", actual: "9.1 hrs", status: "Breached", color: "#ef4444" },
  { id: "JOB-412", desc: "GreenLeaf Realty — Roof Inspection", sla: "24 hrs", actual: "22.5 hrs", status: "At Risk", color: "#f59e0b" },
  { id: "JOB-395", desc: "Lakeside Dental — Plumbing", sla: "4 hrs", actual: "3.8 hrs", status: "On Track", color: "#22c55e" },
  { id: "JOB-420", desc: "Metro School District — Electrical", sla: "8 hrs", actual: "11.4 hrs", status: "Breached", color: "#ef4444" },
];
const kpis = [
  { label: "REVENUE", value: "$847,300", change: "+12.4%", up: true },
  { label: "ACTIVE USERS", value: "25K", change: "+8.2%", up: true },
  { label: "CHURN RATE", value: "2.1%", change: "−0.8%", up: false },
  { label: "NPS SCORE", value: "72", change: "+5%", up: true },
];

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
export default function AnalyzeSection() {
  const [topic, setTopic] = useState<Topic>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const config = topic ? TOPIC_CONFIG[topic] : null;
  const { displayed: aiText, done: aiDone } = useTypewriter(config?.aiText || "", 18, showAiResponse);

  // Show chart once typing finishes
  useEffect(() => {
    if (aiDone) {
      const t = setTimeout(() => setShowChart(true), 400);
      return () => clearTimeout(t);
    }
  }, [aiDone]);

  const hasTriggered = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const triggerTopic = (t: Topic) => {
    setShowQuestion(false);
    setShowAiResponse(false);
    setShowChart(false);
    setTopic(t);
    setTimeout(() => setShowQuestion(true), 300);
    setTimeout(() => setShowAiResponse(true), 900);
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

  // Auto-trigger "revenue" when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          triggerTopic("revenue");
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
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
      {/* Ask — centered header + chat */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 0" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", width: "100%" }}>
          <div style={{ marginBottom: "48px" }}>
            <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "16px" }}>
              Ask.
            </ScrollFloat>
            <ScrollFloat as="p" style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#ffffff", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" }}>
              Type a question in plain English — Sense queries your data and answers instantly.
            </ScrollFloat>
          </div>

          <div>
            <SenseChat />
          </div>
        </div>
      </div>

      {/* Analyze — conversation + charts */}
      <div id="analyze-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "40px" }}>
          Analyze.
        </ScrollFloat>

        {/* Chat conversation */}
        {topic && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "760px" }}>

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
                    padding: "16px 20px",
                    fontSize: "14px",
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
                    marginTop: "16px",
                    opacity: showChart ? 1 : 0,
                    transform: showChart ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                    ...(showChart ? {} : { pointerEvents: "none" as const }),
                  }}
                >
                  {/* REVENUE */}
                  {topic === "revenue" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(94,234,212,0.07) 0%, var(--surface) 70%)", border: "1px solid rgba(94,234,212,0.22)", boxShadow: "0 14px 36px -14px rgba(94,234,212,0.3), var(--card-shadow)", position: "relative", overflow: "hidden" }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>Monthly Revenue</div>
                        <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "20px" }}>Revenue vs Expenses (2024)</div>
                        <div style={{ height: "280px" }}><Bar data={revenueChartData} options={chartOpts(6000) as any} /></div>
                      </div>
                      <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(232,93,58,0.07) 0%, var(--surface) 70%)", border: "1px solid rgba(232,93,58,0.22)", boxShadow: "0 14px 36px -14px rgba(232,93,58,0.3), var(--card-shadow)", position: "relative", overflow: "hidden" }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>Q4 Performance</div>
                        <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "16px" }}>October through December 2024</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--glass-bg)", borderRadius: "12px", overflow: "hidden" }}>
                          {kpis.map((k) => (
                            <div key={k.label} style={{ background: k.up ? "linear-gradient(160deg, rgba(34,197,94,0.08), var(--surface) 70%)" : "linear-gradient(160deg, rgba(239,68,68,0.08), var(--surface) 70%)", padding: "20px" }}>
                              <div style={{ fontSize: "10px", color: "var(--ink2)", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>{k.value}</span>
                                <span style={{ fontSize: "11px", fontWeight: 500, color: k.up ? "#22c55e" : "#ef4444", background: k.up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", padding: "2px 7px", borderRadius: "100px" }}>
                                  {!k.up && "↓ "}{k.change}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PERFORMANCE */}
                  {topic === "performance" && (
                    <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(74,222,128,0.07) 0%, var(--surface) 70%)", border: "1px solid rgba(74,222,128,0.22)", boxShadow: "0 14px 36px -14px rgba(74,222,128,0.3), var(--card-shadow)", position: "relative", overflow: "hidden" }}>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>System Performance</div>
                      <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "20px" }}>CPU and Memory usage over time</div>
                      <div style={{ height: "300px" }}><Line data={perfChartData} options={chartOpts(100) as any} /></div>
                    </div>
                  )}

                  {/* SLA */}
                  {topic === "sla" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ ...cardStyle, padding: 0, overflow: "hidden", background: "linear-gradient(160deg, rgba(239,68,68,0.07) 0%, var(--surface) 70%)", border: "1px solid rgba(239,68,68,0.22)", boxShadow: "0 14px 36px -14px rgba(239,68,68,0.3), var(--card-shadow)", position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 70px 70px 90px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span>Job ID</span><span>Description</span><span>SLA</span><span>Actual</span><span>Status</span>
                        </div>
                        {slaRows.map((r, i) => (
                          <div
                            key={r.id}
                            style={{
                              display: "grid", gridTemplateColumns: "90px 1fr 70px 70px 90px", padding: "14px 20px",
                              borderBottom: i < slaRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                              fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                              opacity: 0, animation: showChart ? `fadeUp 0.4s ${0.1 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                            }}
                          >
                            <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.id}</span>
                            <span style={{ color: "var(--ink2)", fontSize: "12px" }}>{r.desc}</span>
                            <span>{r.sla}</span>
                            <span>{r.actual}</span>
                            <span style={{ color: r.color, fontWeight: 500 }}>{r.status}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#FCA5A5" }}>
                        <span style={{ fontSize: "16px" }}>⚠️</span>
                        <span><strong>3 of 5 jobs</strong> breached SLA — avg overrun <strong>2.4 hours</strong></span>
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

      <style>{`
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
      `}</style>
    </section>
  );
}
