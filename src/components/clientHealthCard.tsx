"use client";

import Link from "next/link";
import { useState } from "react";
import { IClientLean } from "@/models/Clients";

export default function ClientHealthCard({ client }: { client: IClientLean }) {
  const [activeTab, setActiveTab] = useState<
    "alergias" | "enfermedades" | "medicamentos" | null
  >("alergias");

  // Función helper para determinar las clases de cada tab
  const getTabClasses = (
    tabName: "alergias" | "enfermedades" | "medicamentos"
  ) => {
    const baseClasses = "p-2 font-semibold cursor-pointer hover:underline";
    const activeClasses = "text-white underline bg-[#dda863]";
    const inactiveClasses = "bg-[#cdaa7e bg-gray-200";

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
          className="flex flex-row gap-1 items-center bg-[#cdaa7e] rounded-2xl hover:bg-amber-100 cursor-pointer hover:rounded-2xl px-3 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#43553b"
          >
            <path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
          </svg>
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
