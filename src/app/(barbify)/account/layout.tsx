"use client";
//@ts-ignore
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
      className="flex flex-row h-screen min-w-2xl bg-(--theme-bg) text-(--theme-text-primary)"
      style={themeStyles}
    >
      <div className="flex flex-row h-full w-full overflow-auto">
        <aside className="w-1/3 overflow-auto no-scrollbar border-r border-(--theme-border)">
          <AccountSidebar />
        </aside>
        <div className="flex flex-col h-full w-2/3 bg-(--theme-bg)">
          {children}
        </div>
      </div>
    </div>
  );
}
