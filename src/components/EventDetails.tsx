// components/EventDetails.tsx (Nuevo)
import React from "react";
import { ServiceEvent } from "@/components/calendar"; // Importamos el tipo

interface EventDetailsProps {
  selectedEvents: ServiceEvent[] | null; // Puede ser null si no hay evento seleccionado
}

export default function EventDetails({ selectedEvents }: EventDetailsProps) {
  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <div className="p-4  rounded-lg  text-gray-400">
        Haz click en una fecha del calendario para ver los detalles de las
        citas.
      </div>
    );
  }

  const date = new Date(selectedEvents[0].serviceDate).toLocaleDateString(
    "es-ES",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
  console.log(selectedEvents[0]);

  return (
    <div className="p-4  rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">
        Tienes {selectedEvents.length}{" "}
        {selectedEvents.length === 1 ? "cita" : "citas"} para el {date}
      </h3>
      <div className="space-y-4 h-[calc(100vh-10rem)] overflow-auto no-scrollbar">
        {selectedEvents.map((event, index) => (
          <div
            key={index}
            className="p-3  rounded-2xl bg-amber-50 text-ellipsis"
          >
            <p className="font-semibold text-gray-800">
              {event.clientName} {event.clientLastName}
            </p>
            <p className="text-sm text-gray-600">
              Servicio: {event.serviceName} | Precio: $
              {(event.servicePrice / 100).toLocaleString("es-AR")}
            </p>
            <p className="text-sm text-gray-600">
              Hora:{" "}
              {new Date(event.serviceDate).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              hs
            </p>
            <p className="text-xs text-gray-500  w-1/3 text-nowrap">
              Duración: {event.serviceDuration} min | Notas:{" "}
              {event.serviceNotes || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
