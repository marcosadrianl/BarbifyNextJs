"use client";

import SecuritySettings from "@/components/securitySettings";
import { useState } from "react";
import { SquareArrowUpRight } from "lucide-react";

export default function Page() {
  const [openSection, setOpenSection] = useState<"" | "password">("");
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Seguridad</h1>
      <p className="text-muted-foreground mb-6 px-4">
        Ve las opciones de configuración para la seguridad de tu cuenta.
      </p>
      {openSection !== "password" ? (
        <div
          className="cursor-pointer hover:bg-gray-100 p-4"
          onClick={() => setOpenSection("password")}
        >
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2>Contraseña</h2>
              <p className="text-xs text-gray-600">Cambia tu contraseña.</p>
            </span>
            <SquareArrowUpRight className="w-6 h-6" />
          </span>
        </div>
      ) : (
        <SecuritySettings onClose={() => setOpenSection("")} />
      )}
    </div>
  );
}
