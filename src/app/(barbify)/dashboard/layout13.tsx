"use client";

import React from "react";
import { ServicesBootstrap } from "@/components/ServicesBootstrap";
import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";
import useTheme from "@/hooks/useTheme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  ServicesBootstrap();
  return (
    <div className="h-screen flex flex-row">
      {/* Barra lateral */}
      <NavBar />

      {/* Contenedor principal con scroll */}
      <div className="flex flex-col grow h-full overflow-hidden">
        {/* TaskBar fija arriba */}
        <div className="sticky top-0 z-10">
          <TaskBar />
        </div>

        {/* Contenido con scroll */}
        <div
          className="flex-1 overflow-auto"
          style={{ backgroundColor: theme.bg }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
