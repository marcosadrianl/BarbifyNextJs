"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAllServices } from "@/components/getAllClientServicesForShowing";

export function TimeCheckDashboard() {
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);
  const [refresh, setRefresh] = React.useState(false);

  // 🔁 Hook con refresh manual
  const { loading } = useAllServices(30, refresh);

  // 📅 Leer timestamp del cache
  const readLastUpdated = React.useCallback(() => {
    const lastSaved = localStorage.getItem("services_last_saved");
    if (lastSaved) {
      setLastUpdated(new Date(Number(lastSaved)).toLocaleString());
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
    <div className="self-end text-xs text-gray-600/80 select-none space-x-4 flex items-center">
      Ultima actualización: {lastUpdated ?? "Nunca"}
    </div>
  );
}
