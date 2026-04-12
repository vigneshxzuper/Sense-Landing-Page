"use client";

import { useEffect, useRef } from "react";

export default function RadarSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);

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
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
              scrollTrigger: {
                trigger: headRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
        if (laptopRef.current) {
          gsap.fromTo(
            laptopRef.current,
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
              scrollTrigger: {
                trigger: laptopRef.current,
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

  const insightCards = [
    { label: "Stuck Quotes", value: "$84K", delta: "+12 this week", color: "#F59E0B" },
    { label: "Jobs Behind SLA", value: "23", delta: "4 critical", color: "#EF4444" },
    { label: "Pending Invoices", value: "$42.6K", delta: "18 invoices", color: "#E85D3A" },
  ];

  const invoices = [
    { name: "Apex Facilities", amount: "$14,400", age: "72d", risk: "high" },
    { name: "Ridge Corp", amount: "$9,800", age: "61d", risk: "high" },
    { name: "Metro HVAC", amount: "$7,200", age: "45d", risk: "mid" },
    { name: "Summit Eng.", amount: "$6,100", age: "38d", risk: "mid" },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#09090B",
        padding: "140px 24px 120px",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "64px" }}>
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
              marginBottom: "24px",
            }}
          >
            Radar
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#FAFAFA",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Have an eye on,{" "}
            <span style={{ color: "#E85D3A", fontStyle: "italic" }}>Everything Happening.</span>{" "}
            Everywhere. Now.
          </h2>
        </div>

        {/* Laptop Frame */}
        <div ref={laptopRef} style={{ opacity: 0 }}>
          {/* Screen bezel */}
          <div
            style={{
              background: "#1A1A1E",
              border: "2px solid #2A2A2E",
              borderRadius: "16px 16px 0 0",
              padding: "12px 12px 0",
              boxShadow: "0 -4px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
              position: "relative",
            }}
          >
            {/* Browser bar */}
            <div
              style={{
                background: "#111113",
                borderRadius: "8px 8px 0 0",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22C55E" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "5px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  color: "#3F3F46",
                  maxWidth: "300px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                app.zuper.com/sense/radar
              </div>
            </div>

            {/* Dashboard content */}
            <div
              style={{
                background: "#0D0D0F",
                padding: "20px",
                minHeight: "420px",
              }}
            >
              {/* Top nav inside dashboard */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "7px",
                      background: "#E85D3A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="white" />
                      <rect x="10" y="1" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                      <rect x="1" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6" />
                      <rect x="10" y="10" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#FAFAFA" }}>Sense Radar</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["Overview", "Jobs", "Finance", "Team"].map((t) => (
                    <div
                      key={t}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        color: t === "Finance" ? "#FAFAFA" : "#52525B",
                        background: t === "Finance" ? "rgba(255,255,255,0.08)" : "transparent",
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight cards row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                {insightCards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      background: "#111113",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "10px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontSize: "10px", color: "#52525B", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {card.label}
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: card.color, letterSpacing: "-0.03em", marginBottom: "2px" }}>
                      {card.value}
                    </div>
                    <div style={{ fontSize: "10px", color: "#3F3F46" }}>{card.delta}</div>
                  </div>
                ))}
              </div>

              {/* Bottom row: chart + invoices */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "10px" }}>
                {/* Revenue chart */}
                <div
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#52525B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Revenue MTD</div>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#FAFAFA", letterSpacing: "-0.03em" }}>$218,400</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#22C55E", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "6px" }}>
                      +14.2%
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
                    {[60, 75, 55, 80, 70, 90, 85, 95, 75, 88, 92, 100, 85, 95].map((v, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${v}%`,
                          background: i === 13 ? "#E85D3A" : "rgba(255,255,255,0.1)",
                          borderRadius: "2px 2px 0 0",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Overdue invoices */}
                <div
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    padding: "14px",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#52525B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                    Overdue Invoices
                  </div>
                  {invoices.map((inv) => (
                    <div
                      key={inv.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                        fontSize: "11px",
                      }}
                    >
                      <div>
                        <div style={{ color: "#A1A1AA" }}>{inv.name}</div>
                        <div style={{ color: "#3F3F46", fontSize: "10px" }}>{inv.age} overdue</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#FAFAFA", fontWeight: 600 }}>{inv.amount}</span>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: inv.risk === "high" ? "#EF4444" : "#F59E0B",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Laptop base */}
          <div
            style={{
              background: "linear-gradient(to bottom, #2A2A2E, #1A1A1E)",
              height: "24px",
              borderRadius: "0 0 4px 4px",
              border: "1px solid #2A2A2E",
              borderTop: "none",
            }}
          />
          <div
            style={{
              background: "#1A1A1E",
              height: "10px",
              borderRadius: "0 0 20px 20px",
              width: "80%",
              margin: "0 auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
