"use client";

import "../../../globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#cebaa1] w-full overflow-auto">
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}
