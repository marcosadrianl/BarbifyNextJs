"use client";

import { useEffect } from "react";
import { useServicesStore } from "@/lib/store/services.store";

export function ServicesBootstrap() {
  const loadFromCache = useServicesStore((s) => s.loadFromCache);
  const refreshFromAPI = useServicesStore((s) => s.refreshFromAPI);
  const services = useServicesStore((s) => s.services);

  useEffect(() => {
    loadFromCache();

    if (services.length === 0) {
      refreshFromAPI();
    }
  }, []);

  return null;
}
