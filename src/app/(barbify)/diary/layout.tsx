"use client";

import "../../globals.css";
import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";
import useTheme from "@/hooks/useTheme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  const themeStyles = {
    "--theme-bg": theme.bg,
    "--theme-text-primary": theme.textPrimary,
    "--theme-border": theme.border,
  } as React.CSSProperties;

  return (
    <div
      className="h-screen flex flex-row bg-[var(--theme-bg)] text-[var(--theme-text-primary)]"
      style={themeStyles}
    >
      <NavBar />

      <div className="flex flex-col grow h-full overflow-hidden">
        <div className="sticky top-0 z-10">
          <TaskBar />
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
