"use client";
//@ts-ignore
import "../globals.css";
import React from "react";

import NavBar from "@/components/navBar";
import SearchBar from "@/components/searchBar";
import useTheme from "@/hooks/useTheme";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  const themeStyles = {
    "--theme-bg": theme.bg,
    "--theme-bgCard": theme.bgCard,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
  } as React.CSSProperties;

  return (
    <div
      className="flex flex-row h-screen bg-(--theme-bg) text-(--theme-text-primary)"
      style={themeStyles}
    >
      <NavBar />
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row justify-end items-center p-4 border-b border-(--theme-border)">
          <SearchBar />
        </div>

        <div className="flex flex-row h-full overflow-auto">
          <div className="flex flex-col h-full w-full bg-(--theme-bg)">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
