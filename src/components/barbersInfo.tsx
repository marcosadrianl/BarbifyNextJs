"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import DeleteBarber from "@/components/deleteBarber";
import { useBarbers } from "@/lib/store/services.store";
import { IBarbers } from "@/models/Barbers";
import NewBarber from "@/components/newBarber";

export default function BarbersInfo() {
  const [isOpen, setIsOpen] = useState(false); // Controla si la sección de barbers está abierta
  const [selectedBarber, setSelectedBarber] = useState<IBarbers | null>(null);

  const { barbers, loading, refreshFromAPI } = useBarbers();

  useEffect(() => {
    refreshFromAPI();
  }, [refreshFromAPI]);

  return (
    <div className="flex flex-col h-auto overflow-hidden">
      {/* 1. CABECERA PRINCIPAL / BOTÓN DE APERTURA */}
      {!isOpen ? (
        <div
          className="cursor-pointer hover:bg-gray-100 p-4"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2 className="">Información de los Barbers</h2>
              <p className="text-xs text-gray-600">
                Ve la información de los barbers registrados.
              </p>
            </span>
            <ChevronRight className="w-6 h-6" />
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* TÍTULO CON BOTÓN VOLVER */}
          <div
            className="flex flex-row gap-4 cursor-pointer hover:bg-gray-100 py-4 px-2"
            onClick={() => {
              setIsOpen(false);
              setSelectedBarber(null);
            }}
          >
            <ChevronLeft />
            <h2 className="">Información de los Barbers</h2>
          </div>

          {/* LISTA DE BARBERS */}
          {!selectedBarber && (
            <div className="flex flex-col p-2">
              {loading ? (
                <p className="p-4 text-center">Cargando...</p>
              ) : barbers.length === 0 ? (
                <p className="p-4 text-left">No hay Barbers registrados.</p>
              ) : (
                barbers.map((barber) => (
                  <div
                    key={barber._id.toString()}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedBarber(barber)}
                  >
                    <h3 className="">
                      {barber.barberName} {barber.barberLastName}
                    </h3>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* DETALLE DEL BARBER */}
          {selectedBarber && (
            <div className="">
              <div
                className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-100 w-full"
                onClick={() => setSelectedBarber(null)}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <h3>
                    {selectedBarber.barberName} {selectedBarber.barberLastName}
                  </h3>
                </div>
                <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  <DeleteBarber id={selectedBarber._id.toString()} />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">EMAIL</p>
                  <p className="">{selectedBarber.barberEmail}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">TELÉFONO</p>
                  <p className="">{selectedBarber.barberPhone}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">ROL</p>
                  <p className="">{selectedBarber.barberRole}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Componente para crear nuevo */}
      {!isOpen && <NewBarber />}
    </div>
  );
}
