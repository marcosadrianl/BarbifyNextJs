"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, AlertTriangle, CheckCheck } from "lucide-react";

export default function InactiveClientsCard() {
  const [inactiveClients, setInactiveClients] = useState<string[]>([]);
  const DAYS_LIMIT = 90;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("services");
      if (!raw) return;

      const services = JSON.parse(raw);
      const now = new Date();

      const lastUpdateByClient: Record<string, Date> = services.reduce(
        (acc: Record<string, Date>, s: any) => {
          const date = new Date(s.updatedAt ?? s.createdAt);
          if (!acc[s.clientId] || date > acc[s.clientId]) {
            acc[s.clientId] = date;
          }
          return acc;
        },
        {}
      );

      const inactive = Object.entries(lastUpdateByClient)
        .filter(([_, lastDate]) => {
          const diffDays =
            (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays >= DAYS_LIMIT;
        })
        .map(([clientId]) => clientId);

      setInactiveClients(inactive);
    } catch (error) {
      console.error("Error leyendo servicios:", error);
    }
  }, []);

  return (
    <div className="rounded-xl border bg-background p-4 flex flex-col gap-4 w-1/4">
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
        {" "}
        Tienes <span className="font-medium">
          {inactiveClients.length}
        </span>{" "}
        clientes que no regresaron en los últimos {DAYS_LIMIT} días
      </p>

      {/* List */}
      {inactiveClients.length > 0 && (
        <ul className="space-y-1 text-sm">
          {inactiveClients.map((id) => (
            <li key={id}>
              <Link
                href={`/clients/${id}`}
                target="_blank"
                className="text-primary hover:underline"
              >
                Ver cliente {id.slice(-6)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="border-t pt-3">
        <p className="text-xs font-medium mb-1">Acciones sugeridas</p>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Contactar via whatsapp o correo </li>
          <li>Ofrecer promoción de retorno</li>
        </ul>
      </div>
    </div>
  );
}
