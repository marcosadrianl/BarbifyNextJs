"use client";

import { Calendar, Clock, DollarSign, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DeleteService from "./deleteService"; // Ajusta la ruta según tu carpeta
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IService } from "@/models/Service.type";
import useTheme from "@/hooks/useTheme";

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

  const { theme } = useTheme();

  if (services.length === 0) {
    return (
      <div
        className="text-center p-8 border-2 border-dashed rounded-2xl"
        style={{
          color: theme.textSecondary,
          borderColor: theme.border,
          backgroundColor: theme.bgCard,
        }}
      >
        No hay servicios registrados en el historial.
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1"
      style={{ backgroundColor: theme.bg }}
    >
      {services.map((service) => {
        const localDate = new Date(service.serviceDate);
        const localEndServiceDate = new Date(
          localDate.getTime() + service.serviceDuration * 60000,
        );
        const formattedDate = format(localDate, "dd/MM/yyyy", { locale: es });
        const formattedTime = format(localDate, "hh:mm a", { locale: es });
        const formattedEndTime = format(localEndServiceDate, "hh:mm a", {
          locale: es,
        });

        return (
          <Card
            key={service._id.toString()}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row justify-between items-start p-5 gap-4">
                {/* Información Principal */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2
                        className="text-3xl font-bold tracking-tight capitalize"
                        style={{ color: theme.textPrimary }}
                      >
                        {service.serviceName}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="mt-1"
                        style={{
                          backgroundColor: theme.accentBg,
                          color: theme.textPrimary,
                        }}
                      >
                        {service.serviceDuration} min
                      </Badge>
                    </div>
                    {/* Botón eliminar para móviles (se oculta en desktop) */}
                    <div className="sm:hidden">
                      <DeleteService serviceId={service._id} Id={clientId} />
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5">
                        <Calendar
                          className="h-4 w-4"
                          style={{ color: theme.primary }}
                        />
                      </div>
                      <span>
                        <span
                          className="font-medium"
                          style={{ color: theme.textPrimary }}
                        >
                          {daysOfWeek[localDate.getDay()]}
                        </span>
                        , {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5">
                        <Clock
                          className="h-4 w-4"
                          style={{ color: theme.primary }}
                        />
                      </div>
                      <span style={{ color: theme.textSecondary }}>
                        {formattedTime} - {formattedEndTime}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 font-semibold"
                      style={{ color: theme.textPrimary }}
                    >
                      <div className="p-1.5">
                        <DollarSign
                          className="h-4 w-4"
                          style={{ color: theme.primary }}
                        />
                      </div>
                      <span className="text-lg">
                        {(service.servicePrice / 100).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Notas con estilo de post-it suave */}
                  <div
                    className="flex items-start gap-2 p-3 rounded-lg"
                    style={{
                      backgroundColor: theme.accentBg,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <StickyNote
                      className="h-4 w-4 mt-0.5"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm italic leading-snug"
                      style={{ color: theme.textSecondary }}
                    >
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
