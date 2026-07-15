"use client";

import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen">
      <NavBar />
      <div className="flex flex-col w-full h-screen">
        <TaskBar />
        <div className="bg-[ #F5FFFF ] flex grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
