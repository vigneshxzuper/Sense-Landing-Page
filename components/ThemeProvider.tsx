"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";

type Theme = "dark";

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

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Force dark mode site-wide. Any previously stored "light" preference
  // is ignored — we only ship dark.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    try {
      localStorage.removeItem("sense-theme");
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggle: () => {}, isDark: true, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
