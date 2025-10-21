// components/Calendar.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import React, { useEffect, useState } from "react";

// Define el tipo de los eventos que vienen del backend
type ServiceEvent = {
  serviceName: string;
  serviceDate: string;
  serviceDuration: number;
  servicePrice: number;
  clientName: string;
  clientLastName: string;
  clientPhone?: string;
  serviceNotes?: string;
  fromBarberId?: string;
  _id?: string;
  clientId?: string;
};

/* {
    "serviceDate": "2025-10-16T00:00:00.000Z",
    "serviceName": "Afeitado",
    "serviceNotes": "no se, no tenia maquina en su casa",
    "servicePrice": 1234,
    "serviceDuration": 45,
    "fromBarberId": "68d5ebc3f657459cb98f49a3",
    "_id": "68e97c31ec42a97db91be217",
    "clientName": "Ulises",
    "clientLastName": "Man",
    "clientId": "68e7bdd8f2c39ceaee3cd760"
} */

export default function Calendar() {
  const [events, setEvents] = useState<ServiceEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/diary");
        const data = await response.json();

        console.log("Respuesta del backend:", data);

        // Guardamos el array de servicios
        setEvents(data.data || []);
      } catch (error) {
        console.error("Error al obtener los datos del servidor:", error);
      }
    };

    fetchData();
  }, []);

  // Adaptamos cada servicio al formato que FullCalendar espera
  const parseEventsData = (events: ServiceEvent[]) => {
    // Agrupamos eventos por fecha (sin hora)
    const eventsByDate: Record<string, ServiceEvent[]> = {};

    events.forEach((event) => {
      const date = new Date(event.serviceDate);
      const dateKey = date.toISOString().split("T")[0]; // Solo YYYY-MM-DD

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });

    // Creamos UN evento por fecha con el conteo
    return Object.entries(eventsByDate).map(([dateKey, eventsOnDate]) => {
      const count = eventsOnDate.length;
      const title = count === 1 ? "1 Cliente" : `${count} Clientes`;

      return {
        title,
        start: dateKey, // Solo la fecha, sin hora
        allDay: true, // Evento de día completo
        extendedProps: {
          count,
          events: eventsOnDate, // Guardamos todos los eventos de ese día
        },
      };
    });
  };

  // Parseamos los eventos antes de pasarlos al calendario
  const eventsData = parseEventsData(events);

  const handleDateClick = (arg: any) => {
    console.log("Fecha clickeada:", arg);
    console.log("Eventos en esta fecha:", arg.event?.extendedProps);
  };

  const handleEventClick = (info: any) => {
    const { count, events } = info.event.extendedProps;
    console.log(`Esta fecha tiene ${count} evento(s):`, events);
    // Aquí puedes abrir un modal, navegar a otro componente, etc.
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale={esLocale}
      events={eventsData}
      eventClick={handleEventClick}
      height="650px"
      aspectRatio={1.4}
      eventColor="#ffd49d"
      eventTextColor="#000"
    />
  );
}
