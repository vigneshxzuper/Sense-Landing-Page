"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const snap = new Snap(lenis, {
      type: "proximity",
      duration: 1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      distanceThreshold: "25%",
      debounce: 400,
    });
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("main > section, [data-snap]")
    ).filter((el) => !el.hasAttribute("data-no-snap"));
    const removeSnap = targets.length
      ? snap.addElements(targets, { align: "start" })
      : () => {};

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
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(tickerFn);
      removeSnap();
      snap.destroy();
      lenis.destroy();
    };
  }, []);

  return null;
}
