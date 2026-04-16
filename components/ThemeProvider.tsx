"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
  setTheme: (t: Theme, opts?: { persist?: boolean }) => void;
}>({
  theme: "dark",
  toggle: () => {},
  isDark: true,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  // 1. Check localStorage
  const stored = localStorage.getItem("sense-theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  // 2. Respect system preference
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const persistRef = useRef(true);

  // Read initial theme on mount
  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  // Apply theme to DOM and (conditionally) persist
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    root.setAttribute("data-theme", theme);
    if (persistRef.current) localStorage.setItem("sense-theme", theme);
    persistRef.current = true;
    const t = window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 1100);
    return () => window.clearTimeout(t);
  }, [theme, mounted]);

  const setTheme = (t: Theme, opts?: { persist?: boolean }) => {
    persistRef.current = opts?.persist !== false;
    setThemeState(t);
  };

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem("sense-theme");
      if (!stored) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  // Prevent flash — set data-theme before first render via a script
  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
