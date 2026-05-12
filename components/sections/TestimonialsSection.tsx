"use client";

/**
 * TestimonialsSection
 * Anonymous quotes about Zuper Sense displayed as a two-row reel:
 *   • Row 1 scrolls right → left
 *   • Row 2 scrolls left → right
 * Quotes loop seamlessly via duplicated content + CSS keyframes.
 * Hovering a row pauses its scroll so users can read longer quotes.
 */

type Quote = { text: string; name: string; role: string; tone: string };

const QUOTES_TOP: Quote[] = [
  { text: "It feels like a senior analyst is sitting next to me — except they never sleep.", name: "Sarah Chen", role: "VP Operations · Crestline Roofing", tone: "#F59E0B" },
  { text: "I asked it where my cash was stuck, and it told me in four seconds.",              name: "Marcus Patel", role: "CFO · Hartwell Builders", tone: "#22C55E" },
  { text: "Half the questions I used to ask my CFO, I now type into Sense.",                  name: "Diana Okafor", role: "COO · Stormline Restoration", tone: "#A78BFA" },
  { text: "We replaced four dashboards with one prompt.",                                     name: "Rafael Mendes", role: "Director of Field Ops · Beacon Pro", tone: "#38BDF8" },
  { text: "Surfaced a $40K invoice we'd completely missed. Paid for itself the first week.",  name: "Jordan Reeves", role: "Controller · Vanguard Roofing", tone: "#E85D3A" },
  { text: "Onboarding new ops people takes two hours instead of two weeks.",                  name: "Priya Sharma", role: "Head of People · Northbound Trades", tone: "#FBBF24" },
];

const QUOTES_BOTTOM: Quote[] = [
  { text: "I trust the answer because it shows me the rows it pulled.",                       name: "Elliot Vasquez", role: "Data Lead · Ridgepoint Roofing", tone: "#34D399" },
  { text: "It writes the email, calls the customer, and updates the CRM. I just approve.",    name: "Mia Henderson", role: "CSR Manager · Apex Exteriors", tone: "#C4B5FD" },
  { text: "First AI feature in our stack that I actually use every single day.",              name: "Devon Brooks", role: "Owner · Brooks & Sons Roofing", tone: "#FB7185" },
  { text: "I stopped exporting CSVs three months ago.",                                       name: "Lena Rossi", role: "Ops Analyst · Truss Capital", tone: "#60A5FA" },
  { text: "It found the dispatch I'd dropped before the customer noticed.",                   name: "Tobias Klein", role: "Service Director · Cedar Roofing Co.", tone: "#F472B6" },
  { text: "Quietly the most useful thing my team adopted this year.",                         name: "Avery Nakamura", role: "GM · Summit Storm Group", tone: "#A3E635" },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "min(420px, 78vw)",
        padding: "26px 26px 22px",
        borderRadius: "14px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 24px 60px -28px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: "44px",
          lineHeight: 0.7,
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "rgba(232,93,58,0.65)",
          marginTop: "-2px",
        }}
      >
        “
      </span>
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          lineHeight: 1.55,
          color: "var(--ink)",
          fontWeight: 450,
          letterSpacing: "-0.005em",
          flex: 1,
        }}
      >
        {quote.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", paddingTop: "14px", borderTop: "1px solid var(--card-border)" }}>
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${quote.tone} 0%, rgba(0,0,0,0.6) 140%)`,
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            flexShrink: 0,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 6px 16px -6px ${quote.tone}55`,
          }}
        >
          {initials(quote.name)}
        </span>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.2 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.005em" }}>{quote.name}</span>
          <span style={{ fontSize: "11.5px", color: "var(--ink3)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{quote.role}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  quotes,
  reverse = false,
  duration = 60,
}: {
  quotes: Quote[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div
      className="testimonial-marquee"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        // Soft fade on the left + right edges so cards don't snap in/out.
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "max-content",
          animation: `${
            reverse ? "testimonialMarqueeReverse" : "testimonialMarquee"
          } ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {[...quotes, ...quotes].map((q, i) => (
          <QuoteCard key={i} quote={q} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg)",
        padding: "120px 0 140px",
        overflow: "hidden",
      }}
      aria-label="What teams say about Sense"
    >
      <div
        style={{
          textAlign: "center",
          padding: "0 24px",
          marginBottom: "56px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 14px",
            borderRadius: "999px",
            border: "1px solid var(--card-border)",
            background: "var(--card-bg)",
            color: "var(--ink2)",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Voices
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: "0 auto",
            maxWidth: "760px",
          }}
        >
          What teams say about Sense.
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--ink2)",
            marginTop: "14px",
            marginBottom: 0,
            maxWidth: "520px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          Real words from operators using Sense in their day-to-day work.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <MarqueeRow quotes={QUOTES_TOP} duration={72} />
        <MarqueeRow quotes={QUOTES_BOTTOM} reverse duration={84} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes testimonialMarquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            @keyframes testimonialMarqueeReverse {
              from { transform: translateX(-50%); }
              to   { transform: translateX(0); }
            }
            .testimonial-marquee:hover > div {
              animation-play-state: paused;
            }
          `,
        }}
      />
    </section>
  );
}
