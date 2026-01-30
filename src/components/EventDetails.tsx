// components/EventDetails.tsx
import { ServiceEvent } from "@/components/calendar";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  DollarSign,
  Phone,
  User,
  Timer,
  StickyNote,
} from "lucide-react";
import { IServiceCombined } from "@/models/models";

export default function EventDetails({
  selectedEvents,
}: {
  selectedEvents: IServiceCombined[] | null;
}) {
  console.log("selectedEvents en EventDetails:", selectedEvents);
  // Estado vacío
  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <Card className="h-full rounded-none border-r-accent border-t-0 border-b-0 border-l-0">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-100">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <CardTitle className="text-center text-gray-400">
            Selecciona una fecha
          </CardTitle>
          <CardDescription className="text-center mt-2">
            Haz clic en una fecha del calendario para ver los detalles
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  // Procesar fecha
  const serviceDate = new Date(selectedEvents[0].serviceDate);
  const formattedDate = format(serviceDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Comparación de fechas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedServiceDate = new Date(serviceDate);
  normalizedServiceDate.setHours(0, 0, 0, 0);

  const isPast = normalizedServiceDate < today;
  const isToday = normalizedServiceDate.getTime() === today.getTime();

  return (
    <Card className="h-full flex flex-col rounded-none border-r-accent border-t-0 border-b-0 border-l-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">
              {isToday
                ? "Hoy"
                : isPast
                  ? "Servicios Pasados"
                  : "Próximos Servicios"}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {formattedDateCapitalized}
            </CardDescription>
          </div>
          <Badge
            variant={isToday ? "default" : isPast ? "secondary" : "outline"}
            className="text-sm px-3 py-1"
          >
            {selectedEvents.length}{" "}
            {selectedEvents.length === 1 ? "cita" : "citas"}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-0 ">
        <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
          <div className="space-y-4 mb-8">
            {selectedEvents.map((event, index) => (
              <Card
                key={event._id.toString() + index}
                className="overflow-hidden "
              >
                <CardHeader className="bg-[#ffd49d]/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/clients/${event._id}`}
                        className="hover:underline"
                      >
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {event.clientName} {event.clientLastName}
                        </CardTitle>
                      </Link>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3 ">
                  {/* Servicio */}
                  <div className="flex items-start gap-2">
                    <StickyNote className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Servicio</p>
                      <p className="text-sm text-gray-400">
                        {event.serviceName}
                      </p>
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hora</p>
                      <p className="text-sm text-gray-400">
                        {new Date(event.serviceDate).toLocaleTimeString(
                          "es-AR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          },
                        )}{" "}
                        hs
                      </p>
                    </div>
                  </div>

                  {/* Duración */}
                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Duración</p>
                      <p className="text-sm text-gray-400">
                        {event.serviceDuration} minutos
                      </p>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Precio</p>
                      <p className="text-sm text-gray-400">
                        $
                        {(event.servicePrice / 100).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Notas */}
                  {event.serviceNotes && (
                    <div className="flex items-start gap-2">
                      <StickyNote className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Notas</p>
                        <p className="text-sm text-gray-400 italic">
                          {event.serviceNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="my-3" />

                  {/* Botón de WhatsApp */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Link
                      href={`https://api.whatsapp.com/send/?phone=${event.clientPhone}&text=Hola%21%20tenemos%20un%20turno%20pendiente%20&type=phone_number&app_absent=0`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contactar: {event.clientPhone}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
