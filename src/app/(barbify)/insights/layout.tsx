"use client";

import "../../globals.css";
import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#ffe7c7] flex flex-row h-screen text-[#43553b]">
      <NavBar />
      <div className="flex flex-col grow h-screen">
        <TaskBar />
        <div className="bg-[#cebaa1] flex grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
