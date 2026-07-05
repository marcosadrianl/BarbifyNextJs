"use client";

import "../../globals.css";
import React from "react";

import { AccountSidebar } from "@/components/AccountSidebar";
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
      className="flex flex-row h-screen bg-[var(--theme-bg)] text-[var(--theme-text-primary)]"
      style={themeStyles}
    >
      <NavBar />
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-row justify-end items-center p-4 border-b border-[var(--theme-border)]">
          <SearchBar />
        </div>

        <div className="flex flex-row h-full overflow-auto">
          <aside className="w-1/3 overflow-auto no-scrollbar border-r border-[var(--theme-border)]">
            <AccountSidebar />
          </aside>
          <div className="flex flex-col h-full w-2/3 bg-[var(--theme-bg)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
