"use client";
//@ts-ignore
import "../globals.css";
import React from "react";
import { ServicesBootstrap } from "@/components/ServicesBootstrap";
import NavBar from "@/components/navBar";
import SearchBar from "@/components/searchBar";
import useTheme from "@/hooks/useTheme";
import { useState, useEffect } from "react";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const [renderKey, setRenderKey] = useState(0);
  ServicesBootstrap();

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [theme]);

  return (
    <div
      className="flex flex-row h-screen w-screen overflow-hidden"
      style={{
        background: theme.bg,
      }}
    >
      <NavBar />
      <div className="flex flex-col w-full h-full">
        <div
          className="flex flex-row justify-end items-center p-4"
          style={{
            border: "1px solid " + theme.border,
          }}
        >
          <SearchBar />
        </div>

        <div className="flex flex-row h-full overflow-auto">
          <div className="flex flex-col h-full w-full" key={renderKey}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
