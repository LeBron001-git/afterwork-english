"use client";

import { useEffect } from "react";
import { useLearningStore } from "@/store/use-learning-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useLearningStore((state) => state.preference);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preference.theme;
    root.dataset.colorMode = preference.colorMode;
    root.dataset.reduceMotion = String(preference.reduceMotion);
    root.dataset.largeFont = String(preference.largeFont);
    const darkByTheme = preference.theme === "dark-focus" || preference.theme === "cyber-energy";
    const darkBySystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", preference.colorMode === "dark" || (preference.colorMode === "system" && darkBySystem) || darkByTheme);
  }, [preference]);

  return children;
}
