"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import useTheme from "@/hooks/useTheme";

export default function EventDetails({
  selectedEvents,
}: {
  selectedEvents: IServiceCombined[] | null;
}) {
  const { theme } = useTheme();

  const themeStyles = {
    "--theme-bgCard": theme.bgCard,
    "--theme-accent-bg": theme.accentBg,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-text-muted": theme.textMuted,
    "--theme-border": theme.border,
  } as React.CSSProperties;

  if (!selectedEvents || selectedEvents.length === 0) {
    return (
      <Card
        className="h-full rounded-none border-r-accent border-t-0 border-b-0 border-l-0 bg-[var(--theme-bgCard)] text-[var(--theme-text-primary)]"
        style={themeStyles}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-100">
          <Calendar className="h-16 w-16 mb-4 text-[var(--theme-text-muted)]" />
          <CardTitle className="text-center text-[var(--theme-text-secondary)]">
            Selecciona una fecha
          </CardTitle>
          <CardDescription className="text-center mt-2 text-[var(--theme-text-secondary)]">
            Haz clic en una fecha del calendario para ver los detalles
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const serviceDate = new Date(selectedEvents[0].serviceDate);
  const formattedDate = format(serviceDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedServiceDate = new Date(serviceDate);
  normalizedServiceDate.setHours(0, 0, 0, 0);

  const isPast = normalizedServiceDate < today;
  const isToday = normalizedServiceDate.getTime() === today.getTime();

  return (
    <Card
      className="h-full flex flex-col rounded-none border-r-accent border-t-0 border-b-0 border-l-0 bg-[var(--theme-bgCard)] text-[var(--theme-text-primary)]"
      style={themeStyles}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl text-[var(--theme-text-primary)]">
              {isToday
                ? "Hoy"
                : isPast
                  ? "Servicios Pasados"
                  : "Próximos Servicios"}
            </CardTitle>
            <CardDescription className="text-base mt-1 text-[var(--theme-text-secondary)]">
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

      <Separator className="bg-[var(--theme-border)]" />

      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
          <div className="space-y-4 mb-8">
            {selectedEvents.map((event, index) => (
              <Card
                key={event._id.toString() + index}
                className="overflow-hidden border-[var(--theme-border)] bg-[var(--theme-bgCard)]"
              >
                <CardHeader className="p-4 bg-[var(--theme-accent-bg)]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/clients/${event._id}`}
                        className="hover:underline"
                      >
                        <CardTitle className="text-lg flex items-center gap-2 text-[var(--theme-text-primary)]">
                          <User className="h-4 w-4" />
                          {event.clientName} {event.clientLastName}
                        </CardTitle>
                      </Link>
                    </div>
                    <Badge variant="outline" className="ml-2 text-sm px-3 py-1 text-[var(--theme-text-primary)]">
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <StickyNote className="h-4 w-4 mt-0.5 text-[var(--theme-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                        Servicio
                      </p>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
                        {event.serviceName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-[var(--theme-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                        Hora
                      </p>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
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

                  <div className="flex items-start gap-2">
                    <Timer className="h-4 w-4 mt-0.5 text-[var(--theme-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                        Duración
                      </p>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
                        {event.serviceDuration} minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 mt-0.5 text-[var(--theme-text-muted)]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                        Precio
                      </p>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
                        ${" "}
                        {(event.servicePrice / 100).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {event.serviceNotes && (
                    <div className="flex items-start gap-2">
                      <StickyNote className="h-4 w-4 mt-0.5 text-[var(--theme-text-muted)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                          Notas
                        </p>
                        <p className="text-sm text-[var(--theme-text-secondary)] italic">
                          {event.serviceNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="my-3 bg-[var(--theme-border)]" />

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[var(--theme-border)] text-[var(--theme-text-accentText)] hover:bg-[var(--theme-accent-bg)]"
                    size="sm"
                  >
                    <Link
                      href={`https://api.whatsapp.com/send/?phone=${event.clientPhone}&text=Hola%21%20tenemos%20un%20turno%20pendiente%20&type=phone_number&app_absent=0`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4 mr-2 " />
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
