"use client";

import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/UI/theme";

export default function useTheme() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      setThemeMode(event.matches ? "dark" : "light");
    };

    updateTheme(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateTheme);
    } else {
      mediaQuery.addListener(updateTheme);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateTheme);
      } else {
        mediaQuery.removeListener(updateTheme);
      }
    };
  }, []);

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  return { theme, themeMode };
}
