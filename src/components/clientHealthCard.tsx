"use client";

import Link from "next/link";
import { useState } from "react";
import { IClient } from "@/models/Clients";

export default function ClientHealthCard({ client }: { client: IClient }) {
  const [activeTab, setActiveTab] = useState<
    "alergias" | "enfermedades" | "medicamentos" | null
  >("alergias");

  // Función helper para determinar las clases de cada tab
  const getTabClasses = (
    tabName: "alergias" | "enfermedades" | "medicamentos"
  ) => {
    const baseClasses = "p-2 font-semibold cursor-pointer hover:underline";
    const activeClasses = "text-white underline bg-[#dda863]";
    const inactiveClasses = "bg-[#cdaa7e]";

    let roundedClasses = "rounded-t-md"; // todos siempre redondeados arriba

    if (activeTab === "enfermedades") {
      if (tabName === "alergias") {
        roundedClasses += " rounded-br-md";
      } else if (tabName === "medicamentos") {
        roundedClasses += " rounded-bl-md";
      }
    }

    if (activeTab === "alergias" && tabName === "enfermedades") {
      roundedClasses += " rounded-bl-md";
    }

    if (activeTab === "medicamentos" && tabName === "enfermedades") {
      roundedClasses += " rounded-br-md";
    }

    return `${baseClasses} ${
      activeTab === tabName ? activeClasses : inactiveClasses
    } ${roundedClasses}`;
  };

  return (
    <div className="bg-[#ffd49d] w-full h-fit p-4 rounded-b-2xl z-10">
      <div className="flex flex-row justify-between items-center">
        <div className="relative flex flex-row items-center gap-0 w-fit">
          <button
            onClick={() => setActiveTab("alergias")}
            className={`${getTabClasses("alergias")} z-20`}
          >
            Alergias
          </button>

          <button
            onClick={() => setActiveTab("enfermedades")}
            className={`${getTabClasses("enfermedades")} z-20`}
          >
            Enfermedades
          </button>

          <button
            onClick={() => setActiveTab("medicamentos")}
            className={`${getTabClasses("medicamentos")} z-20`}
          >
            Medicamentos
          </button>
          <div className="absolute bottom-0 w-full h-2 bg-[#dda863] -z10"></div>
        </div>
        <Link
          href={`/clients/${client._id}/history`}
          className="hover:bg-amber-100 cursor-pointer hover:rounded-2xl px-3 py-1"
        >
          Ver Historial
        </Link>
      </div>

      {/* Vista de cada item */}
      <div className="z-0" id="health-info">
        {activeTab === "alergias" && (
          <p className="bg-[#dda863] p-2 rounded-b-md ">
            {client.clientAllergies || "Sin Definir"}
          </p>
        )}
        {activeTab === "enfermedades" && (
          <p className="bg-[#dda863] p-2 rounded-b-md ">
            {client.clientDiseases || "Sin Definir"}
          </p>
        )}
        {activeTab === "medicamentos" && (
          <p className="bg-[#dda863] p-2 rounded-b-md ">
            {client.clientMedications || "Sin Definir"}
          </p>
        )}
      </div>
    </div>
  );
}
