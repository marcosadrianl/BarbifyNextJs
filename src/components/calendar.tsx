// components/Calendar.tsx (Modificado)
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import React from "react";
import { EventClickArg } from "@fullcalendar/core"; // 👈 1. Importa el tipo

// (Mantén el tipo ServiceEvent aquí)
export type ServiceEvent = {
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
  className?: string;
};

// Define el tipo de eventos que pasaremos a FullCalendar
export type CalendarEvent = {
  title: string;
  start: string;
  allDay: true;
  extendedProps: {
    count: number;
    events: ServiceEvent[];
  };
};

// Definición de Props para el componente Calendar
interface CalendarProps {
  eventsData: CalendarEvent[];
  onEventClick: (events: ServiceEvent[]) => void;
}

export default function Calendar({ eventsData, onEventClick }: CalendarProps) {
  // 👈 2. Usa el tipo importado 'EventClickArg' en lugar del tuyo
  const handleEventClick = (info: EventClickArg) => {
    // Extraemos el array de eventos de la fecha clickeada
    // 'extendedProps' es donde FullCalendar guarda tus datos personalizados
    const { events } = info.event.extendedProps;

    events.forEach((event: ServiceEvent) => console.log(event));

    // Llamamos a la función pasada por el padre para actualizar el estado
    // Te recomiendo un 'cast' aquí para seguridad de tipos
    onEventClick(events as ServiceEvent[]);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale={esLocale}
      events={eventsData}
      eventClick={handleEventClick} // ✨ ¡Esto ahora es compatible!
      height="650px"
      aspectRatio={1.4}
      eventColor="#ffd49d"
      eventTextColor="#43553b"
      eventClassNames={[
        "hover:font-semibold",
        "cursor-pointer",
        "hover:text-white",
      ]}
    />
  );
}
