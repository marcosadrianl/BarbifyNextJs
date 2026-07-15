"use client";

import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/UI/theme";

function getSystemPreference() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function subscribeToSystemPreference(callback: () => void) {
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
  // modo puede ser: "system" | "manual"
  const [mode, setMode] = useState<"system" | "manual">("system");
  const [manualChoice, setManualChoice] = useState<"light" | "dark">("light");

  // Recuperar de localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode");
    const savedChoice = localStorage.getItem("theme-choice");
    if (savedMode === "manual" || savedMode === "system") {
      setMode(savedMode as "system" | "manual");
    }
    if (savedChoice === "light" || savedChoice === "dark") {
      setManualChoice(savedChoice as "light" | "dark");
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-choice", manualChoice);
  }, [mode, manualChoice]);

  // Si el modo es "system", usamos useSyncExternalStore
  const systemTheme = useSyncExternalStore(
    subscribeToSystemPreference,
    getSystemPreference,
    () => "light", // fallback SSR
  );

  const themeMode = mode === "system" ? systemTheme : manualChoice;
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  return {
    theme,
    themeMode,
    mode,
    setMode, // cambiar entre "system" y "manual"
    manualChoice,
    setManualChoice, // elegir "light" o "dark" manualmente
  };
}
