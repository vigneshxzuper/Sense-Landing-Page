"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Gentle smoothing — never snap, never lerp so heavy that input feels
    // disconnected. duration 1.2 + outExpo easing is the sweet spot for
    // a continuous-timeline feel without the lag complaints.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native scroll on touch — smoothing on touch reads as broken.
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Refresh once after layout settles so pins compute correct end
    // positions and avoid the section-bleed overlap bug.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    const onAnchor = (e: MouseEvent) => {
      if (e.defaultPrevented) {
        const a = (e.target as HTMLElement | null)?.closest("a[href^='#']") as HTMLAnchorElement | null;
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href) as HTMLElement | null;
        if (!el) return;
        lenis.scrollTo(el, { offset: -12, duration: 1.2 });
        return;
      }
      const a = (e.target as HTMLElement | null)?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -12, duration: 1.2 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      window.clearTimeout(refreshTimer);
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return null;
}
