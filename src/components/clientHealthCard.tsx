"use client";

import useTheme from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IClient } from "@/models/Clients.schema";

export default function ClientHealthCard({ client }: { client: IClient }) {
  const { theme } = useTheme();
  function HealthItem({
    value,
    description,
  }: {
    value?: string;
    description?: string;
  }) {
    return (
      <div
        className="rounded-lg p-4 text-sm leading-relaxed"
        style={{
          backgroundColor: theme.accentBg,
          borderColor: theme.border,
          color: theme.textSecondary,
        }}
      >
        {value?.trim()
          ? value
          : `Sin información de ${description} registrada.`}
      </div>
    );
  }

  return (
    <Card
      className="w-full rounded-2xl shadow-sm"
      style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
    >
      <CardHeader
        className=""
        style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
      >
        <CardTitle className="text-lg" style={{ color: theme.textPrimary }}>
          Información de salud
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="alergias" className="w-full">
          <TabsList
            className="grid grid-cols-3 w-full"
            style={{
              background: theme.bg,
            }}
          >
            <TabsTrigger value="alergias">Alergias</TabsTrigger>
            <TabsTrigger value="enfermedades">Enfermedades</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="alergias" className="mt-4">
            <HealthItem value={client.clientAllergies} description="alergias" />
          </TabsContent>

          <TabsContent value="enfermedades" className="mt-4">
            <HealthItem
              value={client.clientDiseases}
              description="enfermedades"
            />
          </TabsContent>

          <TabsContent value="medicamentos" className="mt-4">
            <HealthItem
              value={client.clientMedications}
              description="medicamentos"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
