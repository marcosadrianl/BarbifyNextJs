"use client";

import React, { useEffect, useState, useCallback } from "react";
import Calendar, { CalendarEvent } from "@/components/calendar"; // Quitamos ServiceEvent de aquí si choca, o lo reemplazamos
import EventDetails from "@/components/EventDetails";
import {
  useServicesStore,
  useAllServicesStore,
} from "@/lib/store/services.store"; // 👈 Ajusta la ruta según tu estructura
import FullCalendar from "@fullcalendar/react";
import { IServiceCombined } from "@/models/models";

type ClientService = {
  clientId: string;
  clientServices: {
    serviceDate: string;
    serviceName: string;
    servicePrice: number;
    serviceDuration: number;
    serviceNotes: string;
    _id: string;
  };
  clientName: string;
  clientLastName: string;
};

// 1. Actualizamos el parser para usar el tipo del Store (ClientService)
const parseEventsData = (events: IServiceCombined[]): CalendarEvent[] => {
  const eventsByDate: Record<string, IServiceCombined[]> = {};

  events.forEach((event: IServiceCombined) => {
    // Validación de seguridad
    if (!event?.serviceDate) {
      return;
    }

    const date = new Date(event.serviceDate);

    if (isNaN(date.getTime())) {
      console.warn("Fecha inválida para evento:", event);
      return;
    }

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
    } as unknown as CalendarEvent;
  });
};

export default function DiaryClient() {
  // 2. Usamos el Store
  const { services, refreshFromAPI, loadFromCache } = useAllServicesStore();

  // Mantenemos el estado de selección local, ya que es UI efímera
  const [selectedEvents, setSelectedEvents] = useState<
    IServiceCombined[] | null
  >(null);

  // 3. Efecto de Carga Inteligente
  useEffect(() => {
    // Primero intentamos cargar del cache local (síncrono)
    loadFromCache();

    // Verificamos el estado actual después de intentar cargar el cache
    const currentState = useServicesStore.getState();

    // Si no hay 'lastUpdated', significa que no había cache o estaba expirado.
    // Entonces forzamos la carga desde la API.
    if (!currentState.lastUpdated) {
      refreshFromAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Transformamos los datos del store para el calendario
  const eventsData = parseEventsData(services);

  // Callback ajustado al nuevo tipo
  const handleCalendarEventClick = useCallback((events: any[]) => {
    // Casteamos a ClientService[] para mantener tipado estricto si es necesario
    setSelectedEvents(events as IServiceCombined[]);
  }, []);

  return (
    <div className="flex flex-row bg-[#cebaa1] w-full h-full overflow-hidden p-0">
      {/* El contenedor padre debe tener overflow-hidden para evitar el scroll general de la página */}

      {/* Detalles del Evento: scroll independiente */}
      <div className="w-1/3 h-full overflow-y-auto">
        <EventDetails selectedEvents={selectedEvents} />
      </div>

      {/* Calendario: scroll independiente */}
      <div className="w-2/3 bg-white p-4 h-full relative overflow-y-auto">
        <Calendar
          eventsData={eventsData}
          onEventClick={handleCalendarEventClick}
        />
      </div>
    </div>
  );
}
