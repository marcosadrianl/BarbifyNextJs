"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/UI/theme";

type Phase = "idle" | "loading" | "complete" | "fading";

function ProgressOverlay() {
  const { pending } = useLinkStatus();
  const [phase, setPhase] = useState<Phase>("idle");

  // Detecta el arranque y el fin de la carga
  useEffect(() => {
    if (pending) {
      setPhase("loading");
    } else {
      setPhase((prev) => (prev === "loading" ? "complete" : prev));
    }
  }, [pending]);

  // Encadena las transiciones automáticas: complete -> fading -> idle
  useEffect(() => {
    if (phase === "complete") {
      const t = setTimeout(() => setPhase("fading"), 200); // sostiene el 100% un instante
      return () => clearTimeout(t);
    }
    if (phase === "fading") {
      const t = setTimeout(() => setPhase("idle"), 400); // espera a que termine el fade
      return () => clearTimeout(t);
    }
  }, [phase]);

  const width =
    phase === "loading"
      ? 85
      : phase === "complete" || phase === "fading"
        ? 100
        : 0;
  const opacity = phase === "fading" || phase === "idle" ? 0 : 1;
  const widthDuration =
    phase === "loading" ? "700ms" : phase === "complete" ? "150ms" : "0ms";
  const opacityDuration = phase === "fading" ? "400ms" : "0ms";

  return (
    <span
      aria-hidden
      className="absolute inset-y-0 left-0 bg-lime-500/25 pointer-events-none"
      style={{
        width: `${width}%`,
        opacity,
        transition: `width ${widthDuration} ease-out, opacity ${opacityDuration} ease-out`,
      }}
    />
  );
}

export function NavLink({ href, icon: Icon, children }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);
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
  const isActive = pathname?.startsWith?.(href);
  const bg = isActive
    ? theme.accentBg
    : hovered
      ? theme.accentBg
      : theme.bgSidebar;

  return (
    <Link
      href={href}
      className={clsx(
        "relative overflow-hidden flex flex-row items-center rounded-r-2xl px-3 py-1 w-full gap-2",
      )}
      style={{ backgroundColor: bg, color: theme.textPrimary }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProgressOverlay />
      <Icon className="w-4.5 h-4.5 relative z-10" />
      <span className="relative z-10 flex flex-row items-center gap-2">
        {children}
      </span>
    </Link>
  );
}
