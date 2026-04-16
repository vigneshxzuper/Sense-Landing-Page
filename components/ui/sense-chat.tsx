"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, ArrowRight } from "lucide-react";
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

const TYPED_TEXT = "Show me my overdue invoices";

const CHIPS = [
  { label: "Team performance this week", topic: "performance" },
  { label: "Why are SLAs slipping?", topic: "sla" },
  { label: "Revenue this month", topic: "revenue" },
] as const;

export type AnalyzeTopic = "performance" | "sla" | "revenue" | null;

export function SenseChat() {
  const [value, setValue] = useState("");
  const [typedIndex, setTypedIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 80, maxHeight: 200 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
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
  }, [typedIndex, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) { setValue(""); adjustHeight(true); }
    }
  };

  const handleChipClick = (topic: string) => {
    // Dispatch custom event for AnalyzeSection to pick up
    window.dispatchEvent(new CustomEvent("sense-chip-click", { detail: { topic } }));
    // Scroll to analyze content (below the Ask block)
    const el = document.getElementById("analyze-content");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[640px] mx-auto space-y-5">
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
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all",
                  value.trim()
                    ? "bg-[#E85D3A] text-white shadow-[0_0_20px_rgba(232,93,58,0.4)] hover:bg-[#d4522f]"
                    : isDark
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-zinc-200 text-zinc-500 border border-zinc-300"
                )}
              >
                Generate
                <ArrowRight className={cn("w-3.5 h-3.5", value.trim() ? "text-white" : isDark ? "text-zinc-500" : "text-zinc-400")} />
              </button>
            </div>
          </div>
        </div>

        {/* Chips */}
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          {CHIPS.map((c) => (
            <button
              key={c.topic}
              type="button"
              onClick={() => handleChipClick(c.topic)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer",
                "text-zinc-800 hover:text-zinc-900"
              )}
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.95)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
