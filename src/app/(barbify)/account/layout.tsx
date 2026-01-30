"use client";

import "../../globals.css";
import React from "react";

import { AccountSidebar } from "@/components/AccountSidebar";
import NavBar from "@/components/navBar";
import SearchBar from "@/components/searchBar";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#ffe7c7] flex flex-row h-screen text-black">
      <NavBar />
      <div className="flex flex-col w-full h-full">
        {/* Barra superior fija */}
        <div className="flex flex-row justify-end items-center p-4  border-b border-[#cebaa1]">
          <SearchBar />
        </div>

        {/* Contenido principal con scroll */}
        <div className="flex flex-row h-full overflow-auto">
          <aside className="w-1/3 overflow-auto no-scrollbar border-r border-[#cebaa1]">
            <AccountSidebar />
          </aside>
          <div className="flex flex-col h-full bg-[#ffe7c7] w-2/3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
