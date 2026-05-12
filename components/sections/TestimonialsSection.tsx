"use client";

/**
 * TestimonialsSection
 * Anonymous quotes about Zuper Sense displayed as a two-row reel:
 *   • Row 1 scrolls right → left
 *   • Row 2 scrolls left → right
 * Quotes loop seamlessly via duplicated content + CSS keyframes.
 * Hovering a row pauses its scroll so users can read longer quotes.
 */

const QUOTES_TOP = [
  "It feels like a senior analyst is sitting next to me — except they never sleep.",
  "I asked it where my cash was stuck, and it told me in four seconds.",
  "Half the questions I used to ask my CFO, I now type into Sense.",
  "We replaced four dashboards with one prompt.",
  "Surfaced a $40K invoice we'd completely missed. Paid for itself the first week.",
  "Onboarding new ops people takes two hours instead of two weeks.",
];

const QUOTES_BOTTOM = [
  "I trust the answer because it shows me the rows it pulled.",
  "It writes the email, calls the customer, and updates the CRM. I just approve.",
  "First AI feature in our stack that I actually use every single day.",
  "I stopped exporting CSVs three months ago.",
  "It found the dispatch I'd dropped before the customer noticed.",
  "Quietly the most useful thing my team adopted this year.",
];

function QuoteCard({ text }: { text: string }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "min(420px, 78vw)",
        padding: "28px 28px 26px",
        borderRadius: "14px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 24px 60px -28px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
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
        }}
      >
        {text}
      </p>
    </div>
  );
}

function MarqueeRow({
  quotes,
  reverse = false,
  duration = 60,
}: {
  quotes: string[];
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
          <QuoteCard key={i} text={q} />
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
