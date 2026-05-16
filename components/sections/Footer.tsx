"use client";

/**
 * Footer — image #38 as the visual base (logo, badges, scene, ZUPER
 * wordmark, legal bar are all baked into the image). The 5 link
 * columns + store + social + legal hotspots are overlaid as real
 * HTML so they are crisp, clickable, and accessible.
 *
 * Image dimensions: 1438 × 1688 px.
 */

type Link = { label: string; href: string };
type Column = { title: string; links: Link[]; extra?: { title: string; links: Link[] } };

const COLUMNS: Column[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "https://beta.zuper.co/about-zuper" },
      { label: "Careers", href: "https://beta.zuper.co/careers" },
      { label: "Contact Us", href: "https://beta.zuper.co/contact-us" },
      { label: "Leadership", href: "https://beta.zuper.co/about-zuper#Leadership" },
      { label: "Partners", href: "https://beta.zuper.co/partners" },
      { label: "Press & Media", href: "https://beta.zuper.co/press-media" },
      { label: "Security & Compliance", href: "https://beta.zuper.co/compliance" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "All Features", href: "https://beta.zuper.co/all-solutions" },
      { label: "Integrations (60+)", href: "https://beta.zuper.co/apps-integration" },
      { label: "Mobile App", href: "https://beta.zuper.co/field-service-management-app" },
      { label: "Zuper Sense", href: "https://beta.zuper.co/zuper-sense" },
      { label: "Zuper Glass", href: "https://beta.zuper.co/zuper-glass" },
      { label: "Zuper Connect", href: "https://beta.zuper.co/zuper-connect" },
      { label: "Zuper Fleet", href: "https://beta.zuper.co/zuper-fleet" },
      { label: "Zuper Pay", href: "https://beta.zuper.co/zuper-pay" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Roofing", href: "https://beta.zuper.co/roofing-software" },
      { label: "Cleaning", href: "https://www.zuper.co/cleaning-services-software" },
      { label: "HVAC", href: "https://beta.zuper.co/hvac-software" },
      { label: "Pool & Hot Tub", href: "https://www.zuper.co/pool-service-software" },
      { label: "Landscaping", href: "https://beta.zuper.co/landscaping-software" },
      { label: "Manufacturing", href: "https://www.zuper.co/manufacturing-management-software" },
      { label: "Maintenance", href: "https://www.zuper.co/facilities-and-property-maintenance" },
      { label: "Plumbing", href: "https://beta.zuper.co/plumbing-software" },
    ],
  },
  {
    title: "Customer",
    links: [
      { label: "Customer Login", href: "https://web.zuperpro.com/login" },
      { label: "Help Center", href: "https://docs.zuper.co/Getting_Started/Welcome_to_Zuper" },
      { label: "Onboarding", href: "https://beta.zuper.co/onboarding" },
    ],
    extra: {
      title: "Developer",
      links: [
        { label: "Developer Portal", href: "https://developers.zuper.co" },
        { label: "API Reference", href: "https://developers.zuper.co/reference/getting-started-with-your-api" },
        { label: "Status", href: "https://zuperpro.statuspage.io/" },
        { label: "Developers’ Help", href: "https://developers.zuper.co/docs/getting-started" },
      ],
    },
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "https://beta.zuper.co/blog" },
      { label: "Case Studies", href: "https://beta.zuper.co/case-studies" },
      { label: "Customer Stories", href: "https://beta.zuper.co/customer-stories" },
      { label: "Free Tools", href: "https://beta.zuper.co/free-tools" },
      { label: "eBooks", href: "https://beta.zuper.co/ebooks" },
      { label: "Research", href: "https://beta.zuper.co/research" },
      { label: "Videos", href: "https://beta.zuper.co/videos" },
    ],
  },
];

const LEGAL: Link[] = [
  { label: "Support", href: "https://care.zuper.co/portal/en/home" },
  { label: "Terms of Service", href: "https://beta.zuper.co/terms-conditions" },
  { label: "Privacy Policy", href: "https://beta.zuper.co/privacy-policy" },
  { label: "Compliance", href: "https://beta.zuper.co/compliance" },
  { label: "Google API Disclosure", href: "https://beta.zuper.co/google-api-disclosure" },
  { label: "Sitemap", href: "https://beta.zuper.co/sitemap" },
];

type Hotspot = { href: string; label: string; left: number; top: number; width: number; height: number };

const HOTSPOTS: Hotspot[] = [
  // Trust badges (top right of image)
  { label: "SOC 2 Type 2", href: "https://beta.zuper.co/compliance", left: 66.5, top: 17.2, width: 6.1, height: 5.8 },
  { label: "ISO 27001", href: "https://beta.zuper.co/compliance", left: 73.3, top: 17.2, width: 6.1, height: 5.8 },
  { label: "Great Place To Work", href: "https://beta.zuper.co/careers", left: 80.1, top: 17.2, width: 6.7, height: 5.8 },

  // Store badges
  { label: "Google Play", href: "https://play.google.com/store/apps/details?id=co.zuper.android", left: 14.6, top: 48.6, width: 12.4, height: 5.1 },
  { label: "App Store", href: "https://apps.apple.com/in/app/zuper-field-service-your-way/id1633081340", left: 27.7, top: 48.6, width: 12.7, height: 5.1 },

  // Social icons
  { label: "Facebook", href: "https://www.facebook.com/zuperpro/", left: 70.9, top: 51.0, width: 1.7, height: 1.5 },
  { label: "Instagram", href: "https://www.instagram.com/zuperpro/", left: 73.8, top: 51.0, width: 1.9, height: 1.5 },
  { label: "YouTube", href: "https://www.youtube.com/@zuperofficial", left: 77.0, top: 51.0, width: 2.0, height: 1.5 },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/zuperpro/", left: 80.4, top: 51.0, width: 1.9, height: 1.5 },
  { label: "X", href: "https://twitter.com/zuperpro", left: 83.5, top: 51.0, width: 1.7, height: 1.5 },

  // Bottom legal links
  ...LEGAL.map((l, i) => {
    const positions = [
      { left: 30.2, width: 3.9 },
      { left: 35.1, width: 8.4 },
      { left: 44.5, width: 8.3 },
      { left: 55.3, width: 6.8 },
      { left: 63.3, width: 11.8 },
      { left: 76.2, width: 4.4 },
    ];
    return { href: l.href, label: l.label, left: positions[i].left, top: 97.8, width: positions[i].width, height: 1.6 };
  }),
];

function FooterColumn({ title, links }: { title: string; links: Link[] }) {
  return (
    <div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "22px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            fontSize: "16px",
            color: "rgba(230,236,245,0.82)",
            marginBottom: "16px",
            textDecoration: "none",
            transition: "color 160ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(230,236,245,0.82)")}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function MobileFooter() {
  return (
    <div
      style={{
        background: "#050d23",
        color: "#E6ECF5",
        padding: "40px 20px 24px",
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        lineHeight: 1.4,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.04em", color: "#fff" }}>
          ZUPER<sup style={{ fontSize: "9px", fontWeight: 600, marginLeft: 2 }}>™</sup>
        </span>
      </div>

      {/* Trust badges row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[
          { label: "SOC 2 Type 2", href: "https://beta.zuper.co/compliance", src: "/footer/badge1.png" },
          { label: "ISO 27001", href: "https://beta.zuper.co/compliance", src: "/footer/badge2.png" },
          { label: "Great Place To Work", href: "https://beta.zuper.co/careers", src: "/footer/badge3.png" },
        ].map((b) => (
          <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" aria-label={b.label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.src} alt={b.label} style={{ height: "54px", width: "auto", display: "block" }} />
          </a>
        ))}
      </div>

      {/* Link columns stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "32px" }}>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <FooterColumn title={col.title} links={col.links} />
            {col.extra && (
              <div style={{ marginTop: "20px" }}>
                <FooterColumn title={col.extra.title} links={col.extra.links} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Store badges */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <a href="https://play.google.com/store/apps/details?id=co.zuper.android" target="_blank" rel="noopener noreferrer" aria-label="Google Play">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/google-play.png" alt="Google Play" style={{ height: "40px", width: "auto", display: "block" }} />
        </a>
        <a href="https://apps.apple.com/in/app/zuper-field-service-your-way/id1633081340" target="_blank" rel="noopener noreferrer" aria-label="App Store">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/app-store.png" alt="App Store" style={{ height: "40px", width: "auto", display: "block" }} />
        </a>
      </div>

      {/* Social row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Facebook", href: "https://www.facebook.com/zuperpro/" },
          { label: "Instagram", href: "https://www.instagram.com/zuperpro/" },
          { label: "YouTube", href: "https://www.youtube.com/@zuperofficial" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/zuperpro/" },
          { label: "X", href: "https://twitter.com/zuperpro" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {s.label.charAt(0)}
          </a>
        ))}
      </div>

      {/* Legal */}
      <div style={{ paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontSize: "12px", color: "rgba(230,236,245,0.6)", marginBottom: "12px" }}>© 2026 Zuper Inc</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: "12px" }}>
          {LEGAL.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(230,236,245,0.72)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "#050d23",
        overflow: "hidden",
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Desktop: image + overlaid link grid + hotspots */}
      <div className="footer-desktop" style={{ position: "relative", width: "100%", lineHeight: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/footer-image.png"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        <div
          style={{
            position: "absolute",
            top: "24.8%",
            left: "13%",
            right: "13%",
            zIndex: 2,
            lineHeight: 1.4,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
            }}
            className="footer-link-grid"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <FooterColumn title={col.title} links={col.links} />
                {col.extra && (
                  <div style={{ marginTop: "28px" }}>
                    <FooterColumn title={col.extra.title} links={col.extra.links} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {HOTSPOTS.map((h, i) => (
          <a
            key={`${h.label}-${i}`}
            href={h.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={h.label}
            style={{
              position: "absolute",
              top: `${h.top}%`,
              left: `${h.left}%`,
              width: `${h.width}%`,
              height: `${h.height}%`,
              cursor: "pointer",
              borderRadius: "4px",
              zIndex: 2,
              transition: "background-color 160ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          />
        ))}
      </div>

      {/* Mobile: clean stacked text footer */}
      <div className="footer-mobile" style={{ display: "none" }}>
        <MobileFooter />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          .footer-desktop { display: none !important; }
          .footer-mobile { display: block !important; }
        }
      `,
        }}
      />
    </footer>
  );
}
