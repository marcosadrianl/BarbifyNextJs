"use client";

import { Poppins } from "@/utils/fonts";

import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";

import NavBar from "@/components/navBar";
import SearchBar from "@/components/searchBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#ffe7c7] h-screen flex flex-row text-[#43553b]">
      <NavBar />
      <div
        className={`${Poppins.variable} flex flex-col w-full overflow-y-auto`}
      >
        <div className="flex flex-col justify-between items-center p-2">
          <div className="flex w-full justify-center mb-2">
            <SearchBar />
          </div>
        </div>
        <div className="grow">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </div>
    </div>
  );
}
