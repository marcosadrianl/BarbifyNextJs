// components/Calendar.tsx (Modificado)
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { EventClickArg } from "@fullcalendar/core";

// 🔧 CORRECCIÓN: Tipo que refleja la estructura real de la API
export type ServiceEvent = {
  clientServices: {
    serviceName: string;
    serviceDate: string;
    serviceDuration: number;
    servicePrice: number;
    serviceNotes?: string;
    _id?: string;
  };
  clientName: string;
  clientLastName: string;
  clientPhone?: string;
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
  views: {
    timeGridWeek: { buttonText: "Week" };
  };
  firstDay: 1;
}

export default function Calendar({ eventsData, onEventClick }: CalendarProps) {
  const handleEventClick = (info: EventClickArg) => {
    const { events } = info.event.extendedProps;
    onEventClick(events as ServiceEvent[]);
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
      eventTextColor="#43553b"
      eventClassNames={["hover:font-semibold", "cursor-pointer"]}
    />
  );
}
