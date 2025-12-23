"use client";

import { useEffect, useState } from "react";
import type { IService } from "@/models/Clients";
import type { IClient } from "@/models/Clients";

const CACHE_KEY = "services";
const CACHE_TIME_KEY = "services_last_saved";

/**
 * Hook que devuelve la lista de servicios de todos los clientes.
 * La lista se ordena por fecha de servicio, desde la más reciente a la más antigua.
 * Utiliza un cache para evitar solicitudes innecesarias al servidor,
 * el cual se actualiza cada {minutes} minutos. Si se proporciona {forceRefresh=true},
 * se forzará a refrescar el cache.
 *
 * @param {number} minutes - Tiempo en minutos para refrescar el cache.
 * @param {boolean} forceRefresh - Si se debe forzar a refrescar el cache.
 * @returns {{ services: ServiceWithClientSex[], loading: boolean, error: unknown }}
 */
export function useAllServices(minutes = 30, forceRefresh = false) {
  type ServiceWithClientSex = IService &
    Pick<IClient, "clientSex" | "clientActive" | "createdAt">;

  const [services, setServices] = useState<ServiceWithClientSex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const ttl = minutes * 60 * 1000;

    const load = async () => {
      try {
        if (!forceRefresh) {
          const cached = localStorage.getItem(CACHE_KEY);
          const lastSaved = localStorage.getItem(CACHE_TIME_KEY);

          if (cached && lastSaved) {
            const diff = Date.now() - Number(lastSaved);

            if (diff < ttl) {
              setServices(JSON.parse(cached));
              setLoading(false);
              return;
            }
          }
        }

        // 🔥 Cache vacío o expirado → fetch
        const res = await fetch("/api/diary");
        const json = await res.json();

        const data: ServiceWithClientSex[] = json.data || [];

        setServices(
          data.sort((a, b) => {
            return (
              new Date(b.serviceDate).getTime() -
              new Date(a.serviceDate).getTime()
            );
          })
        );
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch (err) {
        console.error("Error cargando services:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [minutes, forceRefresh]);

  return { services, loading, error };
}
