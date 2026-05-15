"use client";

import { Star, CloudLightning } from "lucide-react";

type IntelCard = {
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
  title: string;
  body: string;
  signal: string;
};

const CARDS: IntelCard[] = [
  {
    icon: <Star className="w-5 h-5" />,
    accent: "#A78BFA",
    accentBg: "rgba(167,139,250,0.14)",
    title: "Reputation Intel",
    body: "Watches your Google reviews and ratings. Watches your competitors’ too, across the same territory. When a competitor’s rating slips, Sense sees the opportunity before you would. When your own reviews flag an issue, it surfaces before the pattern hardens.",
    signal:
      "Competitor ABC Roofing’s rating fell from 4.4 to 3.9 this month. 8 negative reviews cite response time. Their service area overlaps 60% with your North Territory.",
  },
  {
    icon: <CloudLightning className="w-5 h-5" />,
    accent: "#60A5FA",
    accentBg: "rgba(96,165,250,0.14)",
    title: "Weather Intel",
    body: "Connects Sense to real-time storm tracking. Cross-references severe weather against your territory, your crew capacity, and your historical demand patterns. You see incoming demand before it lands on your phone as a missed call.",
    signal:
      "Severe hailstorm predicted for North Territory in 18–24 hours. Projected impact: 300–400 leads worth $4.5M–$6M in pipeline. Current crew capacity: 12 jobs per day.",
  },
];

export default function IntelligenceSection() {
  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "120px 24px 100px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(232,93,58,0.10)",
              border: "1px solid rgba(232,93,58,0.30)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#E85D3A",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            Intelligence Packages
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4.4vw, 56px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 auto 14px",
              maxWidth: "780px",
              color: "var(--ink)",
            }}
          >
            Sense watches beyond your own business.
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 1.4vw, 18px)",
              lineHeight: 1.55,
              color: "var(--ink2)",
              maxWidth: "620px",
              margin: "0 auto",
              fontWeight: 450,
            }}
          >
            The biggest swings in your business usually start outside it.
          </p>
        </div>

        {/* Two-card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
          className="intelligence-grid"
        >
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="card-depth"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "18px",
                padding: "28px 28px 26px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Header — eyebrow + icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink3)",
                  }}
                >
                  Intelligence Package
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: card.accentBg,
                    border: `1px solid ${card.accent}33`,
                    color: card.accent,
                  }}
                >
                  {card.icon}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {card.title}
              </h3>

              {/* Body copy */}
              <p
                style={{
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  color: "var(--ink2)",
                  margin: 0,
                  fontWeight: 450,
                }}
              >
                {card.body}
              </p>

              {/* Sense Signal callout */}
              <div
                style={{
                  marginTop: "auto",
                  padding: "16px 18px",
                  borderRadius: "12px",
                  background: "var(--glass-bg)",
                  border: `1px solid ${card.accent}33`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: card.accent,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: card.accent,
                      boxShadow: `0 0 0 3px ${card.accent}26, 0 0 8px ${card.accent}80`,
                    }}
                  />
                  Sense Signal
                </span>
                <p
                  style={{
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    color: "var(--ink)",
                    margin: 0,
                    fontWeight: 450,
                  }}
                >
                  {card.signal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          .intelligence-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
