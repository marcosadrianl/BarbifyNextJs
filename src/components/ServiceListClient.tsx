"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IService } from "@/models/Service.type";
import { History, ChevronRight, NotebookPen } from "lucide-react";
import Link from "next/link";
import useTheme from "@/hooks/useTheme";

export default function ServiceListClient({
  services,
  clientId,
}: {
  services: any[];
  clientId: string;
}) {
  const { theme } = useTheme();

  const getDateStyle = (serviceDate: string | Date | null) => {
    const now = new Date();
    const date = serviceDate ? new Date(serviceDate) : null;

    if (date && date > now) {
      return {
        fontSize: 10,
        fontWeight: 600,
        background: theme.primary + "22",
        padding: "4px 8px",
        borderRadius: 9999,
        color: theme.primary,
      } as React.CSSProperties;
    }
    return {
      fontSize: 10,
      fontWeight: 600,
      background: theme.bgCard,
      padding: "4px 8px",
      borderRadius: 9999,
      color: theme.textSecondary,
    } as React.CSSProperties;
  };

  return (
    <div
      style={{
        background: theme.bgCard,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
      className="border shadow-sm h-fit p-5 rounded-3xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div>
            <History
              className="h-5 w-5"
              style={{ color: theme.textSecondary }}
            />
          </div>
          <h2
            style={{ color: theme.textPrimary }}
            className="text-xl font-bold"
          >
            Últimos Servicios
          </h2>
        </div>

        <Link
          href={`/clients/${clientId}/history`}
          className={`text-xs font-semibold flex items-center gap-1`}
          style={{ color: theme.textSecondary }}
        >
          Ver todos <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {services.length === 0 ? (
          <div
            className="py-8 text-center rounded-2xl border border-dashed"
            style={{ background: theme.bg, borderColor: theme.border }}
          >
            <p style={{ color: theme.textSecondary }} className="text-sm">
              No hay servicios registrados aún
            </p>
          </div>
        ) : (
          services
            .slice()
            .reverse()
            .slice(0, 5)
            .map((service: any, index) => (
              <div
                key={index}
                className="group p-3 transition-colors rounded-2xl border"
                style={{ background: theme.bg, borderColor: theme.border }}
              >
                <div className="flex flex-row justify-between items-start mb-1">
                  <p
                    className="text-sm font-bold capitalize"
                    style={{ color: theme.textPrimary }}
                  >
                    {service.serviceName}
                  </p>
                  <p
                    style={getDateStyle(service.serviceDate)}
                    title={
                      service.serviceDate &&
                      new Date(service.serviceDate) > new Date()
                        ? "Próxima cita"
                        : ""
                    }
                  >
                    {service.serviceDate
                      ? format(new Date(service.serviceDate), "dd/MM/yyyy", {
                          locale: es,
                        })
                      : "-"}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2"
                  style={{ color: theme.textSecondary }}
                >
                  <NotebookPen className="h-3 w-3 opacity-50" />
                  <p
                    className="text-xs italic truncate"
                    style={{ color: theme.textSecondary }}
                  >
                    {service.serviceNotes || "Sin notas adicionales"}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
