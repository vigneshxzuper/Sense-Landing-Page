"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Phone, Mail, Zap, TrendingDown, ArrowRight } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const STEPS = [
  { label: "Analyzing job history...", delay: 0 },
  { label: "Identifying at-risk customers...", delay: 800 },
  { label: "Drafting follow-up messages...", delay: 1600 },
  { label: "Rescheduling 3 jobs...", delay: 2400 },
  { label: "Notifying dispatcher...", delay: 3200 },
];

const LOG_ITEMS = [
  { icon: "call", text: "Called Premier Properties", detail: "Invoice #INV-2847 ($14,400) — Payment committed by Friday", time: "2 min ago", status: "success" },
  { icon: "email", text: "Sent reminder to Sunrise HVAC", detail: "Invoice #INV-2901 ($9,800) — Email opened ✓", time: "5 min ago", status: "done" },
  { icon: "call", text: "Called GreenLeaf Realty", detail: "Left voicemail · Follow-up scheduled for Tuesday", time: "8 min ago", status: "pending" },
  { icon: "email", text: "Auto-sent reminders to 4 other clients", detail: "$18,200 total · Delivery confirmed", time: "12 min ago", status: "done" },
];

export default function ActSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [showLog, setShowLog] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Auto-trigger on scroll
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

  // Run stepper sequence
  useEffect(() => {
    if (!started) return;
    STEPS.forEach((step, i) => {
      setTimeout(() => setActiveStep(i), step.delay);
      setTimeout(() => setCompletedSteps((prev) => [...prev, i]), step.delay + 700);
    });
    // After all steps, show log
    setTimeout(() => setShowLog(true), 4200);
    // Stagger log items
    LOG_ITEMS.forEach((_, i) => {
      setTimeout(() => setVisibleLogs(i + 1), 4600 + i * 400);
    });
    // Show result
    setTimeout(() => setShowResult(true), 6400);
  }, [started]);

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--card-border)",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "var(--card-shadow)",
  };

  return (
    <section id="act-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "120px 24px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto 60px" }}>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <ScrollFloat as="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--ink)", marginBottom: "12px" }}>
          Act.
        </ScrollFloat>
        <ScrollFloat as="p" style={{ fontSize: "17px", color: "var(--ink2)", maxWidth: "500px", lineHeight: 1.6, marginBottom: "60px" }}>
          It doesn't just tell you. It does it.
        </ScrollFloat>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* LEFT: Agent + Stepper */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Agent card */}
            <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(232,93,58,0.04) 0%, var(--surface) 70%)", border: "1px solid var(--card-border)", boxShadow: "0 6px 22px -16px rgba(232,93,58,0.3), var(--card-shadow)", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #E85D3A, #C4472A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(232,93,58,0.25)" }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>Ryan</div>
                  <div style={{ fontSize: "12px", color: "var(--ink3)" }}>Collection Assistant</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: started ? "#22C55E" : "#3F3F46", boxShadow: started ? "0 0 8px #22C55E" : "none", animation: started ? "blink 2s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: "11px", color: started ? "#4ADE80" : "#3F3F46" }}>{started ? "Running" : "Idle"}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                {["Invoice tracking", "Follow-ups", "DSO reduction"].map((tag) => (
                  <span key={tag} style={{ background: "var(--glass-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "3px 10px", fontSize: "11px", color: "var(--ink2)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stepper */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {STEPS.map((step, i) => {
                  const done = completedSteps.includes(i);
                  const active = activeStep === i && !done;
                  return (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: activeStep >= i ? 1 : 0.3, transition: "opacity 0.4s" }}>
                      {/* Vertical line + icon */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                        {done ? (
                          <CheckCircle2 className="w-[18px] h-[18px]" style={{ color: "var(--green)", flexShrink: 0 }} />
                        ) : active ? (
                          <Loader2 className="w-[18px] h-[18px] animate-spin" style={{ color: "#E85D3A", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #3F3F46" }} />
                        )}
                        {i < STEPS.length - 1 && (
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

            {/* Metrics card */}
            <div style={{ ...cardStyle, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", padding: 0, overflow: "hidden", background: "var(--glass-bg)", border: "1px solid var(--card-border)", boxShadow: "0 6px 22px -16px rgba(34,197,94,0.25), var(--card-shadow)", position: "relative" }}>
              {[
                { label: "DSO Target", before: "87 days", after: "44 days" },
                { label: "Monthly Cash", before: "$38K", after: "$84K" },
              ].map((m) => (
                <div key={m.label} style={{ background: "linear-gradient(160deg, rgba(34,197,94,0.03), var(--surface) 70%)", padding: "16px" }}>
                  <div style={{ fontSize: "10px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{m.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--ink3)", textDecoration: "line-through" }}>{m.before}</span>
                    <ArrowRight className="w-3 h-3 text-[#E85D3A]" />
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--green)" }}>{m.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live log + Result */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Call log */}
            <div style={{ ...cardStyle, background: "linear-gradient(160deg, rgba(96,165,250,0.03) 0%, var(--surface) 70%)", border: "1px solid var(--card-border)", boxShadow: "0 6px 22px -16px rgba(96,165,250,0.25), var(--card-shadow)", position: "relative", overflow: "hidden", flex: 1, opacity: showLog ? 1 : 0, transform: showLog ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E", animation: "blink 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "11px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ryan · Live Activity</span>
              </div>

              {LOG_ITEMS.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: i < LOG_ITEMS.length - 1 ? "10px" : 0,
                    paddingBottom: i < LOG_ITEMS.length - 1 ? "10px" : 0,
                    borderBottom: i < LOG_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    opacity: i < visibleLogs ? 1 : 0,
                    transform: i < visibleLogs ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div style={{ marginTop: "2px", flexShrink: 0, color: entry.icon === "call" ? "#60a5fa" : "#a78bfa" }}>
                    {entry.icon === "call" ? <Phone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{entry.text}</div>
                    <div style={{ fontSize: "11px", color: "var(--ink3)", marginTop: "2px" }}>{entry.detail}</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--ink3)", whiteSpace: "nowrap", marginTop: "2px" }}>{entry.time}</div>
                </div>
              ))}
            </div>

            {/* Result card */}
            <div
              style={{
                background: "linear-gradient(160deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.015) 100%)",
                border: "1px solid rgba(34,197,94,0.18)",
                borderRadius: "14px",
                padding: "20px",
                opacity: showResult ? 1 : 0,
                transform: showResult ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
                transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: "0 8px 28px -16px rgba(34,197,94,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>Collection Complete</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[
                  { value: "$14,400", label: "committed" },
                  { value: "$9,800", label: "opened" },
                  { value: "$42,200", label: "in progress" },
                ].map((r) => (
                  <div key={r.label} style={{ background: "rgba(34,197,94,0.06)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--green)", letterSpacing: "-0.02em" }}>{r.value}</div>
                    <div style={{ fontSize: "11px", color: "#86EFAC", marginTop: "2px" }}>{r.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink3)", marginTop: "12px", textAlign: "center" }}>
                Ryan contacted 8 clients in the past 12 minutes · Projected DSO: <span style={{ color: "var(--green)", fontWeight: 600 }}>87 → 44 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
