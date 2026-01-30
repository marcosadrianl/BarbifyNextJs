"use client";

import "../../../globals.css";
import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-[#cebaa1] w-full overflow-auto">{children}</div>;
}
