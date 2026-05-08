"use client";

/**
 * TextScramble — Matrix-style character reveal.
 *
 * Each character cycles through random glyphs before settling on its
 * final value. Reveal sweeps left-to-right with each character starting
 * its own scramble at a staggered offset.
 *
 * Usage:
 *   <TextScramble text="Command center" active={isVisible} duration={1100} />
 *
 * Whitespace and newlines pass through unchanged. Honours
 * prefers-reduced-motion by snapping to the final string immediately.
 */

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#";

export interface TextScrambleProps {
  text: string;
  /** Becomes `true` when the reveal should start. Re-runs if it flips false→true. */
  active?: boolean;
  /** Total reveal duration (ms). Default 1100. */
  duration?: number;
  /** Wait this many ms after `active` flips true before starting. Default 0. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export default function TextScramble({
  text,
  active = true,
  duration = 1100,
  delay = 0,
  className,
  style,
  as: Tag = "span",
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(active ? "" : text);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      // Reset to empty so the next activation re-plays from the start.
      startedRef.current = false;
      setDisplayed("");
      return;
    }
    if (startedRef.current) return;

    // Honour reduced-motion users: render the final string and skip.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text);
      startedRef.current = true;
      return;
    }

    startedRef.current = true;
    let startTime: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Each character has its own start point spread across the first
      // 65% of the timeline; remaining 35% lets each character finish
      // its individual scramble.
      const stagger = 0.65;
      const perCharDuration = 1 - stagger;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // Preserve whitespace + line breaks instantly so layout doesn't jitter.
        if (ch === " " || ch === "\n") {
          out += ch;
          continue;
        }
        const charStart = (i / Math.max(1, text.length - 1)) * stagger;
        const charProgress = (progress - charStart) / perCharDuration;
        if (charProgress >= 1) {
          out += ch;
        } else if (charProgress <= 0) {
          // Not started yet — emit a random glyph so total width stays stable.
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      setDisplayed(out);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    };

    timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, active, duration, delay]);

  return (
    <Tag className={className} style={style}>
      {displayed}
    </Tag>
  );
}
