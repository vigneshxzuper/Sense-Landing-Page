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

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "#050d23",
        overflow: "hidden",
        lineHeight: 0,
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer/footer-image.png"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* 5-column link grid overlaid in the empty band between top
            divider and store-row divider. */}
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

        {/* Clickable hotspots for badges / store / social / legal */}
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 900px) {
          .footer-link-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px 16px !important;
          }
        }
      `,
        }}
      />
    </footer>
  );
}
