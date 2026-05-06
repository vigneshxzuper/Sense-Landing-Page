"use client";

import { useEffect } from "react";

/**
 * Forces every page load (and full refresh) to start at scroll position 0.
 * Without this, the browser's default `scrollRestoration: "auto"` would
 * restore the previous scroll offset on refresh, dropping users mid-way
 * through the hero animation instead of at its first frame.
 */
export default function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
  return null;
}
