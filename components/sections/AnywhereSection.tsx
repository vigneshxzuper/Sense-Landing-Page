"use client";

/**
 * AnywhereSection — "Anywhere in Zuper"
 * Pinned scroll-stack of 10 product screenshots. As the user scrolls, each
 * card fades + scales in over the previous one and the previous card slides
 * up/scales down behind it. The whole section pins for ~1000vh so each
 * card has ~100vh of dwell.
 */

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// 8 chat-thread screenshots spanning chart types — single stat, bar,
// line, table — so the deck visually changes shape on each transition.
const CARDS = [
  { src: "/assets/anywhere/n01.png", caption: "How many new customers were added in the last 3 months?" },
  { src: "/assets/anywhere/n02.png", caption: "Show me customers by city for the last 6 months" },
  { src: "/assets/anywhere/n03.png", caption: "Profit margin by quarter 2025" },
  { src: "/assets/anywhere/n04.png", caption: "Show me unassigned jobs this week" },
  { src: "/assets/anywhere/n05.png", caption: "Show me total invoice revenue by month for 2025" },
  { src: "/assets/anywhere/n06.png", caption: "What is our estimate to job conversion rate for 2025" },
  { src: "/assets/anywhere/n07.png", caption: "Show me new users added by month for 2025" },
  { src: "/assets/anywhere/n08.png", caption: "Average profit per job per technician for the last 6 months" },
];

export default function AnywhereSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${CARDS.length * 70}%`,
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Stack-accumulation poses. As the user scrolls, each new card
      // lands on TOP and previous cards stay visible behind, peeking out
      // as a deck. Slots:
      //   TOP    — current card, centred, full size
      //   BACK_1 — one card back, slightly lower + smaller
      //   BACK_2 — two cards back
      //   BACK_3 — three cards back
      //   RETIRED — fades out beyond BACK_3 (sinks below)
      //   HIDDEN — waiting offscreen below
      const TOP    = { scale: 1.0,  yPercent: 0,   opacity: 1, rotation: 0 };
      const BACK_1 = { scale: 0.96, yPercent: 5,   opacity: 1, rotation: 0 };
      const BACK_2 = { scale: 0.92, yPercent: 10,  opacity: 1, rotation: 0 };
      const BACK_3 = { scale: 0.88, yPercent: 15,  opacity: 0.85, rotation: 0 };
      const RETIRED= { scale: 0.86, yPercent: 22,  opacity: 0,    rotation: 0 };
      const HIDDEN = { scale: 0.94, yPercent: 110, opacity: 1,    rotation: 0 };

      // Initial: card 0 at TOP, the rest waiting below.
      // zIndex ascends with i so each new arrival lands ABOVE every
      // previously-shown card.
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const pose = i === 0 ? TOP : HIDDEN;
        gsap.set(el, {
          ...pose,
          zIndex: i,
          force3D: true,
          transformOrigin: "center center",
        });
      });

      // Transition i → i+1: every visible card shifts back one slot in
      // the deck while card i+1 rises from HIDDEN to TOP. All five
      // tweens fire on the same timeline beat → reads as one continuous
      // accumulating motion.
      cardRefs.current.forEach((_, i) => {
        if (i === 0) return;
        const t = i - 1;
        const arriving = cardRefs.current[i];
        const back1    = cardRefs.current[i - 1];
        const back2    = cardRefs.current[i - 2];
        const back3    = cardRefs.current[i - 3];
        const retiring = cardRefs.current[i - 4];

        if (arriving) tl.to(arriving, { ...TOP,     ease: "power2.inOut", duration: 1 }, t);
        if (back1)    tl.to(back1,    { ...BACK_1,  ease: "power2.inOut", duration: 1 }, t);
        if (back2)    tl.to(back2,    { ...BACK_2,  ease: "power2.inOut", duration: 1 }, t);
        if (back3)    tl.to(back3,    { ...BACK_3,  ease: "power2.inOut", duration: 1 }, t);
        if (retiring) tl.to(retiring, { ...RETIRED, ease: "power2.inOut", duration: 1 }, t);
      });
    },
    { scope: sectionRef }
  );

  return (
    <>
      {/* Intro band — title scrolls past normally, never overlaps the deck */}
      <section
        style={{
          background: "var(--bg)",
          padding: "120px 24px 60px",
          textAlign: "center",
        }}
        aria-label="Anywhere in Zuper intro"
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
          Anywhere in Zuper
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: "0 auto",
            maxWidth: "820px",
          }}
        >
          See everything Sense can do.
        </h2>
      </section>

      {/* Pinned card stage — purely the deck, no title overlap */}
      <section
        ref={sectionRef}
        data-no-snap
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "var(--bg)",
        }}
        aria-label="Anywhere in Zuper"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5vw",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(960px, 74vw)",
              aspectRatio: "2000 / 1152",
              maxHeight: "68vh",
            }}
          >
            {CARDS.map((card, i) => {
              // Cycle through six wallpaper-style backplates so adjacent
              // cards don't share the same hue.
              const bgKey = ["e", "f", "g", "h", "i", "j"][i % 6];
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: [
                      "0 50px 120px -36px rgba(0,0,0,0.85)",
                      "0 20px 56px -22px rgba(0,0,0,0.65)",
                      "0 0 0 1px rgba(255,255,255,0.04)",
                      "inset 0 1.5px 0 rgba(255,255,255,0.32)",
                      "inset 0 -1px 0 rgba(0,0,0,0.45)",
                      "inset 1px 0 0 rgba(255,255,255,0.08)",
                      "inset -1px 0 0 rgba(255,255,255,0.08)",
                    ].join(", "),
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    background: "rgba(18,18,22,0.6)",
                  }}
                >
                  {/* Gradient backplate — cycles bg-e..j across cards */}
                  <Image
                    src={`/assets/anywhere/bg-${bgKey}.png`}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 74vw, 960px"
                    priority={i < 2}
                    style={{ objectFit: "cover" }}
                  />

                  {/* Glass-frame highlight — subtle inner gradient that
                      reads as a chrome ring around the inner card. */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "14px",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 82%, rgba(0,0,0,0.18) 100%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Inner frame — Mac dark-mode window: chrome title bar
                      with traffic lights + URL pill on top, screenshot
                      below. No stroke around the inner frame. */}
                  <div
                    style={{
                      position: "absolute",
                      inset: "2%",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: [
                        "0 28px 70px -22px rgba(0,0,0,0.75)",
                        "0 10px 28px -12px rgba(0,0,0,0.55)",
                      ].join(", "),
                      background: "#1a1a1d",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* macOS dark title bar */}
                    <div
                      style={{
                        position: "relative",
                        flex: "0 0 auto",
                        height: "34px",
                        background: "#1d1d20",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                      }}
                    >
                      {/* Traffic lights — macOS canonical colours */}
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F56" }} />
                        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
                        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27C93F" }} />
                      </div>
                      {/* URL pill — centered */}
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "min(220px, 38%)",
                          height: "18px",
                          borderRadius: "9px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      />
                    </div>
                    {/* Screenshot area */}
                    <div style={{ position: "relative", flex: "1 1 auto", background: "#ffffff" }}>
                      <Image
                        src={card.src}
                        alt={card.caption}
                        fill
                        sizes="(max-width: 960px) 70vw, 900px"
                        priority={i < 2}
                        style={{ objectFit: "contain", objectPosition: "center" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div
          ref={captionRef}
          style={{
            position: "absolute",
            bottom: "4vh",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "6px",
            zIndex: 5,
          }}
        >
          {CARDS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "22px",
                height: "3px",
                borderRadius: "2px",
                background: "var(--card-border)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
