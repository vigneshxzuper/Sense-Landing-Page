"use client";

import { useEffect, useState } from "react";

interface TypewriterOnceProps {
  lines: string[];
  startDelayMs?: number;
  typeMs?: number;
  onDone?: () => void;
}

export default function TypewriterOnce({
  lines,
  startDelayMs = 0,
  typeMs = 1400,
  onDone,
}: TypewriterOnceProps) {
  const total = lines.reduce((s, l) => s + l.length, 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(total);
      onDone?.();
      return;
    }

    let mounted = true;
    let id: ReturnType<typeof setInterval> | null = null;
    let doneFired = false;

    const startTimer = setTimeout(() => {
      if (!mounted) return;
      const charDelay = Math.max(20, typeMs / Math.max(1, total));
      id = setInterval(() => {
        if (!mounted) return;
        setProgress((p) => {
          const next = Math.min(p + 1, total);
          if (next >= total && !doneFired) {
            doneFired = true;
            if (id) {
              clearInterval(id);
              id = null;
            }
            onDone?.();
          }
          return next;
        });
      }, charDelay);
    }, startDelayMs);

    return () => {
      mounted = false;
      clearTimeout(startTimer);
      if (id) clearInterval(id);
    };
  }, [total, startDelayMs, typeMs, onDone]);

  let remaining = progress;
  return (
    <>
      {lines.map((line, i) => {
        const shown = line.slice(0, Math.min(remaining, line.length));
        remaining = Math.max(0, remaining - line.length);
        return (
          <span
            key={i}
            style={{
              whiteSpace: "nowrap",
              display: lines.length > 1 ? "block" : "inline",
            }}
          >
            {shown ? shown : " "}
          </span>
        );
      })}
    </>
  );
}
