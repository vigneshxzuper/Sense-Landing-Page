"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

type Props = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  revealMs?: number;
  perChar?: boolean;
};

export default function ScrambleText({
  text,
  className,
  style,
  delay = 300,
  revealMs = 900,
  perChar = true,
}: Props) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const play = () => {
      cancelAnimationFrame(rafRef.current);
      const start = performance.now() + delay;
      const total = revealMs + text.length * 12;

      const tick = (now: number) => {
        if (now < start) {
          setDisplay(
            text
              .split("")
              .map((c) => (/[a-zA-Z]/.test(c) ? rand() : c))
              .join("")
          );
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        const t = Math.min(1, (now - start) / total);
        const revealed = Math.floor(t * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (!/[a-zA-Z]/.test(c)) {
            out += c;
            continue;
          }
          if (perChar ? i < revealed : t >= 1) out += c;
          else out += rand();
        }
        setDisplay(out);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else setDisplay(text);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          playedRef.current = true;
          play();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay, revealMs, perChar]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}

function rand() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}
