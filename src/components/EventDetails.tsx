// components/EventDetails.tsx (Nuevo)
import React from "react";
import { ServiceEvent } from "@/components/calendar"; // Importamos el tipo

interface EventDetailsProps {
  selectedEvents: ServiceEvent[] | null; // Puede ser null si no hay evento seleccionado
}

export default function EventDetails({ selectedEvents }: EventDetailsProps) {
  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <div className="p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-[#43553b]/50 text-center">
          Haga click en una fecha para ver m&aacute;s detalles
        </h3>
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

  const today = new Date();
  const dateNormalize = new Date(selectedEvents[0].serviceDate);

  //console.log(today, dateNormalize);

  return (
    <div className="p-4  rounded-lg">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        {/*Formatea el encabezado para fechas antes o despues de hoy: "Hubo x cita/as el //fecha//" o "Tienes x cita/as para el //fecha//" */}
        {dateNormalize >= today ? "Tienes" : "Hubo"} {selectedEvents.length}{" "}
        {selectedEvents.length === 1 ? "cita" : "citas"}{" "}
        {dateNormalize >= today ? "para" : ""} el {date}
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
