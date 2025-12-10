// components/EventDetails.tsx (Actualizado)
import React from "react";
import { ServiceEvent } from "@/components/calendar";
import Link from "next/link";

interface EventDetailsProps {
  selectedEvents: ServiceEvent[] | null;
}

export default function EventDetails({ selectedEvents }: EventDetailsProps) {
  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <div className="p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-[#43553b]/50 text-center">
          Haga click en una fecha para ver más detalles
        </h3>
      </div>
    );
  }

  console.log("selectedEvents en EventDetails:", selectedEvents);

  // 🔧 Acceder a clientServices.serviceDate
  const date = new Date(
    selectedEvents[0].clientServices.serviceDate
  ).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const dateNormalize = new Date(selectedEvents[0].clientServices.serviceDate);

  return (
    <div className="p-4 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        {dateNormalize >= today ? "Tienes" : "Hubo"} {selectedEvents.length}{" "}
        {selectedEvents.length === 1 ? "cita" : "citas"}{" "}
        {dateNormalize >= today ? "para" : ""} el {date}
      </h3>
      <div className="space-y-4 h-[calc(100vh-10rem)] overflow-auto no-scrollbar">
        {selectedEvents.map((event) => (
          <div
            key={event.clientServices._id}
            className="p-3 rounded-2xl bg-amber-50 text-ellipsis"
          >
            <p className="hover:underline font-semibold text-gray-800">
              <Link
                href={`/clients/${event.clientId}`}
                rel="noopener noreferrer"
                title="Ver cliente en nueva pestaña"
              >
                {event.clientName} {event.clientLastName}
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Servicio: {event.clientServices.serviceName} | Precio: $
              {(event.clientServices.servicePrice / 100).toLocaleString(
                "es-AR"
              )}
            </p>
            <p className="text-sm text-gray-600">
              Hora:{" "}
              {new Date(event.clientServices.serviceDate).toLocaleTimeString(
                "es-AR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}{" "}
              hs
            </p>
            <p className="hover:underline text-sm text-gray-600">
              <Link
                className=" hover:text-blue-600"
                href={`https://api.whatsapp.com/send/?phone=${event.clientPhone}&text=Hola%21%20tenemos%20un%20turno%20pendiente%20&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                title="Contactar al cliente"
              >
                Tel: {event.clientPhone}
              </Link>
            </p>
            <p className="text-xs text-gray-500 w-1/3 text-nowrap">
              Duración: {event.clientServices.serviceDuration} min | Notas:{" "}
              {event.clientServices.serviceNotes || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
