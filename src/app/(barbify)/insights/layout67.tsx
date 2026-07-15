"use client";
//@ts-ignore
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
      className="flex flex-row h-screen bg-(--theme-bg) text-(--theme-text-primary)"
      style={themeStyles}
    >
      <NavBar />
      <div className="flex flex-col grow h-screen">
        <TaskBar />
        <div className="flex grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
