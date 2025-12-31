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
    <Card>
      <CardHeader>
        <CardTitle>Última actualización</CardTitle>

        <CardDescription className="flex items-center justify-between gap-2">
          <span>{lastUpdated ?? "Nunca"}</span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRefresh(true);
              window.location.reload();
            }}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar ahora"}
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
