"use client";

import { useEffect, useRef, useState } from "react";

const TABS = ["Jobs", "Payments", "Contacts", "Teams", "Reports", "Assets"];

const TAB_CONTENT: Record<string, { prompt: string; response: string; stat: string; statLabel: string }> = {
  Jobs: {
    prompt: "How many jobs are behind SLA this week?",
    response: "23 jobs are currently behind SLA. The biggest contributor is the HVAC service category with 11 jobs, mostly in the downtown district. Average delay is 4.2 hours. I recommend reassigning 6 jobs from Marcus's queue — he's at 142% capacity.",
    stat: "23",
    statLabel: "Behind SLA",
  },
  Payments: {
    prompt: "What's our outstanding balance today?",
    response: "Total outstanding balance is $218,400 across 47 invoices. $127,400 is overdue by more than 30 days. Your top 3 clients account for 68% of the overdue amount. Ryan can start collections immediately.",
    stat: "$218K",
    statLabel: "Outstanding",
  },
  Contacts: {
    prompt: "Which clients haven't been contacted in 60+ days?",
    response: "14 clients haven't had any touchpoint in 60+ days. 5 of them have open jobs with you. Sending a re-engagement sequence to these contacts could recover an estimated $32K in pipeline.",
    stat: "14",
    statLabel: "Dormant clients",
  },
  Teams: {
    prompt: "Who is overloaded this week?",
    response: "Marcus Ortiz is at 142% capacity with 18 open jobs. Sarah Chen is at 95%. Recommend moving 4 jobs from Marcus to the Tuesday slot — this brings both techs to balanced load with no SLA risk.",
    stat: "142%",
    statLabel: "Over capacity",
  },
  Reports: {
    prompt: "Summarize last month's performance",
    response: "Last month: Revenue up 14.2% to $218K. Job completion rate 91.4%. SLA compliance 87% — down 3pts from prior month. Top performing tech: Sarah Chen at 98% customer satisfaction. DSO improved from 78 to 72 days.",
    stat: "+14.2%",
    statLabel: "Revenue MoM",
  },
  Assets: {
    prompt: "Which assets are due for maintenance?",
    response: "12 assets are overdue for scheduled maintenance. 3 are flagged as critical — HVAC units at Apex Facilities that are 45 days past service window. Scheduling these now prevents an estimated $8K in emergency repairs.",
    stat: "12",
    statLabel: "Overdue assets",
  },
};

export default function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState("Jobs");
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const g = await import("gsap");
      const st = await import("gsap/ScrollTrigger");
      const gsap = g.default;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (headRef.current) {
          gsap.fromTo(
            headRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
              scrollTrigger: {
                trigger: headRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    })();
  }, []);

  const content = TAB_CONTENT[activeTab];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#09090B",
        padding: "140px 24px 120px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto 80px" }}>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div ref={headRef} style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(232,93,58,0.08)",
              border: "1px solid rgba(232,93,58,0.2)",
              borderRadius: "100px",
              padding: "6px 14px",
              fontSize: "12px",
              color: "#E85D3A",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Anywhere in Zuper
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 5.5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#FAFAFA",
              marginBottom: "12px",
            }}
          >
            Entire Zuper inside a{" "}
            <span style={{ color: "#E85D3A", fontStyle: "italic" }}>prompt box.</span>
          </h2>
          <p style={{ fontSize: "17px", color: "#52525B", maxWidth: "520px", lineHeight: 1.6 }}>
            Ask anything, from anywhere in Zuper.
          </p>
        </div>

        {/* Tab buttons */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#E85D3A" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeTab === tab ? "#E85D3A" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "100px",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#fff" : "#71717A",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab ? "0 0 16px rgba(232,93,58,0.3)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div
          key={activeTab}
          style={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            animation: "fadeUp 0.3s ease forwards",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "#E85D3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3" />
              </svg>
            </div>
            <span style={{ fontSize: "13px", color: "#71717A" }}>Sense · {activeTab}</span>
          </div>

          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "start" }}>
            <div>
              {/* User prompt */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                  <div
                    style={{
                      background: "#18181B",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px 12px 3px 12px",
                      padding: "10px 16px",
                      fontSize: "14px",
                      color: "#FAFAFA",
                      maxWidth: "420px",
                    }}
                  >
                    {content.prompt}
                  </div>
                </div>

                {/* AI response */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #E85D3A, #C4472A)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3" />
                    </svg>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "3px 12px 12px 12px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#A1A1AA",
                      lineHeight: 1.7,
                    }}
                  >
                    {content.response}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat card */}
            <div
              style={{
                background: "rgba(232,93,58,0.06)",
                border: "1px solid rgba(232,93,58,0.15)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#E85D3A",
                  letterSpacing: "-0.04em",
                  marginBottom: "4px",
                }}
              >
                {content.stat}
              </div>
              <div style={{ fontSize: "11px", color: "#71717A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {content.statLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
