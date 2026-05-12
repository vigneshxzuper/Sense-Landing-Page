"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, ArrowRight, Receipt, CheckCircle2, Zap, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: {
  minHeight: number;
  maxHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) { textarea.style.height = `${minHeight}px`; return; }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Infinity));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);
  useEffect(() => {
    const h = () => adjustHeight();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [adjustHeight]);
  return { textareaRef, adjustHeight };
}

const TYPED_TEXT = "what's happening with my overdue invoices";
const TYPED_AUTO_TOPIC = "revenue" as const;

const CHIPS = [
  { label: "Aging supplements by carrier", topic: "performance" },
  { label: "Estimates over $25K that need follow-up", topic: "sla" },
  { label: "Calls I missed yesterday", topic: "revenue" },
] as const;

export type AnalyzeTopic = "performance" | "sla" | "revenue" | null;

export function SenseChat({ scrollProgress }: { scrollProgress?: number } = {}) {
  const isScrub = scrollProgress !== undefined;
  const [value, setValue] = useState("");
  const [typedIndex, setTypedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingArmed, setTypingArmed] = useState(false);
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  // Generate-click choreography: typing → cursor flies in → presses
  // Generate → button flips to "Thinking…" → result card slides in →
  // second cursor flies in → presses Add to Radar → button flips to
  // "Added".
  const [cursorPhase, setCursorPhase] = useState<"hidden" | "moving" | "pressed" | "done">("hidden");
  const [isThinking, setIsThinking] = useState(false);
  const [resultShown, setResultShown] = useState(false);
  const [radarCursorPhase, setRadarCursorPhase] = useState<"hidden" | "moving" | "pressed" | "done">("hidden");
  const [radarAdded, setRadarAdded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 80, maxHeight: 200 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Scrub-mode driver — when a `scrollProgress` prop is supplied, the
  // parent pins the section and feeds us 0→1 scroll progress; we map
  // that to each beat of the typing → cursor → result → radar
  // sequence so the entire flow scrubs forwards/backwards with scroll.
  useEffect(() => {
    if (!isScrub || scrollProgress === undefined) return;
    const p = scrollProgress;

    // Phase boundaries (0 → 1):
    const TYPING_START = 0.12;
    const TYPING_END   = 0.42;
    const CURSOR_MOVE  = 0.48;
    const GEN_PRESS    = 0.54;
    const THINKING_END = 0.62;
    const RESULT_AT    = 0.66;
    const RADAR_MOVE   = 0.80;
    const RADAR_PRESS  = 0.88;
    const RADAR_DONE   = 0.94;

    // Typewriter
    if (p < TYPING_START) {
      setValue("");
      setTypedIndex(0);
    } else if (p < TYPING_END) {
      const tp = (p - TYPING_START) / (TYPING_END - TYPING_START);
      const idx = Math.min(TYPED_TEXT.length, Math.ceil(tp * TYPED_TEXT.length));
      setTypedIndex(idx);
      setValue(TYPED_TEXT.slice(0, idx));
    } else {
      setTypedIndex(TYPED_TEXT.length);
      setValue(TYPED_TEXT);
    }

    // Generate cursor + Thinking
    if (p < CURSOR_MOVE) {
      setCursorPhase("hidden");
      setAutoAdvanced(false);
      setIsThinking(false);
    } else if (p < GEN_PRESS) {
      setCursorPhase("moving");
    } else if (p < THINKING_END) {
      setCursorPhase("pressed");
      setAutoAdvanced(true);
      setIsThinking(true);
    } else {
      setCursorPhase("done");
      setAutoAdvanced(true);
      setIsThinking(false);
    }

    // Result card
    setResultShown(p >= RESULT_AT);

    // Add-to-Radar cursor + press
    if (p < RADAR_MOVE) {
      setRadarCursorPhase("hidden");
      setRadarAdded(false);
    } else if (p < RADAR_PRESS) {
      setRadarCursorPhase("moving");
    } else if (p < RADAR_DONE) {
      setRadarCursorPhase("pressed");
    } else {
      setRadarCursorPhase("done");
      setRadarAdded((prev) => {
        if (!prev) {
          // First time hitting "added" — let the rest of the page know
          // so the Monitor view's overdue card glows in.
          window.dispatchEvent(new CustomEvent("sense-radar-added"));
        }
        return true;
      });
    }
  }, [scrollProgress, isScrub]);

  // Arm typing only when the chat is actually VISIBLE — both in the
  // viewport AND with every ancestor's computed opacity ≥ 0.5. This
  // matters in the hero where the chat's parent animates from opacity
  // 0 → 1 over scroll; a vanilla IntersectionObserver fires on DOM
  // intersection regardless of opacity, so typing would otherwise
  // complete before the user ever sees the chat.
  useEffect(() => {
    if (isScrub) return;
    if (typingArmed) return;
    let rafId = 0;
    const check = () => {
      const el = containerRef.current;
      if (!el) {
        rafId = requestAnimationFrame(check);
        return;
      }
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        let cur: HTMLElement | null = el;
        let visible = true;
        while (cur) {
          const op = parseFloat(getComputedStyle(cur).opacity || "1");
          if (op < 0.5) {
            visible = false;
            break;
          }
          cur = cur.parentElement;
        }
        if (visible) {
          setTypingArmed(true);
          return;
        }
      }
      rafId = requestAnimationFrame(check);
    };
    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, [typingArmed]);

  // Start typing as soon as the chat enters the viewport — short 500ms
  // landing buffer so it doesn't feel snappy/glitchy, then the
  // typewriter takes over. Skipped in scrub mode (scroll drives it).
  useEffect(() => {
    if (isScrub) return;
    if (!typingArmed) return;
    const t = setTimeout(() => setIsTyping(true), 500);
    return () => clearTimeout(t);
  }, [typingArmed, isScrub]);

  useEffect(() => {
    if (isScrub) return;
    if (!isTyping || typedIndex >= TYPED_TEXT.length) {
      if (typedIndex >= TYPED_TEXT.length) setIsTyping(false);
      return;
    }
    const delay = 60 + Math.random() * 40;
    const t = setTimeout(() => {
      setTypedIndex((i) => i + 1);
      setValue(TYPED_TEXT.slice(0, typedIndex + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [typedIndex, isTyping, isScrub]);

  // Once typing finishes, wait a full second (per spec) then fly the
  // cursor in, press the Generate button visually, and fire the
  // auto-advance event the moment the press lands.
  useEffect(() => {
    if (isScrub) return;
    if (autoAdvanced || isTyping || typedIndex < TYPED_TEXT.length) return;
    if (cursorPhase !== "hidden") return;
    const t1 = setTimeout(() => setCursorPhase("moving"), 1000);
    const t2 = setTimeout(() => setCursorPhase("pressed"), 1000 + 620);
    const t3 = setTimeout(() => {
      setAutoAdvanced(true);
      setIsThinking(true);
      setCursorPhase("done");
      // No scroll-forward dispatch here — the result card and the
      // Add-to-Radar cursor press both play in place. The user owns
      // the scroll from here on; advancing into the Monitor/Analyze
      // phases is driven purely by their next scroll input.
    }, 1000 + 620 + 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // cursorPhase intentionally omitted: including it would cancel its
    // own pending timers when the first one fires setCursorPhase, so
    // the press + dispatch beats would never land.
  }, [isTyping, autoAdvanced, typedIndex]);

  // After the Generate press lands, hold on "Thinking…" for a beat,
  // then drop the loading state and slide the result card in.
  // Skipped in scrub mode — scroll progress drives those states.
  useEffect(() => {
    if (isScrub) return;
    if (!autoAdvanced || resultShown) return;
    const t = setTimeout(() => {
      setIsThinking(false);
      setResultShown(true);
    }, 1100);
    return () => clearTimeout(t);
  }, [autoAdvanced, resultShown, isScrub]);

  // Once the result card is shown, wait 1s then fly the second cursor
  // in and press the Add-to-Radar button. radarCursorPhase intentionally
  // out of deps for the same reason as the first cursor effect.
  useEffect(() => {
    if (isScrub) return;
    if (!resultShown || radarAdded) return;
    if (radarCursorPhase !== "hidden") return;
    const t1 = setTimeout(() => setRadarCursorPhase("moving"), 1000);
    const t2 = setTimeout(() => setRadarCursorPhase("pressed"), 1000 + 620);
    const t3 = setTimeout(() => {
      setRadarAdded(true);
      setRadarCursorPhase("done");
      // Tell AnalyzeSection's Monitor view to surface the overdue
      // invoices alert alongside the other 3 radar cards.
      window.dispatchEvent(new CustomEvent("sense-radar-added"));
    }, 1000 + 620 + 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [resultShown, radarAdded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) { setValue(""); adjustHeight(true); }
    }
  };

  // Chips intentionally non-interactive in the hero — they read as
  // recommendations the cursor could pick, but the auto-click sequence
  // owns the path forward.
  void TYPED_AUTO_TOPIC;

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full max-w-[640px] mx-auto space-y-5">
      <div className="w-full">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: isDark ? "rgba(17,17,19,0.75)" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: isDark ? "1.5px solid rgba(232,93,58,0.35)" : "1.5px solid rgba(232,93,58,0.3)",
            boxShadow: isDark
              ? "0 0 0 4px rgba(232,93,58,0.06), 0 0 40px rgba(232,93,58,0.10), 0 20px 60px rgba(0,0,0,0.5)"
              : "0 0 0 4px rgba(232,93,58,0.06), 0 8px 32px rgba(0,0,0,0.08)",
            transition: "all 0.5s",
          }}
        >
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => { setIsTyping(false); setValue(e.target.value); adjustHeight(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask Sense anything..."
              className={cn(
                "w-full px-5 py-4 resize-none bg-transparent border-none text-[15px]",
                "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-[15px] min-h-[80px]",
                isDark ? "text-white placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400"
              )}
              style={{ overflow: "hidden" }}
            />
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" className={cn("text-[13px] transition-colors px-2 py-1", isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600")}>
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button type="button" className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors border",
                isDark ? "text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/60" : "text-zinc-500 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-100/60"
              )}>
                <Mic className="w-3.5 h-3.5" /> Voice
              </button>
              <button
                type="button"
                disabled={isThinking}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all",
                  value.trim() || isThinking
                    ? "bg-[#E85D3A] text-white shadow-[0_0_20px_rgba(232,93,58,0.4)] hover:bg-[#d4522f]"
                    : isDark
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-zinc-200 text-zinc-500 border border-zinc-300"
                )}
                style={{
                  transform: cursorPhase === "pressed" ? "scale(0.96)" : "scale(1)",
                  transition: "transform 180ms cubic-bezier(0.22,1,0.36,1), background 220ms, box-shadow 220ms, color 220ms",
                  opacity: isThinking ? 0.92 : 1,
                  cursor: isThinking ? "default" : undefined,
                }}
              >
                {isThinking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    Thinking…
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className={cn("w-3.5 h-3.5", value.trim() ? "text-white" : isDark ? "text-zinc-500" : "text-zinc-400")} />
                  </>
                )}

                {/* Auto-click cursor — anchored at the button's right edge,
                    flies in from down-right and presses the button. */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "-6px",
                    bottom: "-10px",
                    pointerEvents: "none",
                    opacity: cursorPhase === "moving" || cursorPhase === "pressed" ? 1 : 0,
                    transform:
                      cursorPhase === "hidden"
                        ? "translate(64px, 60px) scale(0.9)"
                        : cursorPhase === "pressed"
                          ? "translate(0, 0) scale(0.88)"
                          : "translate(0, 0) scale(1)",
                    transition:
                      "transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)",
                    filter:
                      "drop-shadow(0 4px 10px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                    willChange: "transform, opacity",
                  }}
                >
                  <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
                    <path
                      d="M3 2.2 L3 19.3 L7.6 15.2 L10.2 21.2 L12.6 20.1 L10 14 L16.4 14 Z"
                      fill="#fff"
                      stroke="#0a0a0a"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {cursorPhase === "pressed" && (
                    <span
                      style={{
                        position: "absolute",
                        left: "-6px",
                        top: "-2px",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.85)",
                        animation: "radar-click-ring 340ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Chips — fade out once the result card slides in. */}
        {!resultShown && (
          <div
            aria-hidden
            className="flex items-center justify-center gap-2 mt-6 flex-wrap"
            style={{ pointerEvents: "none" }}
          >
            {CHIPS.map((c) => (
              <span
                key={c.topic}
                className={cn(
                  "sense-chip px-3.5 py-2 rounded-full text-[12.5px] font-medium whitespace-nowrap select-none",
                  isDark ? "sense-chip-dark text-zinc-300" : "sense-chip-light text-zinc-700"
                )}
              >
                {c.label}
              </span>
            ))}
            <style jsx>{`
              .sense-chip {
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
              }
              .sense-chip-dark {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .sense-chip-light {
                background: rgba(0, 0, 0, 0.03);
                border: 1px solid rgba(0, 0, 0, 0.08);
              }
            `}</style>
          </div>
        )}

        {/* Result card — slides in after the Generate press. One-card
            graph + "Add to Radar" CTA. A second cursor flies in and
            presses the CTA, which then flips to "Added to Radar". */}
        {resultShown && (
          <div
            className="mt-5"
            style={{
              background: isDark ? "rgba(17,17,19,0.78)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
              borderRadius: "16px",
              padding: "18px 20px 16px",
              boxShadow: isDark
                ? "0 24px 60px -16px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.04) inset"
                : "0 16px 48px -12px rgba(0,0,0,0.18)",
              animation: "sense-result-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "rgba(232,93,58,0.14)",
                }}
              >
                <Receipt className="w-3.5 h-3.5" style={{ color: "#E85D3A" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#fafafa" : "#18181b", letterSpacing: "-0.005em" }}>
                  Overdue invoices
                </span>
                <span style={{ fontSize: "11px", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", letterSpacing: "0.02em", textTransform: "uppercase" }}>
                  Last 30 days
                </span>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "11px",
                  color: "#EF4444",
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  fontWeight: 500,
                }}
              >
                4 critical
              </span>
            </div>

            {/* Big number */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em", color: isDark ? "#fafafa" : "#18181b", fontVariantNumeric: "tabular-nums" }}>
                $87,450
              </span>
              <span style={{ fontSize: "12px", color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                across 9 invoices · oldest 47 days
              </span>
            </div>

            {/* Aging bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                { label: "0 – 30 days", pct: 36, value: "$32K", color: "rgba(34,197,94,0.85)" },
                { label: "30 – 60 days", pct: 32, value: "$28K", color: "rgba(245,158,11,0.85)" },
                { label: "60+ days",    pct: 32, value: "$27K", color: "rgba(239,68,68,0.85)" },
              ].map((b, i) => (
                <div key={b.label} style={{ display: "grid", gridTemplateColumns: "92px 1fr 44px", alignItems: "center", gap: "10px", fontSize: "11.5px", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>
                  <span>{b.label}</span>
                  <span style={{ position: "relative", height: "8px", borderRadius: "4px", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                    <span
                      style={{
                        position: "absolute",
                        inset: "0 auto 0 0",
                        width: `${b.pct}%`,
                        background: b.color,
                        borderRadius: "4px",
                        animation: `sense-bar-in 700ms ${120 + i * 90}ms cubic-bezier(0.22,1,0.36,1) both`,
                        transformOrigin: "left center",
                      }}
                    />
                  </span>
                  <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }}>{b.value}</span>
                </div>
              ))}
            </div>

            {/* Add to Radar CTA */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setRadarAdded(true)}
                aria-label={radarAdded ? "Added to Radar" : "Add to Radar"}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px 8px 12px",
                  borderRadius: "999px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.005em",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  border: radarAdded
                    ? "1px solid rgba(34,197,94,0.45)"
                    : "1px solid rgba(232,93,58,0.45)",
                  background: radarAdded
                    ? "rgba(34,197,94,0.12)"
                    : "linear-gradient(180deg, rgba(232,93,58,0.22) 0%, rgba(232,93,58,0.12) 100%)",
                  color: radarAdded ? "#22C55E" : "#FFD7C5",
                  boxShadow: radarAdded
                    ? "0 6px 18px -10px rgba(34,197,94,0.45)"
                    : "0 6px 18px -8px rgba(232,93,58,0.55), inset 0 1px 0 rgba(255,255,255,0.16)",
                  transform: radarCursorPhase === "pressed" ? "scale(0.96)" : "scale(1)",
                  transition:
                    "transform 180ms cubic-bezier(0.22,1,0.36,1), background 260ms, border-color 260ms, color 260ms, box-shadow 260ms",
                }}
              >
                {radarAdded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Added to Radar
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "linear-gradient(180deg, #FF8B65 0%, #E85D3A 100%)",
                        boxShadow: "0 0 0 1px rgba(232,93,58,0.6), 0 0 10px rgba(232,93,58,0.45)",
                      }}
                    >
                      <Zap className="w-3 h-3" style={{ color: "#fff", fill: "#fff" }} />
                    </span>
                    Add to Radar
                  </>
                )}

                {/* Second cursor — flies in from down-right and presses Add to Radar. */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "-6px",
                    bottom: "-10px",
                    pointerEvents: "none",
                    opacity: radarCursorPhase === "moving" || radarCursorPhase === "pressed" ? 1 : 0,
                    transform:
                      radarCursorPhase === "hidden"
                        ? "translate(64px, 60px) scale(0.9)"
                        : radarCursorPhase === "pressed"
                          ? "translate(0, 0) scale(0.88)"
                          : "translate(0, 0) scale(1)",
                    transition:
                      "transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)",
                    filter:
                      "drop-shadow(0 4px 10px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                    willChange: "transform, opacity",
                  }}
                >
                  <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
                    <path
                      d="M3 2.2 L3 19.3 L7.6 15.2 L10.2 21.2 L12.6 20.1 L10 14 L16.4 14 Z"
                      fill="#fff"
                      stroke="#0a0a0a"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {radarCursorPhase === "pressed" && (
                    <span
                      style={{
                        position: "absolute",
                        left: "-6px",
                        top: "-2px",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.85)",
                        animation: "radar-click-ring 340ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </span>
              </button>
            </div>

            <style jsx>{`
              @keyframes sense-result-in {
                from {
                  opacity: 0;
                  transform: translateY(12px) scale(0.985);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              @keyframes sense-bar-in {
                from { transform: scaleX(0); }
                to   { transform: scaleX(1); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
