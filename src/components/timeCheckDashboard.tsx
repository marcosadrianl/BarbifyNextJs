"use client";

import * as React from "react";
import useTheme from "@/hooks/useTheme";
import { useServicesStore } from "@/lib/store/services.store";

export function TimeCheckDashboard() {
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);
  const [refresh, setRefresh] = React.useState(false);
  const { theme } = useTheme();

  // 🔁 Hook con refresh manual
  const loading = useServicesStore((state) => state.loading);

  // 📅 Leer timestamp del cache
  const readLastUpdated = React.useCallback(() => {
    const lastSaved = localStorage.getItem("services_last_saved");
    if (lastSaved) {
      setLastUpdated(new Date(Number(lastSaved)).toLocaleString("es-AR"));
    }
  }, []);

  // 🔹 Al montar
  React.useEffect(() => {
    readLastUpdated();
  }, [readLastUpdated]);

  // 🔹 Cuando termina el refresh
  React.useEffect(() => {
    if (!loading && refresh) {
      readLastUpdated();
      setRefresh(false); // reset
    }
  }, [loading, refresh, readLastUpdated]);

  return (
    <div
      className="self-end text-xs select-none space-x-4 flex items-center"
      style={{ color: theme.textSecondary }}
    >
      Ultima actualización: {lastUpdated ?? "Nunca"}
    </div>
  );
}
