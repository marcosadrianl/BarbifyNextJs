"use client";

import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}
