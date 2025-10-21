"use client";

// app/page.tsx o Dashboard.tsx (Componente Padre)
import React, { useEffect, useState, useCallback } from "react";
import Calendar, { ServiceEvent, CalendarEvent } from "@/components/calendar"; // Asegúrate de la ruta
import EventDetails from "@/components/EventDetails"; // Asegúrate de la ruta

// (Copias o defines aquí el tipo ServiceEvent si no lo exportaste)

// Función de parseo (la que ya tenías)
const parseEventsData = (events: ServiceEvent[]): CalendarEvent[] => {
  const eventsByDate: Record<string, ServiceEvent[]> = {};

  events.forEach((event) => {
    const date = new Date(event.serviceDate);
    const dateKey = date.toISOString().split("T")[0];

    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  return Object.entries(eventsByDate).map(([dateKey, eventsOnDate]) => {
    const count = eventsOnDate.length;
    const title = count === 1 ? "1 Cliente" : `${count} Clientes`;

    return {
      title,
      start: dateKey,
      allDay: true,
      extendedProps: {
        count,
        events: eventsOnDate,
      },
    } as CalendarEvent;
  });
};

export default function Dashboard() {
  const [events, setEvents] = useState<ServiceEvent[]>([]);
  // 💡 ESTADO CLAVE: Almacena los eventos seleccionados al hacer click
  const [selectedEvents, setSelectedEvents] = useState<ServiceEvent[] | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/diary");
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error("Error al obtener los datos del servidor:", error);
      }
    };
    fetchData();
  }, []);

  const eventsData = parseEventsData(events);

  // 💡 HANDLER CLAVE: Actualiza el estado de la selección
  const handleCalendarEventClick = useCallback((events: ServiceEvent[]) => {
    setSelectedEvents(events);
  }, []);

  return (
    <div className="flex flex-row gap-4 p-4 space-y-8">
      {/* <h1 className="text-3xl font-bold">Agenda de Citas</h1> */}
      {/* 2. Calendario (Componente A) */}
      <div className="w-1/2">
        <Calendar
          eventsData={eventsData}
          onEventClick={handleCalendarEventClick} // Le pasamos el handler
        />
      </div>

      {/* 1. Detalles del Evento (Componente B) */}
      <div className="w-1/2">
        <EventDetails selectedEvents={selectedEvents} />
      </div>
    </div>
  );
}
