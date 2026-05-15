"use client";

import TypewriterOnce from "@/components/TypewriterOnce";
import RollText from "@/components/RollText";

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
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { GradientBlindsProps } from "./GradientBlinds";

const GradientBlinds = dynamic<GradientBlindsProps>(
  () =>
    import("./GradientBlinds").then(
      (m) => m.default as ComponentType<GradientBlindsProps>
    ),
  { ssr: false }
);

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
//
// Modern laptop's screen now sits at ~51% Y after the objectPosition
// shift that aligns it with the retro CRT layout. Phase 2 zoom anchors
// here so it pushes INTO the laptop screen, not past it.
const ZOOM_ORIGIN = "50% 51%";
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
  // Modern-laptop swap layer (sits over the retro computer) +
  // dedicated displacement node for the glitch warp during the swap.
  const computerModernRef = useRef<HTMLDivElement>(null);
  const computerRetroRef = useRef<HTMLDivElement>(null);
  const swapDisplaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const swapTurbRef = useRef<SVGFETurbulenceElement>(null);
  const swapRedOffsetRef = useRef<SVGFEOffsetElement>(null);
  const swapBlueOffsetRef = useRef<SVGFEOffsetElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const futureTextRef = useRef<HTMLDivElement>(null);
  const blindsBgRef = useRef<HTMLDivElement>(null);
  const swapFlashRef = useRef<HTMLDivElement>(null);
  const swapFxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          // Tight scroll budget: file slide (~half a viewport) → swap
          // kicks in once files clear half-screen → zoom → static-hero
          // dissolve. Total = 300vh.
          end: "+=300%",
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

      // ── Phase 1: files crumble + slide down behind the desk.
      // Drops over 0..0.22 (~66vh of pinned scroll). `power3.out` (≈
      // easeOutQuart, the cubic-bezier(0.22, 1, 0.36, 1) curve) gives
      // the stack a confident initial push then a graceful settle into
      // the desk — much smoother than the prior linear ramp.
      tl.to(
        fileLayerRef.current,
        {
          yPercent: 112,
          rotation: 0.4,
          skewX: -0.35,
          scale: 0.992,
          duration: 0.22,
        },
        0
      ).to(
        displaceRef.current,
        {
          attr: { scale: 8 },
          duration: 0.22,
        },
        0
      );

      // ── Phase 2: zoom into the monitor until black fills view.
      // Picks up immediately after the swap (0.30) so there's no dead
      // scroll between the laptop appearing and the push-in starting.
      tl.to(
        sceneRef.current,
        {
          scale: ZOOM_END,
          ease: "power1.in",
          duration: 0.55,
        },
        0.30
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
      // Retro CRT text — sits dead-centre on the retro monitor's screen
      // (viewport y ≈ 41%). Rides the zoom from small-on-screen to
      // viewport-centre as the scene scales in.
      gsap.set(textRef.current, {
        opacity: 1,
        scale: 0.28,
        xPercent: -50,
        yPercent: -50,
        top: "calc(18vh + max(17.9vh, 13.425vw) - 7vh + 10px)",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        textRef.current,
        {
          scale: 1.1,
          top: "50%",
          ease: "power2.inOut",
          duration: 0.55,
        },
        0.30
      );

      // Sub-text — green CLI prompt, sits near the bottom of the
      // monitor's screen (viewport y ≈ 58%). Same scale + position
      // animation as the orange line so they rise together as the
      // zoom kicks in, but as a separate element so it can be far
      // from the orange block within the screen.
      gsap.set(subTextRef.current, {
        opacity: 1,
        scale: 0.28,
        xPercent: -50,
        yPercent: -50,
        top: "calc(18vh + max(17.9vh, 13.425vw) + 7vh + 10px)",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        subTextRef.current,
        {
          scale: 1.1,
          top: "50%",
          ease: "power2.inOut",
          duration: 0.55,
        },
        0.30
      );

      // Sub-text follows the orange line out at swap time.
      tl.to(subTextRef.current, { opacity: 0, ease: "power2.in", duration: 0.05 }, 0.17);

      // Future text — appears on the new laptop's screen (viewport
      // ~49% Y, the visible centre of the laptop's display rect), then
      // drifts up to viewport centre (50% Y) as the scene zooms in.
      // Initial scale 0.42 keeps the content readable on the screen
      // before zoom; final scale 1.0 lands it at full hero size.
      gsap.set(futureTextRef.current, {
        opacity: 0,
        scale: 0.42,
        xPercent: -50,
        yPercent: -50,
        top: "49%",
        left: "50%",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        futureTextRef.current,
        {
          scale: 1,
          // 47% — centred on the laptop screen instead of the viewport.
          // With the modern image at objectPosition Y=46%, the laptop's
          // open display centres around viewport y ≈ 48%, so anchoring
          // the block (badge → headline → subhead → CTAs) here leaves
          // equal breathing room above and below it inside the screen
          // rectangle.
          top: "47%",
          ease: "power2.inOut",
          duration: 0.55,
        },
        0.30
      );

      // ── Computer model swap (retro → modern MacBook).
      // Starts at t=0.10 — the moment the file stack passes the half-
      // screen mark — and overlaps the tail of the file slide so the
      // laptop appears the instant the desk is clear. Tight window
      // (0.10 → 0.30) keeps it as a decisive flip; sine.inOut crossfade
      // spans the full window so even slow inch-by-inch scrubbing reads
      // as a continuous wipe.
      gsap.set(computerModernRef.current, { opacity: 0, force3D: true });
      gsap.set(computerRetroRef.current,  { opacity: 1, force3D: true });
      gsap.set(swapDisplaceRef.current, { attr: { scale: 0 } });
      gsap.set(swapRedOffsetRef.current,  { attr: { dx: 0 } });
      gsap.set(swapBlueOffsetRef.current, { attr: { dx: 0 } });
      gsap.set(swapFlashRef.current, { opacity: 0, force3D: true });

      // Wider, calmer swap window — biased toward a clean crossfade with
      // only a whisper of glitch instead of an RGB-tear crescendo. This
      // makes the retro → futuristic handoff feel seamless.
      const SWAP_START = 0.06;
      const SWAP_PEAK  = 0.20; // glitch crescendo + crossfade midpoint
      const SWAP_END   = 0.34;

      // Subtle stripe-tear — short crescendo, fast decay; max scale 8
      // (was 36) so the displacement reads as a soft shimmer rather than
      // a hard tear.
      tl.to(swapDisplaceRef.current, { attr: { scale: 8 }, ease: "power2.in",  duration: SWAP_PEAK - SWAP_START }, SWAP_START);
      tl.to(swapDisplaceRef.current, { attr: { scale: 0 }, ease: "power3.out", duration: SWAP_END  - SWAP_PEAK  }, SWAP_PEAK);

      tl.to(swapTurbRef.current, { attr: { baseFrequency: "0.0001 0.85" }, ease: "power2.in",  duration: SWAP_PEAK - SWAP_START }, SWAP_START);
      tl.to(swapTurbRef.current, { attr: { baseFrequency: "0.0001 0.65" }, ease: "power3.out", duration: SWAP_END  - SWAP_PEAK  }, SWAP_PEAK);

      // Whisper of chromatic split — max dx 2 (was 9). Reads as a faint
      // chromatic shimmer at the peak instead of a visible RGB break.
      tl.to(swapRedOffsetRef.current,  { attr: { dx: 2  }, ease: "power2.in",  duration: SWAP_PEAK - SWAP_START }, SWAP_START);
      tl.to(swapBlueOffsetRef.current, { attr: { dx: -2 }, ease: "power2.in",  duration: SWAP_PEAK - SWAP_START }, SWAP_START);
      tl.to(swapRedOffsetRef.current,  { attr: { dx: 0  }, ease: "power3.out", duration: SWAP_END  - SWAP_PEAK  }, SWAP_PEAK);
      tl.to(swapBlueOffsetRef.current, { attr: { dx: 0  }, ease: "power3.out", duration: SWAP_END  - SWAP_PEAK  }, SWAP_PEAK);

      // Soft flash — opacity peak dropped to 0.22 so the screen warms
      // toward the new palette without washing out completely.
      tl.to(swapFlashRef.current, { opacity: 0.22, ease: "power2.in",  duration: SWAP_PEAK - SWAP_START - 0.02 }, SWAP_START + 0.02);
      tl.to(swapFlashRef.current, { opacity: 0,    ease: "power2.out", duration: SWAP_END  - SWAP_PEAK  + 0.02 }, SWAP_PEAK);

      // Long sine-ease crossfade over the entire (wider) swap window.
      // The new image arrives gradually so the swap reads as the scene
      // dissolving forward in time rather than a jump cut.
      tl.to(computerRetroRef.current,  { opacity: 0, ease: "sine.inOut", duration: SWAP_END - SWAP_START }, SWAP_START);
      tl.to(computerModernRef.current, { opacity: 1, ease: "sine.inOut", duration: SWAP_END - SWAP_START }, SWAP_START);

      // Text crossfade — retro fades out gently on the up-ramp, future
      // fades in on the down-ramp so neither pops in/out abruptly.
      tl.to(textRef.current,       { opacity: 0, ease: "sine.inOut", duration: 0.10 }, SWAP_PEAK - 0.08);
      tl.to(futureTextRef.current, { opacity: 1, ease: "sine.inOut", duration: 0.10 }, SWAP_PEAK + 0.02);
      // Gradient blinds bg only fades in AFTER the laptop zoom finishes
      // (zoom: 0.30 + 0.55 = 0.85). No scale anim — it's a fullscreen
      // backdrop that arrives once the headline has locked into place.
      gsap.set(blindsBgRef.current, { opacity: 0, force3D: true });
      tl.to(blindsBgRef.current, { opacity: 1, ease: "power2.out", duration: 0.10 }, 0.86);

      // Pad timeline tail so scroll budget isn't truncated.
      tl.to({}, { duration: 0.01 }, 1);
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
        {/* Swap-fx wrapper — applies the computerSwap filter to the
            ENTIRE scene + retro/future text during the swap window so
            the RGB-split + horizontal-tear glitch hits the whole frame,
            not just the computer. The static-hero overlay sits OUTSIDE
            this wrapper so it isn't filtered. */}
        <div
          ref={swapFxRef}
          style={{
            position: "absolute",
            inset: 0,
            filter: "url(#computerSwap)",
            willChange: "filter",
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

            {/* Swap glitch filter — fires only during the retro→modern
                crossfade. Two stages chained:
                  1. Per-row turbulence + displacement → horizontal stripe
                     tear (sharp digital bands shifting in unison)
                  2. RGB channel separation → red shifted right, blue
                     shifted left, green untouched. Reads as chromatic
                     aberration / signal misalignment.
                Both stages animate during the swap window via GSAP. */}
            <filter
              id="computerSwap"
              x="-8%"
              y="-8%"
              width="116%"
              height="116%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                ref={swapTurbRef}
                type="turbulence"
                baseFrequency="0.0001 0.65"
                numOctaves={1}
                seed={11}
                result="swapNoise"
              />
              <feDisplacementMap
                ref={swapDisplaceRef}
                in="SourceGraphic"
                in2="swapNoise"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />

              {/* RGB channel separation. Each layer keeps alpha=1
                  (opaque) and contains only one colour channel. We then
                  recombine via feComposite operator="arithmetic" with
                  k2=1 k3=1 — pure additive summation per pixel, which
                  is a perfect identity when the offsets are zero (so
                  the original image colour is unchanged at rest). */}
              <feColorMatrix
                in="displaced"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="redOnly"
              />
              <feOffset ref={swapRedOffsetRef} in="redOnly" dx="0" dy="0" result="redShifted" />

              <feColorMatrix
                in="displaced"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="greenOnly"
              />

              <feColorMatrix
                in="displaced"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blueOnly"
              />
              <feOffset ref={swapBlueOffsetRef} in="blueOnly" dx="0" dy="0" result="blueShifted" />

              <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="redShifted" in2="greenOnly" result="rg" />
              <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="rg" in2="blueShifted" />
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

        {/* z2 — computer + desk. Two stacked layers (retro + modern) share
            this wrapper. The glitch displacement filter is applied here so
            both layers warp identically during the swap, masking the
            crossfade. */}
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
          {/* Retro red CRT computer (initial state) */}
          <div
            ref={computerRetroRef}
            style={{
              position: "absolute",
              inset: 0,
              willChange: "opacity",
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

          {/* Futuristic workspace (post-swap state). Same 1448×1086
              canvas as retro, with the back-of-desk line sitting around
              ~60% of this image's canvas (vs ~58% in retro). With
              objectPosition Y=22% the desk's back edge and the laptop /
              plant / cup row register at viewport positions close to
              their retro counterparts, so the crossfade dissolves the
              horizon roughly in place. */}
          <div
            ref={computerModernRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              willChange: "opacity",
            }}
          >
            <Image
              src="/computer-modern.png"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 60%" }}
            />
          </div>

          {/* Swap flash — soft luminous wash at the glitch peak, tinted
              toward the new scene's cyan/cool palette so the wash itself
              previews the destination instead of cutting through neutral
              white. */}
          <div
            ref={swapFlashRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 90% 80% at center, rgba(220,240,255,0.85) 0%, rgba(160,210,255,0.55) 35%, rgba(80,120,200,0.22) 65%, rgba(0,0,0,0) 95%)",
              mixBlendMode: "screen",
              willChange: "opacity",
            }}
          />

        </div>


        </div>

        {/* Retro CRT amber line — centred on the monitor's screen,
            split into 3 short blocks so each line fits inside the CRT
            screen rect at every viewport ratio. */}
        <div
          ref={textRef}
          className="crt-glitch"
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(18vh + max(17.9vh, 13.425vw) - 7vh + 10px)",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 1,
            width: "min(70vw, 880px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(32px, 5.8vw, 92px)",
            lineHeight: 1.45,
            textAlign: "center",
            color: "#FF9F4A",
            textShadow:
              "0 0 10px rgba(255,159,74,0.7), 0 0 24px rgba(255,90,30,0.45), 0 0 48px rgba(255,90,30,0.25)",
            letterSpacing: "0.02em",
            willChange: "opacity, transform",
          }}
        >
          <TypewriterOnce
            lines={["Running on", "vintage tools?"]}
            startDelayMs={350}
            typeMs={1500}
          />
        </div>

        {/* Matrix-green CLI prompt — sits below the orange block, near
            the bottom of the monitor's screen. Same Press Start 2P,
            terminal-green colour palette. */}
        <div
          ref={subTextRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(18vh + max(17.9vh, 13.425vw) + 7vh + 10px)",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 1,
            width: "min(70vw, 880px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(22px, 3.4vw, 48px)",
            lineHeight: 1.45,
            textAlign: "center",
            color: "#34F26B",
            textShadow:
              "0 0 10px rgba(52,242,107,0.75), 0 0 22px rgba(0,200,80,0.5), 0 0 44px rgba(0,150,60,0.28)",
            letterSpacing: "0.06em",
            willChange: "opacity, transform",
          }}
        >
          <TypewriterOnce
            lines={["> Scroll to activate", "the sixth sense."]}
            startDelayMs={2050}
            typeMs={1300}
          />
        </div>

        {/* Gradient blinds backdrop — starts at 25% scale around the
            laptop screen so it reads as content INSIDE the screen, then
            expands to fullscreen during the scene zoom. zIndex 5 keeps
            it below futureText (zIndex 6). */}
        <div
          ref={blindsBgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "6px",
            zIndex: 5,
            pointerEvents: "none",
            opacity: 0,
            willChange: "opacity, transform",
            maskImage:
              "linear-gradient(180deg, #000 0%, #000 96%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0%, #000 96%, rgba(0,0,0,0) 100%)",
          }}
        >
          <GradientBlinds
            gradientColors={["#FD8627", "#EA0602"]}
            angle={180}
            noise={0.15}
            blindCount={26}
            blindMinWidth={40}
            spotlightRadius={0.55}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            staticFrame
          />
        </div>

        {/* Future content — a scaled-down preview of the static hero
            (badge + headline + subhead + CTA pair) painted onto the
            modern laptop screen after the glitch swap. As the scene
            zooms in, this composition grows with it, so by the time the
            pin releases the preview reads as the real hero. Decorative
            only — the live HeroSectionStatic dissolves on top in phase 3. */}
        <div
          ref={futureTextRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "51%",
            zIndex: 6,
            pointerEvents: "none",
            opacity: 0,
            width: "min(94vw, 1280px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            color: "#FFFFFF",
            willChange: "opacity, transform",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              marginBottom: "24px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              background: "rgba(10,10,12,0.65)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Zuper Sense
          </div>
          <h2
            style={{
              fontSize: "clamp(40px, 5.4vw, 76px)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "20px",
              width: "100%",
              maxWidth: "1100px",
              color: "#FFFFFF",
              fontFeatureSettings: '"ss01", "cv11"',
              textAlign: "center",
            }}
          >
            The intelligent command center
            <br />
            for your roofing business.
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 20px",
              marginBottom: "18px",
              fontSize: "clamp(13px, 1.3vw, 16px)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {["Monitor.", "Analyze.", "Predict.", "Recommend.", "Act."].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.5,
              fontWeight: 450,
              maxWidth: "40rem",
              margin: 0,
              marginBottom: "32px",
            }}
          >
            Sense watches your business so you don&apos;t have to, catches what&apos;s about to break, and tells you what to do next.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", pointerEvents: "auto" }}>
            {[
              {
                label: "Try Sense",
                href: "#analyze-section",
                primary: true,
              },
              {
                label: "Watch the demo",
                href: "#docs-section",
                primary: false,
              },
            ].map((btn) => (
              <div
                key={btn.label}
                className={btn.primary ? "hero-cta-anim btn-roll btn-glow-primary" : "hero-cta-anim btn-roll btn-glow-secondary"}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  borderRadius: "999px",
                  padding: "1.5px",
                  boxShadow: btn.primary
                    ? "0 6px 24px rgba(232,93,58,0.25), 0 2px 8px rgba(0,0,0,0.3)"
                    : "none",
                  transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s",
                }}
              >
                <a
                  href={btn.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(btn.href)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "999px",
                    background: btn.primary ? "#ffffff" : "rgba(20,20,20,0.9)",
                    color: btn.primary ? "#111" : "rgba(255,255,255,0.92)",
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    textDecoration: "none",
                  }}
                >
                  <RollText>{btn.label}</RollText>
                </a>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
    </section>
  );
}
