import React, { useEffect, useState } from "react";
import type { IService } from "@/models/Clients"; // si lo tenés tipado

export function useAllServices() {
  const [events, setEvents] = useState<IService[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/diary");
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error("Error al obtener los datos del servidor:", error);
      }
    };
    fetchData();
  }, []);

  return events;
}
export function useStoreServicesInLocalStorage() {
  const services = useAllServices();

  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("services", JSON.stringify(services));
      console.log("SERVICES GUARDADOS:", services);
    }
  }, [services]);
}
