"use client";
//@ts-ignore
import "../../globals.css";
import React from "react";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col h-full w-full">{children}</div>;
}
