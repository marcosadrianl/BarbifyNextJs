"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, AlertTriangle, CheckCheck } from "lucide-react";
import { IServiceCombined } from "@/models/models";
import { useServicesStore } from "@/lib/store/services.store";
import useTheme from "@/hooks/useTheme";

interface InactiveClient {
  clientId: string;
  clientName: string;
  clientLastName: string;
  lastServiceDate: Date;
  daysSinceLastService: number;
}

export default function InactiveClientsCard() {
  const [inactiveClients, setInactiveClients] = useState<InactiveClient[]>([]);
  const [loading, setLoading] = useState(true);
  const DAYS_LIMIT = 90;
  const { theme } = useTheme();

  // ✅ Usar el store directamente como pediste
  const services = useServicesStore((s) => s.services) as IServiceCombined[];

  useEffect(() => {
    if (!services || services.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const now = new Date();

      // ✅ CORRECCIÓN: Agrupar por clientId y usar serviceDate (NO updatedAt)
      const lastServiceByClient = services.reduce(
        (
          acc: Record<string, { date: Date; name: string; lastName: string }>,
          service,
        ) => {
          const clientId = service._id.toString();

          // ✅ IMPORTANTE: Usar serviceDate para saber cuándo fue el último servicio REAL
          // updatedAt se actualiza cuando modificas el cliente (nombre, teléfono, etc.)
          // pero eso NO significa que vino a un servicio
          const serviceDate = new Date(service.serviceDate);

          if (!acc[clientId] || serviceDate > acc[clientId].date) {
            acc[clientId] = {
              date: serviceDate,
              name: service.clientName,
              lastName: service.clientLastName,
            };
          }
          return acc;
        },
        {},
      );

      // ✅ Filtrar clientes inactivos y calcular días
      const inactive: InactiveClient[] = Object.entries(lastServiceByClient)
        .map(([clientId, data]) => {
          const diffMs = now.getTime() - data.date.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          return {
            clientId,
            clientName: data.name,
            clientLastName: data.lastName,
            lastServiceDate: data.date,
            daysSinceLastService: diffDays,
          };
        })
        .filter((client) => client.daysSinceLastService >= DAYS_LIMIT)
        // Ordenar por más días sin servicio primero
        .sort((a, b) => b.daysSinceLastService - a.daysSinceLastService);

      /* console.log("📊 Clientes inactivos:", {
        totalClientes: Object.keys(lastServiceByClient).length,
        inactivos: inactive.length,
        criterio: `≥ ${DAYS_LIMIT} días sin servicio`,
        detalles: inactive.slice(0, 5).map((c) => ({
          nombre: `${c.clientName} ${c.clientLastName}`,
          ultimoServicio: c.lastServiceDate.toLocaleDateString("es-AR"),
          diasSinVenir: c.daysSinceLastService,
        })),
      }); */

      setInactiveClients(inactive);
    } catch (error) {
      console.error("❌ Error calculando clientes inactivos:", error);
    } finally {
      setLoading(false);
    }
  }, [services]);

  if (loading) {
    return (
      <div
        className="rounded-md border p-4 w-1/4 flex items-center justify-center min-h-50"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
          color: theme.textPrimary,
        }}
      >
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          Calculando...
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-md border p-4 w-1/4 flex flex-col gap-4"
      style={{
        backgroundColor: theme.bgCard,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-medium flex items-center gap-2"
          style={{ color: theme.textPrimary }}
        >
          <Info className="h-4 w-4" style={{ color: theme.textSecondary }} />
          Clientes inactivos
        </h3>

        <span className="text-xs" style={{ color: theme.textSecondary }}>
          ≥ {DAYS_LIMIT} días
        </span>
      </div>

      {/* Metric */}
      <div className="flex items-center gap-3">
        {inactiveClients.length > 0 ? (
          <AlertTriangle className="h-5 w-5" style={{ color: theme.primary }} />
        ) : (
          <CheckCheck className="h-5 w-5" style={{ color: theme.primary }} />
        )}
        <p className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
          {inactiveClients.length}
        </p>
      </div>

      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {inactiveClients.length === 0 ? (
          <>
            ✅ Todos tus clientes han regresado en los últimos {DAYS_LIMIT} días
          </>
        ) : (
          <>
            Tienes{" "}
            <span className="font-medium" style={{ color: theme.textPrimary }}>
              {inactiveClients.length}
            </span>{" "}
            {inactiveClients.length === 1 ? "cliente" : "clientes"} que no{" "}
            {inactiveClients.length === 1 ? "ha" : "han"} regresado en los
            últimos {DAYS_LIMIT} días
          </>
        )}
      </p>

      {/* List */}
      {inactiveClients.length > 0 && (
        <div
          className="border rounded-md p-3 max-h-48 overflow-y-auto"
          style={{ borderColor: theme.border }}
        >
          <ul className="space-y-2 text-sm">
            {inactiveClients.slice(0, 5).map((client) => (
              <li
                key={client.clientId}
                className="flex items-center justify-between gap-2"
              >
                <Link
                  href={`/clients/${client.clientId}`}
                  className="hover:underline flex-1 truncate capitalize"
                  style={{ color: theme.primary }}
                  title={`${client.clientName} ${client.clientLastName}`}
                >
                  {client.clientName} {client.clientLastName}
                </Link>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: theme.textSecondary }}
                >
                  {client.daysSinceLastService}d
                </span>
              </li>
            ))}
            {inactiveClients.length > 5 && (
              <li
                className="text-xs text-center pt-2 border-t"
                style={{
                  color: theme.textSecondary,
                  borderTopColor: theme.border,
                }}
              >
                + {inactiveClients.length - 5} más
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div
        className="border-t pt-3 mt-auto"
        style={{ borderTopColor: theme.border }}
      >
        <p
          className="text-xs font-medium mb-1"
          style={{ color: theme.textPrimary }}
        >
          Acciones sugeridas
        </p>
        <ul
          className="text-xs list-disc pl-4 space-y-1"
          style={{ color: theme.textSecondary }}
        >
          <li>Contacta con los clientes. </li>
          <li>Ofrecer promoción de retorno.</li>
        </ul>
      </div>
    </div>
  );
}
