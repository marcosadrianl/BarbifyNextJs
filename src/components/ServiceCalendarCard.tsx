"use client";

import React, { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IService } from "@/models/Service.type";
import { CalendarDays } from "lucide-react";
import useTheme from "@/hooks/useTheme";

interface ServiceCalendarCardProps {
  services: IService[];
}

export default function ServiceCalendarCard({
  services,
}: ServiceCalendarCardProps) {
  const { theme } = useTheme();
  // Obtener días con servicios
  const serviceDays = useMemo(() => {
    return services.map((service) => new Date(service.serviceDate));
  }, [services]);

  // Crear un Set de fechas formateadas para búsquedas rápidas
  const serviceDatesSet = useMemo(() => {
    return new Set(serviceDays.map((date) => date.toISOString().split("T")[0]));
  }, [serviceDays]);

  // Función para verificar si un día tiene servicios
  const isDayWithService = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return serviceDatesSet.has(dateString);
  };

  const modifiers = {
    hasService: (date: Date) => isDayWithService(date),
  };

  const modifiersClassNames = {
    hasService: "font-bold rounded-lg",
  };

  return (
    <Card
      className="w-full"
      style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
    >
      <CardHeader
        className="flex flex-row items-center justify-between space-y-0 pb-4"
        style={{ color: theme.textPrimary }}
      >
        <CardTitle
          className="flex items-center gap-2 text-lg"
          style={{ color: theme.textPrimary }}
        >
          <CalendarDays className="h-5 w-5" style={{ color: theme.primary }} />
          Calendario de Servicios
        </CardTitle>
        <div
          className="text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          {services.length} servicio{services.length !== 1 ? "s" : ""}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full">
          <Calendar
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            modifiersStyles={{
              hasService: {
                backgroundColor: `${theme.primary}22`,
                color: theme.primary,
                borderRadius: "0.75rem",
              },
            }}
            disabled={(date) => false}
            className="rounded-lg w-full"
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bg,
            }}
            classNames={{
              weekday: "text-sm text-current",
              outside: "opacity-50 text-current",
              disabled: "opacity-50 text-current",
              today: "font-semibold",
            }}
          />
        </div>
      </CardContent>
      <div
        className="px-6 pb-4 flex items-center gap-3 text-xs rounded-b-lg"
        style={{ color: theme.textSecondary }}
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: theme.accentBg,
            border: `1px solid ${theme.border}`,
          }}
        ></div>
        <span>Días con servicios registrados</span>
      </div>
    </Card>
  );
}
