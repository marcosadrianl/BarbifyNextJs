"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#ffe7c7] h-screen flex flex-row text-[#43553b]">
      <div className={`flex flex-col w-full overflow-y-auto`}>
        <div className="flex-grow overflow-auto">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </div>
    </div>
  );
}
