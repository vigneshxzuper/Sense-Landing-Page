"use client";

/**
 * RollText — wraps each letter in a fixed-height slot containing two
 * stacked copies. The parent button needs class `btn-roll` (or the
 * existing `hero-cta`) so the global hover rule translates the inner
 * stack up by one line. transitionDelay staggers letter-by-letter.
 */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="cta-roll-word" aria-label={children}>
      {Array.from(children).map((ch, i) => (
        <span
          key={i}
          className="cta-roll"
          style={{ transitionDelay: `${i * 22}ms` }}
          aria-hidden
        >
          <span
            className="cta-roll-inner"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            <span className="cta-roll-line">{ch === " " ? " " : ch}</span>
            <span className="cta-roll-line">{ch === " " ? " " : ch}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
