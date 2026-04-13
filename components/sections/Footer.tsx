"use client";

const LINKS = {
  Product: ["Features", "Radar", "Agents", "Integrations"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Security"],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "80px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "64px",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E85D3A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(232,93,58,0.3)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <rect x="3" y="3" width="15" height="15" rx="3" fill="white" />
                  <rect x="22" y="3" width="15" height="15" rx="3" fill="white" fillOpacity="0.65" />
                  <rect x="3" y="22" width="15" height="15" rx="3" fill="white" fillOpacity="0.65" />
                  <rect x="22" y="22" width="15" height="15" rx="3" fill="white" fillOpacity="0.35" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                  Zuper Sense
                </div>
                <div style={{ fontSize: "11px", color: "var(--ink3)" }}>Intelligence Layer</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--ink3)", lineHeight: 1.7, maxWidth: "240px", marginBottom: "24px" }}>
              The AI that understands your field service business — and acts on it.
            </p>
            <button
              style={{
                background: "#E85D3A",
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(232,93,58,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              Get early access
            </button>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--ink3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "16px",
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "var(--ink3)",
                    marginBottom: "10px",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#A1A1AA")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#52525B")}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--ink3)" }}>
            © 2025 Zuper Inc. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  fontSize: "12px",
                  color: "var(--ink3)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#71717A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3F3F46")}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
