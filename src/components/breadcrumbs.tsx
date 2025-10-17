"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { notFound } from "next/navigation";
import { no } from "zod/locales";

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();

  // Filtramos "clients" del primer segmento
  const filteredSegments = segments.filter(
    (seg, idx) => !(idx === 0 && seg === "clients")
  );

  const base = "/clients";
  const [clientName, setClientName] = useState<string | null>(null);

  const clientId =
    filteredSegments[0] && /^[a-f\d]{24}$/i.test(filteredSegments[0])
      ? filteredSegments[0]
      : null;

  useEffect(() => {
    if (clientId) {
      fetch(`/api/clients/${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          setClientName(data.clientName || clientId);
        })
        .catch(() => notFound());
    }
  }, [clientId]);

  // Validación de rutas internas seguras
  function isSafeInternalRoute(url: string) {
    // Solo permite rutas que empiezan con /clients y no contienen // ni ://
    return (
      url.startsWith(base) && !url.startsWith("//") && !url.includes("://")
    );
  }

  return (
    <nav className="flex gap-2 w-32">
      {/* Nivel fijo */}
      <Link href={base} className="hover:underline">
        Clientes
      </Link>

      {filteredSegments.map((segment, idx) => {
        const href = `${base}/${filteredSegments.slice(0, idx + 1).join("/")}`;

        // Labels predefinidos
        const labels: Record<string, string> = {
          new: "Nuevo Cliente",
          history: "Historial",
          edit: "Editar Cliente",
        };

        // Determinar el label
        let label;
        if (idx === 0 && clientId) {
          label = clientName || "Cargando...";
        } else {
          label = labels[segment] || segment; // fallback al segmento si no hay label
        }

        // Validar la ruta antes de renderizar el link
        if (!isSafeInternalRoute(href)) {
          return null;
        }

        return (
          <span key={segment} className="flex gap-2 w-fit">
            <span>/</span>
            <Link
              href={href}
              className="hover:underline capitalize text-nowrap"
            >
              {label || "Cargando..."}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
