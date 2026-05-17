"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import Breadcrumbs from "@/components/breadcrumbs";
import { darkTheme, lightTheme } from "@/UI/theme";

export default function TaskBar() {
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

  return (
    <div
      className="flex flex-row justify-between items-center p-4 border-l"
      style={{
        borderLeftColor: theme.border,
        backgroundColor: theme.bgSidebar,
        color: theme.textPrimary,
      }}
    >
      <Breadcrumbs />
      <SearchBar />
    </div>
  );
}
