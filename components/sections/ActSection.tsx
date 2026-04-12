"use client";

import { useEffect, useRef } from "react";

const CALL_LOG = [
  { time: "10:32 AM", type: "call", desc: "Called Marcus Ortiz · Left voicemail re: INV-2847", status: "done" },
  { time: "10:45 AM", type: "email", desc: "Sent payment reminder to Apex Facilities · $14,400", status: "done" },
  { time: "11:02 AM", type: "call", desc: "Connected with Sarah Chen · $8,200 — Committed to pay by Friday", status: "success" },
  { time: "11:18 AM", type: "email", desc: "Escalation email sent to Horizon Group · 90-day balance", status: "done" },
  { time: "11:34 AM", type: "call", desc: "Ridge Corp opened email · Follow-up scheduled in 2 days", status: "pending" },
];

export default function ActSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const g = await import("gsap");
      const st = await import("gsap/ScrollTrigger");
      const gsap = g.default;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (wordRef.current) {
          gsap.fromTo(
            wordRef.current,
            { opacity: 0, y: 60 },
            {
              opacity: 1, y: 0, duration: 1, ease: "power3.out",
              scrollTrigger: {
                trigger: wordRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll(".act-card");
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 75%",
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
        padding: "120px 24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto 80px" }}>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Large word */}
        <div
          ref={wordRef}
          style={{
            fontSize: "clamp(80px, 14vw, 180px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            color: "#FAFAFA",
            marginBottom: "80px",
            opacity: 0,
          }}
        >
          Act.
        </div>

        <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Agent card */}
          <div
            className="act-card"
            style={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "24px",
              opacity: 0,
            }}
          >
            {/* Agent header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1E3A5F, #0F2040)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#FAFAFA" }}>Ryan</div>
                <div style={{ fontSize: "12px", color: "#52525B" }}>Collection Assistant · Automates follow-ups</div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {["Invoice tracking", "Follow-ups", "DSO reduction"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(232,93,58,0.1)",
                    border: "1px solid rgba(232,93,58,0.2)",
                    borderRadius: "100px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    color: "#E85D3A",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Features */}
            <div style={{ marginBottom: "16px" }}>
              {[
                "Calls & emails overdue clients automatically",
                "Tracks promises and escalates when needed",
                "Works 24/7 — no manual follow-up required",
              ].map((f) => (
                <div key={f} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{ color: "#22C55E", marginTop: "1px", flexShrink: 0, fontSize: "13px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "#A1A1AA" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "20px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              {[
                { label: "DSO", before: "87 days", after: "44 days", good: true },
                { label: "Cash in", before: "$38K", after: "$84K", good: true },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: "10px", color: "#52525B", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#52525B", textDecoration: "line-through" }}>{m.before}</span>
                    <span style={{ fontSize: "13px", color: "#E85D3A" }}>→</span>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#22C55E" }}>{m.after}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              style={{
                width: "100%",
                background: "#E85D3A",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(232,93,58,0.3)",
              }}
            >
              Run Agent
            </button>
          </div>

          {/* Right column: Call log + Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Call log card */}
            <div
              className="act-card"
              style={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px",
                flex: 1,
                opacity: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22C55E",
                    boxShadow: "0 0 6px #22C55E",
                    animation: "blink 2s ease-in-out infinite",
                  }}
                />
                <span style={{ fontSize: "12px", color: "#52525B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Ryan · Live Activity
                </span>
              </div>

              {CALL_LOG.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: i < CALL_LOG.length - 1 ? "12px" : 0,
                    paddingBottom: i < CALL_LOG.length - 1 ? "12px" : 0,
                    borderBottom: i < CALL_LOG.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {entry.type === "call" ? "📞" : "✉️"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", color: "#A1A1AA", lineHeight: 1.4 }}>{entry.desc}</div>
                    <div style={{ fontSize: "10px", color: "#3F3F46", marginTop: "2px" }}>{entry.time}</div>
                  </div>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: entry.status === "success" ? "#22C55E" : entry.status === "pending" ? "#F59E0B" : "#3F3F46",
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Results card */}
            <div
              className="act-card"
              style={{
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "16px",
                padding: "20px",
                opacity: 0,
              }}
            >
              <div style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Today's Results
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "#4ADE80", letterSpacing: "-0.03em" }}>$14,400</span>
                  <span style={{ fontSize: "13px", color: "#86EFAC" }}>committed</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "22px", fontWeight: 600, color: "#22C55E", letterSpacing: "-0.03em" }}>$9,800</span>
                  <span style={{ fontSize: "13px", color: "#86EFAC" }}>email opened</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
