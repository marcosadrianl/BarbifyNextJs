"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import Breadcrumbs from "@/components/breadcrumbs";

import useTheme from "@/hooks/useTheme";

export default function TaskBar() {
  const { theme } = useTheme();

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
