"use client";

import { useEffect, useRef } from "react";

export default function AnalyzeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsap: any, ScrollTrigger: any;
    (async () => {
      const g = await import("gsap");
      const st = await import("gsap/ScrollTrigger");
      gsap = g.default;
      ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Word fade in
        if (wordRef.current) {
          gsap.fromTo(
            wordRef.current,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: wordRef.current,
                start: "top 80%",
                end: "top 40%",
                scrub: false,
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Chat bubbles stagger
        if (contentRef.current) {
          const items = contentRef.current.querySelectorAll(".chat-item");
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.2,
              scrollTrigger: {
                trigger: contentRef.current,
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
        position: "relative",
      }}
    >
      {/* Divider */}
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
          Analyze.
        </div>

        {/* Chat conversation */}
        <div ref={contentRef} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px" }}>

          {/* User bubble */}
          <div className="chat-item" style={{ display: "flex", justifyContent: "flex-end", opacity: 0 }}>
            <div
              style={{
                background: "#18181B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px 14px 4px 14px",
                padding: "12px 18px",
                fontSize: "15px",
                color: "#FAFAFA",
                maxWidth: "380px",
              }}
            >
              Show me my overdue invoices
            </div>
          </div>

          {/* AI response */}
          <div className="chat-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: 0 }}>
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
              {/* Sense 4-square logo */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "4px 14px 14px 14px",
                  padding: "14px 18px",
                  fontSize: "14px",
                  color: "#A1A1AA",
                  lineHeight: 1.7,
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#FAFAFA", fontWeight: 500 }}>Your DSO is trending at 72 days</span> — well above the 45-day industry average. I found{" "}
                <span style={{ color: "#E85D3A", fontWeight: 500 }}>14 overdue invoices</span> totaling{" "}
                <span style={{ color: "#FAFAFA", fontWeight: 500 }}>$127,400</span> that need immediate attention. The largest concentration is in commercial accounts aged 60–90 days.
              </div>

              {/* Chart card */}
              <div
                style={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#52525B",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "16px",
                  }}
                >
                  Days Sales Outstanding (DSO)
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  {[
                    { label: "Current DSO", value: "72 days", color: "#EF4444" },
                    { label: "Industry Avg", value: "45 days", color: "#22C55E" },
                    { label: "Overdue Amount", value: "$127,400", color: "#FAFAFA" },
                    { label: "Overdue Invoices", value: "14", color: "#FAFAFA" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "10px",
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#52525B", marginBottom: "4px" }}>{s.label}</div>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simple bar chart visual */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
                  {[35, 40, 38, 45, 48, 52, 58, 62, 65, 68, 70, 72].map((v, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${(v / 80) * 100}%`,
                        background: i === 11
                          ? "rgba(232,93,58,0.8)"
                          : i > 7
                          ? "rgba(232,93,58,0.4)"
                          : "rgba(255,255,255,0.1)",
                        borderRadius: "3px 3px 0 0",
                        transition: "height 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", color: "#3F3F46" }}>Jan</span>
                  <span style={{ fontSize: "10px", color: "#3F3F46" }}>Dec</span>
                </div>
              </div>

              {/* Warning bar */}
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#FCA5A5",
                }}
              >
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <span>DSO increased <strong>60%</strong> in the last 6 months — intervention recommended</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
