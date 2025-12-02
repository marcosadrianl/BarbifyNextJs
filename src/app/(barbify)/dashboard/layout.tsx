"use client";

import { Poppins } from "next/font/google";

import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";

import NavBar from "@/components/navBar";
import SearchBar from "@/components/searchBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#ffe7c7] h-screen flex flex-row text-[#43553b]">
      <NavBar />
      <div
        className={`${poppins.variable} flex flex-col w-full overflow-y-auto`}
      >
        <div className="flex flex-col justify-between items-center p-2">
          <div className="flex w-fit">
            <SearchBar />
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </div>
    </div>
  );
}
