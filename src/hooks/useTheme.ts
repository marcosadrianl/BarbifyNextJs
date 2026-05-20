"use client";

import { useSyncExternalStore } from "react";
import { darkTheme, lightTheme } from "@/UI/theme";

function getColorSchemePreference() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeToColorScheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  } else {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
}

export default function useTheme() {
  const themeMode = useSyncExternalStore(
    subscribeToColorScheme,
    getColorSchemePreference,
    () => "light", // server-side fallback
  );

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  return { theme, themeMode };
}
