"use client";

import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ServicesBootstrap } from "@/components/ServicesBootstrap";

import NavBar from "@/components/navBar";

import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ServicesBootstrap();
  return (
    <div className="bg-[#ffe7c7] flex flex-row h-screen text-[#43553b]">
      <NavBar />
      <div className="flex flex-col">
        <TaskBar />
        <div className="bg-[#cebaa1] overflow-auto">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </div>
    </div>
  );
}
