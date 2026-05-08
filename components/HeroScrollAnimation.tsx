"use client";

import HeroSectionStatic from "@/components/sections/HeroSectionStatic";
import TypewriterLoop from "@/components/TypewriterLoop";

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

import { useRef, useState } from "react";
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
  const swapFlashRef = useRef<HTMLDivElement>(null);
  const swapFxRef = useRef<HTMLDivElement>(null);
  const staticHeroRef = useRef<HTMLDivElement>(null);
  const [staticHeroBooted, setStaticHeroBooted] = useState(false);

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
      // Retro CRT text — sits dead-centre on the retro monitor's screen
      // (viewport y ≈ 41%). Rides the zoom from small-on-screen to
      // viewport-centre as the scene scales in.
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
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.5
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
        top: "calc(58% - 40px)",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        subTextRef.current,
        {
          scale: 1.1,
          top: "calc(62% - 40px)",
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.5
      );

      // Sub-text follows the orange line out at swap time.
      tl.to(subTextRef.current, { opacity: 0, ease: "power2.in", duration: 0.05 }, 0.42);

      // Future text — appears on the new laptop's screen (viewport
      // ~62% Y), then drifts up to viewport centre (50% Y) as the
      // scene zooms in. Same easing as the retro lines so the rise
      // feels uniform across the whole pin.
      gsap.set(futureTextRef.current, {
        opacity: 0,
        scale: 0.32,
        xPercent: -50,
        yPercent: -50,
        top: "51%",
        transformOrigin: "center center",
        force3D: true,
      });
      tl.to(
        futureTextRef.current,
        {
          scale: 1.1,
          top: "50%",
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.5
      );

      // ── Computer model swap (retro → modern MacBook).
      // Plays inside Phase 1 once the files have mostly drained out, so
      // the swap is staged on a clean desk and the user actually sees
      // the new laptop *before* Phase 2 zoom starts.
      //
      // Glitch design: horizontal-stripe digital tear (sharp, machine-
      // cut bands shifting in unison) — NOT fluid turbulence — plus a
      // single cyan scan-line sweeping top→bottom. Reads as a system
      // hard-cutting between two states, not water rippling.
      //
      // Window: t = 0.36 → 0.50 (~140 ms of timeline / ~56vh of pinned
      // scroll). On-screen text crossfades in the same window from the
      // retro CRT line to the cyan future line.
      gsap.set(computerModernRef.current, { opacity: 0, force3D: true });
      gsap.set(computerRetroRef.current,  { opacity: 1, force3D: true });
      gsap.set(swapDisplaceRef.current, { attr: { scale: 0 } });
      gsap.set(swapRedOffsetRef.current,  { attr: { dx: 0 } });
      gsap.set(swapBlueOffsetRef.current, { attr: { dx: 0 } });
      gsap.set(swapFlashRef.current, { opacity: 0, force3D: true });

      // Stripe-tear amplitude crescendo + decay.
      tl.to(swapDisplaceRef.current, { attr: { scale: 36 }, ease: "power3.in",  duration: 0.10 }, 0.36);
      tl.to(swapDisplaceRef.current, { attr: { scale: 0 },  ease: "power4.out", duration: 0.10 }, 0.46);

      tl.to(swapTurbRef.current, { attr: { baseFrequency: "0.0001 1.05" }, ease: "power3.in",  duration: 0.10 }, 0.36);
      tl.to(swapTurbRef.current, { attr: { baseFrequency: "0.0001 0.65" }, ease: "power4.out", duration: 0.10 }, 0.46);

      // RGB chromatic split — red drifts right, blue drifts left,
      // green stays anchored. Animation matches the displacement
      // window: build at the same beat (so both effects peak together)
      // and decay together. Peak ±9px is enough to read as channel
      // misalignment without dissolving recognisable forms.
      tl.to(swapRedOffsetRef.current,  { attr: { dx: 9  }, ease: "power3.in",  duration: 0.10 }, 0.36);
      tl.to(swapBlueOffsetRef.current, { attr: { dx: -9 }, ease: "power3.in",  duration: 0.10 }, 0.36);
      tl.to(swapRedOffsetRef.current,  { attr: { dx: 0  }, ease: "power4.out", duration: 0.10 }, 0.46);
      tl.to(swapBlueOffsetRef.current, { attr: { dx: 0  }, ease: "power4.out", duration: 0.10 }, 0.46);

      // Subtle cyan-tinted flash at the glitch peak — hints at the new
      // scene's palette without blowing the screen out.
      tl.to(swapFlashRef.current, { opacity: 0.55, ease: "power2.in",  duration: 0.07 }, 0.42);
      tl.to(swapFlashRef.current, { opacity: 0,    ease: "power2.out", duration: 0.11 }, 0.49);

      // Computer crossfade — happens UNDER the flash. Sine easings for
      // a buttery dissolve. Wider window (0.42 → 0.54) overlapping the
      // flash and the glitch tail.
      tl.to(computerRetroRef.current,  { opacity: 0, ease: "sine.inOut", duration: 0.12 }, 0.42);
      tl.to(computerModernRef.current, { opacity: 1, ease: "sine.inOut", duration: 0.12 }, 0.42);

      // Text crossfade — sequential, no overlap. Retro out, then future in.
      tl.to(textRef.current,       { opacity: 0, ease: "power2.in",  duration: 0.05 }, 0.42);
      tl.to(futureTextRef.current, { opacity: 1, ease: "power2.out", duration: 0.05 }, 0.49);

      // Phase 3 — black hold, then dissolve into the static hero overlay.
      // Future text fades out, and the static hero (red blinds + matrix
      // text headline) fades IN over the same beat so the user sees a
      // single dissolve rather than scrolling to a new section.
      tl.to({}, { duration: 0.25 }, 1);
      tl.to(
        futureTextRef.current,
        { opacity: 0, ease: "power2.in", duration: 0.12 },
        1.10
      );
      tl.to(
        staticHeroRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.18 },
        1.10
      );
      // Flip the static-hero booted flag at the start of the dissolve so
      // the matrix scramble runs exactly while the section fades in.
      tl.call(() => setStaticHeroBooted(true), [], 1.10);
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

          {/* Futuristic workspace (post-swap state). Same canvas + same
              composition as retro, but the plant / laptop / pencil cup
              all sit ~10–15% LOWER in this image's canvas than they do
              in the retro canvas. Bumping objectPosition Y from 18% →
              50% shifts the image up so the elements register near the
              retro's slots and the swap doesn't look jumpy. */}
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
              style={{ objectFit: "cover", objectPosition: "center 50%" }}
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
            top: "41%",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 1,
            width: "min(70vw, 880px)",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(28px, 5.2vw, 80px)",
            lineHeight: 1.3,
            textAlign: "center",
            color: "#FF9F4A",
            textShadow:
              "0 0 10px rgba(255,159,74,0.7), 0 0 24px rgba(255,90,30,0.45), 0 0 48px rgba(255,90,30,0.25)",
            letterSpacing: "0.02em",
            willChange: "opacity, transform",
          }}
        >
          <span style={{ display: "block", whiteSpace: "nowrap" }}>Still working</span>
          <span style={{ display: "block", whiteSpace: "nowrap" }}>like it&apos;s the</span>
          <span style={{ display: "block", whiteSpace: "nowrap" }}>past?</span>
        </div>

        {/* Matrix-green CLI prompt — sits below the orange block, near
            the bottom of the monitor's screen. Same Press Start 2P,
            terminal-green colour palette. */}
        <div
          ref={subTextRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(58% - 40px)",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 1,
            width: "min(70vw, 880px)",
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(16px, 2.8vw, 38px)",
            lineHeight: 1.3,
            textAlign: "center",
            color: "#34F26B",
            textShadow:
              "0 0 10px rgba(52,242,107,0.75), 0 0 22px rgba(0,200,80,0.5), 0 0 44px rgba(0,150,60,0.28)",
            letterSpacing: "0.06em",
            willChange: "opacity, transform",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>
            <TypewriterLoop text="> Scroll into the future" cycleMs={4000} typeMs={1400} />
            <span className="cli-caret">▌</span>
          </span>
        </div>

        {/* Future text — appears on the modern laptop screen after the
            swap. Space Grotesk for a slightly geometric, modern display
            face (used by Vercel/Linear). Larger size + tighter tracking
            so the line confidently fills the laptop's wide screen rect
            instead of looking like a tooltip. */}
        <div
          ref={futureTextRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "51%",
            zIndex: 4,
            pointerEvents: "none",
            opacity: 0,
            width: "min(86vw, 1280px)",
            fontFamily:
              "var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(34px, 6.4vw, 104px)",
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            textAlign: "center",
            color: "#FFFFFF",
            textShadow:
              "0 0 28px rgba(180,225,255,0.42), 0 0 80px rgba(120,180,230,0.22)",
            willChange: "opacity, transform",
          }}
        >
          Scroll to see the future of doing business with Sense.
        </div>
        </div>

        {/* Static hero overlay — dissolves in over the black at the end
            of phase 3, replacing the zoom scene with the red-blinds
            command-center hero. Sits OUTSIDE the swap-fx wrapper so the
            transition glitch never touches it. The matrix text reveal
            fires when `staticHeroBooted` flips true (driven by the
            timeline). */}
        <div
          ref={staticHeroRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            opacity: 0,
            pointerEvents: staticHeroBooted ? "auto" : "none",
            willChange: "opacity",
          }}
        >
          <HeroSectionStatic externalBooted={staticHeroBooted} />
        </div>
      </div>
    </section>
  );
}
