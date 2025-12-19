import { useEffect, useState } from "react";
import type { IService } from "@/models/Clients";
import type { IClient } from "@/models/Clients";

const CACHE_KEY = "services";
const CACHE_TIME_KEY = "services_last_saved";

export function useAllServices(minutes = 5, forceRefresh = false) {
  type ServiceWithClientSex = IService & Pick<IClient, "clientSex">;

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
