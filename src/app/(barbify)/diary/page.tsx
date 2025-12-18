"use client";

// app/page.tsx o Dashboard.tsx (Componente Padre)
import React, { useEffect, useState, useCallback } from "react";
import Calendar, { ServiceEvent, CalendarEvent } from "@/components/calendar";
import EventDetails from "@/components/EventDetails";

// Función de parseo CORREGIDA con validación
const parseEventsData = (events: ServiceEvent[]): CalendarEvent[] => {
  const eventsByDate: Record<string, ServiceEvent[]> = {};

  events.forEach((event: ServiceEvent) => {
    /*     console.log("evento en parseData", event); */

    // 🔧 Validar que serviceDate existe y es válido
    if (!event.clientServices.serviceDate) {
      console.warn("Evento sin serviceDate:", event.clientServices.serviceDate);
      return; // Saltar este evento
    }

    const date = new Date(event.clientServices.serviceDate);

    // Validar que la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn("Fecha inválida para evento:", event);
      return; // Saltar este evento
    }

    /*     console.log("Date is: ", date.toISOString()); */
    const dateKey = date.toISOString().split("T")[0];
    /*     console.log("DateKey is: ", dateKey); */

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

  /*   console.log("Dashboard events: ", events); */
  const eventsData = parseEventsData(events);

  const handleCalendarEventClick = useCallback((events: ServiceEvent[]) => {
    setSelectedEvents(events);
  }, []);

  return (
    <div className="flex flex-row gap-4 p-4 bg-[#cebaa1] grow w-full h-full">
      {/* Calendario */}
      <div className="w-1/2">
        <Calendar
          eventsData={eventsData}
          onEventClick={handleCalendarEventClick}
        />
      </div>

      {/* Detalles del Evento */}
      <div className="w-1/2">
        <EventDetails selectedEvents={selectedEvents} />
      </div>
    </div>
  );
}
