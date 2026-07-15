"use client";

import React from "react";

import NavBar from "@/components/navBar";
import TaskBar from "@/components/taskBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full overflow-auto">{children}</div>;
}
