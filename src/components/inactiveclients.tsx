"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, AlertTriangle, CheckCheck } from "lucide-react";
import { useServicesStore } from "@/lib/store/services.store";

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

  // ✅ Usar el store directamente como pediste
  const services = useServicesStore((s) => s.services);

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
          service
        ) => {
          const clientId = service.clientId;

          // ✅ IMPORTANTE: Usar serviceDate para saber cuándo fue el último servicio REAL
          // updatedAt se actualiza cuando modificas el cliente (nombre, teléfono, etc.)
          // pero eso NO significa que vino a un servicio
          const serviceDate = new Date(service.clientServices.serviceDate);

          if (!acc[clientId] || serviceDate > acc[clientId].date) {
            acc[clientId] = {
              date: serviceDate,
              name: service.clientName,
              lastName: service.clientLastName,
            };
          }
          return acc;
        },
        {}
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
      /* 
      console.log("📊 Clientes inactivos:", {
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
      <div className="rounded-md border text-black bg-white p-4 w-1/4 flex items-center justify-center min-h-50">
        <p className="text-sm text-muted-foreground">Calculando...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border text-black bg-white p-4 w-1/4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          Clientes inactivos
        </h3>

        <span className="text-xs text-muted-foreground">
          ≥ {DAYS_LIMIT} días
        </span>
      </div>

      {/* Metric */}
      <div className="flex items-center gap-3">
        {inactiveClients.length > 0 ? (
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        ) : (
          <CheckCheck className="h-5 w-5 text-green-500" />
        )}
        <p className="text-2xl font-bold">{inactiveClients.length}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        {inactiveClients.length === 0 ? (
          <>
            ✅ Todos tus clientes han regresado en los últimos {DAYS_LIMIT} días
          </>
        ) : (
          <>
            Tienes <span className="font-medium">{inactiveClients.length}</span>{" "}
            {inactiveClients.length === 1 ? "cliente" : "clientes"} que no{" "}
            {inactiveClients.length === 1 ? "ha" : "han"} regresado en los
            últimos {DAYS_LIMIT} días
          </>
        )}
      </p>

      {/* List */}
      {inactiveClients.length > 0 && (
        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
          <ul className="space-y-2 text-sm">
            {inactiveClients.slice(0, 5).map((client) => (
              <li
                key={client.clientId}
                className="flex items-center justify-between gap-2"
              >
                <Link
                  href={`/clients/${client.clientId}`}
                  className="text-primary hover:underline flex-1 truncate"
                  title={`${client.clientName} ${client.clientLastName}`}
                >
                  {client.clientName} {client.clientLastName}
                </Link>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {client.daysSinceLastService}d
                </span>
              </li>
            ))}
            {inactiveClients.length > 5 && (
              <li className="text-xs text-muted-foreground text-center pt-2 border-t">
                + {inactiveClients.length - 5} más
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="border-t pt-3 mt-auto">
        <p className="text-xs font-medium mb-1">Acciones sugeridas</p>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Contactar vía WhatsApp o correo</li>
          <li>Ofrecer promoción de retorno</li>
        </ul>
      </div>
    </div>
  );
}
