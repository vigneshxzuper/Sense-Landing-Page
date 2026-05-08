"use client";

/**
 * TypewriterLoop — types `text` out character by character, holds it
 * fully visible, then resets to empty and re-types. Loops forever on a
 * `cycleMs` interval (default 4 s).
 *
 * Plays nicely with reduced-motion: just renders the full string and
 * skips the animation entirely for users who've opted out.
 */

import { useEffect, useState } from "react";

interface TypewriterLoopProps {
  text: string;
  /** Total cycle length (type + hold + erase) in ms. Default 4000. */
  cycleMs?: number;
  /** Time it takes to fully type the string in ms. Default 1400. */
  typeMs?: number;
}

export default function TypewriterLoop({
  text,
  cycleMs = 4000,
  typeMs = 1400,
}: TypewriterLoopProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayed(text);
      return;
    }

    let typeInterval: ReturnType<typeof setInterval> | null = null;
    let cycleTimeout: ReturnType<typeof setTimeout> | null = null;
    let mounted = true;

    const startCycle = () => {
      if (!mounted) return;
      setDisplayed("");
      let i = 0;
      const charDelay = Math.max(20, typeMs / Math.max(1, text.length));
      typeInterval = setInterval(() => {
        if (!mounted) return;
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length && typeInterval) {
          clearInterval(typeInterval);
          typeInterval = null;
        }
      }, charDelay);
      cycleTimeout = setTimeout(startCycle, cycleMs);
    };

    startCycle();

    return () => {
      mounted = false;
      if (typeInterval) clearInterval(typeInterval);
      if (cycleTimeout) clearTimeout(cycleTimeout);
    };
  }, [text, cycleMs, typeMs]);

  return <>{displayed}</>;
}
