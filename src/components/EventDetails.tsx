// components/EventDetails.tsx (Nuevo)
import React from "react";
import { ServiceEvent } from "@/components/calendar"; // Importamos el tipo

interface EventDetailsProps {
  selectedEvents: ServiceEvent[] | null; // Puede ser null si no hay evento seleccionado
}

export default function EventDetails({ selectedEvents }: EventDetailsProps) {
  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 text-gray-500">
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

  return (
    <div className="p-4 border-2 border-orange-300 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold mb-4 text-orange-600">
        Tienes {selectedEvents.length}{" "}
        {selectedEvents.length === 1 ? "cita" : "citas"} para el {date}
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {selectedEvents.map((event, index) => (
          <div key={index} className="p-3 border rounded-md bg-orange-50">
            <p className="font-semibold text-gray-800">
              {event.clientName} {event.clientLastName}
            </p>
            <p className="text-sm text-gray-600">
              Servicio: {event.serviceName} | Precio: $
              {(event.servicePrice / 100).toLocaleString("es-AR")}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(event.serviceDate).getHours()} hs
            </p>
            <p className="text-xs text-gray-500">
              Duración: {event.serviceDuration} min | Notas:{" "}
              {event.serviceNotes || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
