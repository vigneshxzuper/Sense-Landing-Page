"use client";

/**
 * HeroScrollAnimation
 * Layered scroll-driven reveal:
 *   z0 — bg.png        (landscape, fills viewport — final reveal)
 *   z1 — file.png      (paper stacks, contained at natural aspect so the
 *                       transparent canvas around the stacks lets bg show
 *                       through; slides DOWN behind the desk on scroll)
 *   z2 — computer.png  (desk + computer + plant, contained at natural
 *                       aspect — no zoom — and masks the file layer as it
 *                       sinks beneath the desk surface)
 *
 * file.png and computer.png share the same 1448×1086 canvas, so using
 * `objectFit: contain` on both keeps them pixel-registered against each
 * other while letting bg.png show through their transparent regions.
 *
 * Smoothness: long pin (400vh) + `scrub: 1.5` make the slide feel slow
 * and floaty; `ease: "none"` keeps the mapping linear inside the lerp.
 */

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Subtle "paper crumble" feel on the file layer:
//   • single layer translates down (no strip seams)
//   • SVG fractal-noise turbulence + displacement filter gradually warps
//     the pixels as it falls, simulating crinkled paper
//   • micro skew + rotation through the fall add a little physicality
//     without making the layer feel chaotic
// All driven by one ScrollTrigger via a master timeline so the pin and
// scrub stay in sync.
// Monitor screen center within the 1448×1086 computer.png canvas — used
// as the transform origin when zooming into the screen.
//   measured: black-screen center at (49.8%, 35.9%) of canvas
// After cover-scaling + computer's `objectPosition: center 18%` +
// `scale(1.04)`, the screen center sits at roughly (50%, 41%) of the
// viewport. Tune ZOOM_ORIGIN if monitor visibly drifts off-center while
// zooming.
const ZOOM_ORIGIN = "50% 41%";
// Final zoom factor — just enough that the black screen fills viewport
// on common 16:9 / 16:10 / 4:3 displays. Bigger = more wasted "all-black"
// scroll at the tail.
const ZOOM_END = 4;

export default function HeroScrollAnimation() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const fileLayerRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          // Phase 1 (file slide) + Phase 2 (zoom) + Phase 3 (full-black
          // hold). Total = 500vh: 400vh for the animated phases, then an
          // extra 100vh of "stay on the black screen with the CRT text"
          // before the pin releases and the next section starts.
          end: "+=500%",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(fileLayerRef.current, {
        yPercent: -6,
        rotation: 0,
        skewX: 0,
        force3D: true,
      });
      gsap.set(sceneRef.current, {
        scale: 1,
        transformOrigin: ZOOM_ORIGIN,
        force3D: true,
      });

      // ── Phase 1 (t=0..1): files crumble + slide down behind the desk
      tl.to(
        fileLayerRef.current,
        {
          yPercent: 112,
          rotation: 0.4,
          skewX: -0.35,
          scale: 0.992,
          ease: "none",
          duration: 1,
        },
        0
      ).to(
        displaceRef.current,
        {
          attr: { scale: 8 },
          ease: "power1.in",
          duration: 1,
        },
        0
      );

      // ── Phase 2: zoom into the monitor until black fills view.
      // Starts at t=0.5 (file halfway down) and ENDS at t=1.0 — same
      // moment the slide ends — so the pin releases right when black
      // covers viewport, with no trailing all-black scroll.
      // power1.in keeps the curve mild so zoom hits full-black close to
      // the end, not before it.
      tl.to(
        sceneRef.current,
        {
          scale: ZOOM_END,
          ease: "power1.in",
          duration: 0.5,
        },
        0.5
      );

      // CRT text — single element. Starts on the monitor screen (at the
      // same 41% Y as the screen rect) sized to fit, then drifts to
      // viewport center + grows as the scene zooms in. Lives outside
      // sceneRef so it can settle at viewport center (50%, 50%) instead
      // of riding the zoom origin to (50%, 41%).
      //
      // For a seamless feel the text uses the SAME timing window AND ease
      // (power1.in) as the scene zoom — its growth tracks the monitor's
      // growth so the message looks anchored to the screen surface.
      gsap.set(textRef.current, {
        opacity: 1,
        scale: 0.28,
        xPercent: -50,
        yPercent: -50,
        top: "41%",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        textRef.current,
        {
          scale: 1.1,
          top: "50%",
          ease: "power1.in",
          duration: 0.5,
        },
        0.5
      );

      // Phase 3 — empty hold tween. Adds 0.25 timeline units of "nothing
      // animates" after the zoom completes. With end:+=500% mapping a
      // 1.25-unit timeline to scroll, each unit ≈ 400vh, so this hold
      // takes the final 100vh of pinned scroll on the black screen.
      tl.to({}, { duration: 0.25 }, 1);
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      data-no-snap
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
      aria-label="Hero scroll animation"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {/* Scene wrapper — bg + file + computer. Phase 2 scales this whole
            group around the monitor screen center to zoom INTO the screen. */}
        <div
          ref={sceneRef}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform",
          }}
        >
        {/* z0 — landscape backdrop (covers viewport) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* SVG filter — fractal turbulence + displacement creates organic
            paper-crinkle warp on the file layer. Scale animates 0 → 8 over
            the fall via the timeline. Defined once, hidden, off-flow. */}
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <filter
              id="paperCrumble"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.024"
                numOctaves={2}
                seed={4}
                result="noise"
              />
              <feDisplacementMap
                ref={displaceRef}
                in="SourceGraphic"
                in2="noise"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* z1 — file stacks (slides down behind computer with crumble warp) */}
        <div
          ref={fileLayerRef}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            willChange: "transform, filter",
            filter: "url(#paperCrumble)",
            transformOrigin: "center top",
          }}
        >
          <Image
            src="/file.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* z2 — computer + desk (edge-to-edge; masks file layer).
            Slight scale-up pushes computer.png's thin transparent margins
            off-screen so desk reads edge-to-edge with no bg leak. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            transform: "scale(1.04)",
            transformOrigin: "center center",
          }}
        >
          <Image
            src="/computer.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 18%" }}
          />
        </div>


        </div>

        {/* CRT screen text — sits OUTSIDE the zooming scene so it stays
            anchored to viewport center as the monitor fills the screen.
            Driven by ScrollTrigger so it fades + scales in during zoom. */}
        <div
          ref={textRef}
          className="crt-glitch"
          style={{
            position: "absolute",
            left: "50%",
            top: "41%",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 1,
            width: "min(82vw, 1080px)",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(28px, 5.2vw, 80px)",
            lineHeight: 1.4,
            textAlign: "center",
            color: "#FF9F4A",
            textShadow:
              "0 0 10px rgba(255,159,74,0.7), 0 0 24px rgba(255,90,30,0.45), 0 0 48px rgba(255,90,30,0.25)",
            letterSpacing: "0.04em",
            willChange: "opacity, transform",
          }}
        >
          Still working like it&apos;s the past?
        </div>
      </div>
    </section>
  );
}
