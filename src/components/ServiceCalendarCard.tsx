"use client";

import React, { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IService } from "@/models/Service.type";
import { CalendarDays } from "lucide-react";

interface ServiceCalendarCardProps {
  services: IService[];
}

export default function ServiceCalendarCard({
  services,
}: ServiceCalendarCardProps) {
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
    hasService:
      "bg-green-100 font-bold text-green-800 hover:bg-green-200 rounded-lg",
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-green-600" />
          Calendario de Servicios
        </CardTitle>
        <div className="text-sm font-medium text-slate-600">
          {services.length} servicio{services.length !== 1 ? "s" : ""}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full">
          <Calendar
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            disabled={(date) => false}
            className="rounded-lg border border-slate-200 w-full"
          />
        </div>
      </CardContent>
      <div className="px-6 pb-4 flex items-center gap-3 text-xs rounded-b-lg">
        <div className="h-3 w-3 rounded-full bg-green-100 border border-green-300"></div>
        <span>Días con servicios registrados</span>
      </div>
    </Card>
  );
}
