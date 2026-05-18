"use client";

import React from "react";
import useTheme from "@/hooks/useTheme";

interface ThemeBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function ThemeBackground({
  children,
  className,
}: ThemeBackgroundProps) {
  const { theme } = useTheme();

  return (
    <div className={className} style={{ backgroundColor: theme.bg }}>
      {children}
    </div>
  );
}
