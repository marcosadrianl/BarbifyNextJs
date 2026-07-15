"use client";

import React, { useEffect, useState, useCallback } from "react";
import Calendar, { CalendarEvent } from "@/components/calendar";
import EventDetails from "@/components/EventDetails";
import {
  useServicesStore,
  useAllServicesStore,
} from "@/lib/store/services.store";
import { IServiceCombined } from "@/models/models";
import useTheme from "@/hooks/useTheme";

const parseEventsData = (events: IServiceCombined[]): CalendarEvent[] => {
  const eventsByDate: Record<string, IServiceCombined[]> = {};

  events.forEach((event: IServiceCombined) => {
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
  const { services, refreshFromAPI, loadFromCache } = useAllServicesStore();
  const { theme } = useTheme();

  const [selectedEvents, setSelectedEvents] = useState<
    IServiceCombined[] | null
  >(null);

  useEffect(() => {
    loadFromCache();

    const currentState = useServicesStore.getState();

    if (!currentState.lastUpdated) {
      refreshFromAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eventsData = parseEventsData(services);

  const handleCalendarEventClick = useCallback((events: any[]) => {
    setSelectedEvents(events as IServiceCombined[]);
  }, []);

  const themeStyles = {
    "--theme-bg": theme.bg,
    "--theme-bgCard": theme.bgCard,
    "--theme-text-primary": theme.textPrimary,
    "--theme-border": theme.border,
  } as React.CSSProperties;

  return (
    <div
      className="flex flex-row w-full h-full overflow-hidden p-0 bg-(--theme-bg) text-(--theme-text-primary)"
      style={themeStyles}
    >
      <div className="w-1/3 h-full overflow-y-auto border-r border-(--theme-border)">
        <EventDetails selectedEvents={selectedEvents} />
      </div>

      <div className="w-2/3 bg-(--theme-bgCard) p-4 h-full relative overflow-y-auto">
        <Calendar
          eventsData={eventsData}
          onEventClick={handleCalendarEventClick}
        />
      </div>
    </div>
  );
}
