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

// Person → tone color (consistent across both rows)
const TONES = {
  kent: "#F59E0B",
  cooper: "#22C55E",
  jt: "#A78BFA",
  john: "#38BDF8",
  noe: "#F472B6",
  chris: "#FB7185",
} as const;

const QUOTES_TOP: Quote[] = [
  { text: "It is basically ChatGPT in your roofing CRM.",                                                          name: "Kent Panovec",          role: "COO / Owner · Maven Roofing",                tone: TONES.kent },
  { text: "Zuper Sense already knows roofing — you don't have to teach it.",                                       name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "Build dashboards in seconds, not days.",                                                                name: "JT Ulyatt",             role: "CEO · Maven Roofing",                        tone: TONES.jt },
  { text: "I could not be happier to never have to build a custom reporting dashboard ever again.",                name: "John A. Marrah III",    role: "Mindful Leader · MARASUN",                   tone: TONES.john },
  { text: "It's really amazing, it's mind-blowing, and it's a game changer.",                                      name: "Chris Little",          role: "Office Manager · Dickinson Roofing",         tone: TONES.chris },
  { text: "How powerful is it to have your own LLM sitting on top of your data?",                                  name: "JT Ulyatt",             role: "CEO · Maven Roofing",                        tone: TONES.jt },
  { text: "Sense allows us to work on numbers from right now — from this morning.",                                name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "There's so many AI things out there, but none of them are integrated natively into your CRM.",          name: "Noe Madrigal",          role: "President · A&A Roofing Services",           tone: TONES.noe },
  { text: "We've never had the ability to get those questions answered instantaneously.",                          name: "Kent Panovec",          role: "COO / Owner · Maven Roofing",                tone: TONES.kent },
  { text: "Zuper Sense: ask, analyze, act. The command center for the trades.",                                    name: "John A. Marrah III",    role: "Mindful Leader · MARASUN",                   tone: TONES.john },
];

const QUOTES_BOTTOM: Quote[] = [
  { text: "I thought it was a gimmick. It's a game changer.",                                                      name: "Kent Panovec",          role: "COO / Owner · Maven Roofing",                tone: TONES.kent },
  { text: "I don't really pull reports anymore.",                                                                  name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "AI actions on data is a game changer.",                                                                 name: "JT Ulyatt",             role: "CEO · Maven Roofing",                        tone: TONES.jt },
  { text: "It's no more playing defense.",                                                                         name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "The speed to getting information is so much quicker.",                                                  name: "John A. Marrah III",    role: "Mindful Leader · MARASUN",                   tone: TONES.john },
  { text: "Zuper Sense monitors, analyzes, predicts, and recommends everything I need to run my business.",        name: "JT Ulyatt",             role: "CEO · Maven Roofing",                        tone: TONES.jt },
  { text: "Within minutes I've built over six KPI dashboards.",                                                    name: "JT Ulyatt",             role: "CEO · Maven Roofing",                        tone: TONES.jt },
  { text: "Zuper is how you can get on top of your game; Sense is how you stay there.",                            name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "We can work proactively instead of just reactively.",                                                   name: "Cooper J. Knutson",     role: "I.T. Administrator · Russell Quality Roofing", tone: TONES.cooper },
  { text: "I don't ever have to go in and ask or make a chart again.",                                             name: "Chris Little",          role: "Office Manager · Dickinson Roofing",         tone: TONES.chris },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div
      className="card-depth"
      style={{
        flexShrink: 0,
        width: "min(420px, 78vw)",
        padding: "26px 26px 22px",
        borderRadius: "14px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
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
