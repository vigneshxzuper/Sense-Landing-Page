"use client";

import { useEffect, useRef, useState } from "react";
import GradientBlinds from "../GradientBlinds";

const TYPED_TEXT = "Show me my overdue invoices";

export default function HeroSection() {
  const [typedIndex, setTypedIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typedIndex >= TYPED_TEXT.length) return;
    const delay = 60 + Math.random() * 40;
    const t = setTimeout(() => setTypedIndex((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [typedIndex]);

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#09090B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GradientBlinds background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <GradientBlinds />
      </div>

      {/* Eyebrow badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "100px",
          padding: "6px 14px",
          marginBottom: "32px",
          fontSize: "13px",
          color: "#A1A1AA",
          letterSpacing: "0.01em",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#E85D3A",
            boxShadow: "0 0 8px #E85D3A",
            flexShrink: 0,
          }}
        />
        Zuper Sense · Intelligence Layer
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(48px, 8vw, 88px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.0,
          textAlign: "center",
          maxWidth: "800px",
          marginBottom: "24px",
          color: "#FAFAFA",
        }}
      >
        Your business,{" "}
        <span
          style={{
            fontStyle: "italic",
            color: "#E85D3A",
          }}
        >
          finally speaking.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "clamp(16px, 2vw, 19px)",
          color: "#71717A",
          textAlign: "center",
          maxWidth: "560px",
          lineHeight: 1.6,
          marginBottom: "48px",
        }}
      >
        Zuper Sense turns your operational data into plain-English answers — and turns those answers into action.
      </p>

      {/* AI Chat Input Box */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#111113",
          border: "1px solid rgba(232,93,58,0.4)",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 0 40px rgba(232,93,58,0.12), 0 20px 60px rgba(0,0,0,0.5)",
          marginBottom: "20px",
        }}
      >
        {/* Greeting */}
        <div style={{ fontSize: "12px", color: "#52525B", marginBottom: "4px", letterSpacing: "0.02em" }}>
          {greeting}, JT
        </div>
        <div
          style={{
            fontSize: "15px",
            color: "#A1A1AA",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          What would you like to do today?
        </div>

        {/* Input area */}
        <div
          ref={inputRef}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "12px 14px",
            fontSize: "15px",
            color: "#FAFAFA",
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            marginBottom: "16px",
          }}
        >
          <span>{TYPED_TEXT.slice(0, typedIndex)}</span>
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "18px",
              background: "#E85D3A",
              borderRadius: "1px",
              animation: typedIndex >= TYPED_TEXT.length ? "blink 1s step-end infinite" : "none",
              opacity: typedIndex >= TYPED_TEXT.length ? 1 : 1,
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "13px",
              color: "#71717A",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "13px",
              color: "#71717A",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            Voice
          </button>
          <button
            style={{
              background: "#E85D3A",
              border: "none",
              borderRadius: "8px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 0 20px rgba(232,93,58,0.4)",
            }}
          >
            Generate
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Pill suggestions */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "600px",
          marginBottom: "60px",
        }}
      >
        {["Team performance this week", "Why are SLAs slipping?", "Revenue this month"].map((s) => (
          <button
            key={s}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "100px",
              padding: "7px 16px",
              fontSize: "13px",
              color: "#A1A1AA",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#3F3F46",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span>Scroll</span>
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "linear-gradient(to bottom, #3F3F46, transparent)",
            animation: "fadeUp 1.5s ease-in-out infinite alternate",
          }}
        />
      </div>
    </section>
  );
}
