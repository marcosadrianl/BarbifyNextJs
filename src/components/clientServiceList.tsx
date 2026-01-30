"use client";

import { Calendar, Clock, DollarSign, StickyNote } from "lucide-react";
import DeleteService from "./deleteService"; // Ajusta la ruta según tu carpeta
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/models/Service.type";

type Service = IService;

interface ClientServicesListProps {
  services: IService[];
  clientId: string;
}

export default function ClientServicesList({
  services,
  clientId,
}: ClientServicesListProps) {
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  if (services.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-2xl text-gray-400">
        No hay servicios registrados en el historial.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
      {services.map((service) => {
        const localDate = new Date(service.serviceDate);
        const localEndServiceDate = new Date(
          localDate.getTime() + service.serviceDuration * 60000,
        );
        const formattedDate = localDate.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const formattedTime = localDate.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedEndTime = localEndServiceDate.toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        return (
          <Card
            key={service._id.toString()}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row justify-between items-start p-5 gap-4">
                {/* Información Principal */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 tracking-tight capitalize">
                        {service.serviceName}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="mt-1 bg-orange-200 text-orange-800 hover:bg-orange-200"
                      >
                        {service.serviceDuration} min
                      </Badge>
                    </div>
                    {/* Botón eliminar para móviles (se oculta en desktop) */}
                    <div className="sm:hidden">
                      <DeleteService serviceId={service._id} Id={clientId} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5">
                        <Calendar className="h-4 w-4 text-orange-500" />
                      </div>
                      <span>
                        <span className="font-medium text-slate-900">
                          {daysOfWeek[localDate.getDay()]}
                        </span>
                        , {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5">
                        <Clock className="h-4 w-4 text-orange-500" />
                      </div>
                      <span>
                        {formattedTime} - {formattedEndTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <div className="p-1.5 text-green-600">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <span className="text-lg">
                        {(service.servicePrice / 100).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notas con estilo de post-it suave */}
                  <div className="flex items-start gap-2 p-3 bg-amber-100/50 rounded-lg border border-amber-200/50">
                    <StickyNote className="h-4 w-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800 italic leading-snug">
                      {service.serviceNotes || "Sin observaciones adicionales."}
                    </p>
                  </div>
                </div>

                {/* Acción Eliminar (Desktop) */}
                <div className="hidden sm:block">
                  <DeleteService serviceId={service._id} Id={clientId} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
