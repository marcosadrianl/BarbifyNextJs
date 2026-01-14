"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { useBarbers } from "@/lib/store/services.store";
import { IBarbers } from "@/models/Barbers";

export default function BarbersInfo() {
  const [openSection, setOpenSection] = useState<"create" | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<IBarbers | null>(null);

  const { barbers, loading, refreshFromAPI } = useBarbers();

  useEffect(() => {
    refreshFromAPI();
  }, [refreshFromAPI]);

  return (
    <div className="flex flex-col h-75 overflow-hidden">
      {openSection !== "create" ? (
        <div
          className="cursor-pointer hover:bg-gray-100 p-4"
          onClick={() => setOpenSection("create")}
        >
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2 className="font-semibold text-lg">
                Información de los Barbers
              </h2>
              <p className="text-xs text-gray-600">
                Ve la información de los barbers registrados en tu cuenta.
              </p>
            </span>
            <ChevronRight className="w-6 h-6" />
          </span>
        </div>
      ) : (
        <div className="">
          <div
            className="flex flex-row gap-4 mb-4 cursor-pointer hover:bg-gray-100 py-4 px-2 "
            onClick={() => setOpenSection(null)}
          >
            <ChevronLeft />
            <h2 className="font-semibold text-lg">
              Información de los Barbers
            </h2>
          </div>

          {loading ? (
            <p>Cargando barbers...</p>
          ) : barbers.length === 0 ? (
            <p className="px-4">No hay Barbers registrados.</p>
          ) : (
            <div className="relative overflow-hidden min-h-100  ">
              {/* LISTA DE BARBERS */}
              <div
                className={`transition-transform duration-300 ease-in-out ${
                  selectedBarber ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                <div className="flex flex-col gap-4 ">
                  {barbers.map((barber) => (
                    <div
                      key={barber._id.toString()}
                      className="p-4  flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedBarber(barber)}
                    >
                      <h3 className="font-medium">
                        {barber.barberName} {barber.barberLastName}
                      </h3>
                      <ChevronRight />
                    </div>
                  ))}
                </div>
              </div>

              {/* PANEL DE DETALLE */}
              <div
                className={`absolute  top-0 left-0 w-full bg-white transition-transform duration-300 ease-in-out ${
                  selectedBarber ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {selectedBarber && (
                  <div className="p-4">
                    <div
                      className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors "
                      onClick={() => setSelectedBarber(null)}
                    >
                      <ChevronLeft />
                      <h2 className="font-semibold">
                        {selectedBarber.barberName}{" "}
                        {selectedBarber.barberLastName}
                      </h2>
                    </div>

                    <Separator className="my-4 bg-gray-300 h-px" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">E-mail</p>
                        <p className="font-medium">
                          {selectedBarber.barberEmail}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium">
                          {selectedBarber.barberPhone}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">
                          Fecha de registro
                        </p>
                        <p className="font-medium">
                          {new Date(
                            selectedBarber.createdAt
                          ).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Rol</p>
                        <p className="font-medium">
                          {selectedBarber.barberRole}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
