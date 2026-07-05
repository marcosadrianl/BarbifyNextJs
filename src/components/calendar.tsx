"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { EventClickArg } from "@fullcalendar/core";
import useTheme from "@/hooks/useTheme";

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

export type CalendarEvent = {
  title: string;
  start: string;
  allDay: true;
  extendedProps: {
    count: number;
    events: ServiceEvent[];
  };
};

interface CalendarProps {
  eventsData: CalendarEvent[];
  onEventClick: (events: ServiceEvent[]) => void;
}

export default function Calendar({ eventsData, onEventClick }: CalendarProps) {
  const { theme } = useTheme();

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
      firstDay={0}
      height="650px"
      aspectRatio={1.4}
      eventColor={theme.primary}
      eventTextColor={theme.textPrimary}
      eventClassNames={["hover:font-semibold", "cursor-pointer"]}
    />
  );
}
