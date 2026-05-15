"use client";

type Column = { title: string; links: string[]; extra?: { title: string; links: string[] } };

const COLUMNS: Column[] = [
  {
    title: "Company",
    links: ["About Us", "Careers", "Contact Us", "Leadership", "Partners", "Press & Media", "Security & Compliance"],
  },
  {
    title: "Platform",
    links: ["All Features", "Integrations (60+)", "Mobile App", "Zuper Sense", "Zuper Glass", "Zuper Connect", "Zuper Fleet", "Zuper Pay"],
  },
  {
    title: "Industries",
    links: ["Roofing", "Cleaning", "HVAC", "Pool & Hot Tub", "Landscaping", "Manufacturing", "Maintenance", "Plumbing"],
  },
  {
    title: "Customer",
    links: ["Customer Login", "Help Center", "Onboarding"],
    extra: {
      title: "Developer",
      links: ["Developer Portal", "API Reference", "Status", "Developers' Help"],
    },
  },
  {
    title: "Resources",
    links: ["Blog", "Case Studies", "Customer Stories", "Free Tools", "eBooks", "Research", "Videos"],
  },
];

const LEGAL = ["Support", "Terms of Service", "Privacy Policy", "Compliance", "Google API Disclosure", "Sitemap"];

function ZuperLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
        <g>
          <path d="M4 4 L17 4 L13 16 L0 16 Z" fill="#fff" />
          <path d="M22 4 L35 4 L31 16 L18 16 Z" fill="#fff" />
          <path d="M2 20 L15 20 L11 32 L-2 32 Z" fill="#fff" transform="translate(2 0)" />
          <path d="M20 20 L33 20 L29 32 L16 32 Z" fill="#fff" transform="translate(2 0)" />
        </g>
      </svg>
      <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>
        ZUPER
        <sup style={{ fontSize: "10px", fontWeight: 600, marginLeft: 2, top: "-1.2em" }}>™</sup>
      </span>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const c = "rgba(255,255,255,0.85)";
  const common = { width: 26, height: 26, viewBox: "0 0 26 26", fill: "none" } as const;
  return (
    <svg {...common}>
      <circle cx="13" cy="13" r="12" stroke={c} strokeWidth="1.2" />
      {name === "facebook" && (
        <path d="M14.4 9h1.4V7.1h-1.8c-1.5 0-2.4.9-2.4 2.4V11h-1.4v1.9h1.4V20h2v-7.1h1.6l.3-1.9h-1.9V9.7c0-.4.2-.7.8-.7z" fill={c} />
      )}
      {name === "instagram" && (
        <>
          <rect x="7.5" y="7.5" width="11" height="11" rx="3" stroke={c} strokeWidth="1.2" />
          <circle cx="13" cy="13" r="2.6" stroke={c} strokeWidth="1.2" />
          <circle cx="16.2" cy="9.8" r="0.7" fill={c} />
        </>
      )}
      {name === "youtube" && (
        <>
          <rect x="6.5" y="9" width="13" height="8" rx="2" stroke={c} strokeWidth="1.2" />
          <path d="M11.5 11.2v3.6l3.2-1.8-3.2-1.8z" fill={c} />
        </>
      )}
      {name === "linkedin" && (
        <>
          <rect x="7" y="10.5" width="2" height="7.5" fill={c} />
          <circle cx="8" cy="8.2" r="1.1" fill={c} />
          <path d="M10.6 10.5h1.9v1c.5-.7 1.3-1.2 2.3-1.2 1.6 0 2.6 1 2.6 2.9V18H15.5v-3.6c0-.9-.3-1.5-1.2-1.5-.8 0-1.3.6-1.3 1.5V18h-2.4v-7.5z" fill={c} />
        </>
      )}
      {name === "x" && (
        <path d="M8.5 8.5l9 9M17.5 8.5l-9 9" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "#050d23",
        color: "#E6ECF5",
        overflow: "hidden",
        paddingTop: "120px",
      }}
    >

      <div
        style={{
          position: "relative",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 56px",
          zIndex: 2,
        }}
      >
        {/* Top: logo + badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "28px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <ZuperLogo />
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/badge1.png" alt="SOC 2 Type 2" style={{ height: "84px", width: "auto", objectFit: "contain" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/badge2.png" alt="ISO 27001" style={{ height: "84px", width: "auto", objectFit: "contain" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/badge3.png" alt="Great Place To Work" style={{ height: "84px", width: "auto", objectFit: "contain" }} />
          </div>
        </div>

        {/* 5-column link grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "32px",
            paddingTop: "52px",
            paddingBottom: "44px",
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <FooterColumn title={col.title} links={col.links} />
              {col.extra && (
                <div style={{ marginTop: "32px" }}>
                  <FooterColumn title={col.extra.title} links={col.extra.links} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Store badges + socials */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "28px",
            paddingBottom: "40px",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a href="#" style={{ display: "block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/footer/google-play.png" alt="Google Play" style={{ height: "48px", width: "auto", display: "block" }} />
            </a>
            <a href="#" style={{ display: "block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/footer/app-store.png" alt="App Store" style={{ height: "48px", width: "auto", display: "block" }} />
            </a>
          </div>
          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            {["facebook", "instagram", "youtube", "linkedin", "x"].map((s) => (
              <a key={s} href="#" aria-label={s} style={{ display: "inline-flex", opacity: 0.9 }}>
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Big ZUPER wordmark sitting on top of houses */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/footer/zuper-bigtext.png"
            alt=""
            style={{ width: "100%", height: "auto", display: "block", opacity: 0.9 }}
          />
        </div>
      </div>

      {/* Houses scene overlapping the wordmark */}
      <div
        style={{
          position: "relative",
          width: "100%",
          marginTop: "-120px",
          zIndex: 3,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/sky-bg.png"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Bottom legal bar */}
      <div
        style={{
          position: "relative",
          background: "#050d23",
          zIndex: 4,
          padding: "20px 56px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            fontSize: "13px",
            color: "rgba(230,236,245,0.75)",
          }}
        >
          <div>© 2026 Zuper Inc</div>
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            {LEGAL.map((l) => (
              <a
                key={l}
                href="#"
                style={{ color: "rgba(230,236,245,0.75)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(230,236,245,0.75)")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        {title}
      </div>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          style={{
            display: "block",
            fontSize: "14px",
            color: "rgba(230,236,245,0.78)",
            marginBottom: "12px",
            textDecoration: "none",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(230,236,245,0.78)")}
        >
          {link}
        </a>
      ))}
    </div>
  );
}
