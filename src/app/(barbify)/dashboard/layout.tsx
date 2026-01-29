"use client";

import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ServicesBootstrap } from "@/components/ServicesBootstrap";
import { TrialBanner } from "@/components/TrialBanner";

import NavBar from "@/components/navBar";

import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ServicesBootstrap();
  return (
    <SessionProvider>
      <div className="bg-[#ffe7c7] h-screen flex flex-row text-[#43553b]">
        {/* Barra lateral */}
        <NavBar />

        {/* Contenedor principal con scroll */}
        <div className="flex flex-col grow h-full overflow-hidden">
          {/* TaskBar fija arriba */}
          <div className="sticky top-0 z-10">
            <TaskBar />
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-auto">
            <TrialBanner />
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
