"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IClient } from "@/models/Clients";

export default function ClientHealthCard({ client }: { client: IClient }) {
  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-lg">Información de salud</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="alergias" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="alergias">Alergias</TabsTrigger>
            <TabsTrigger value="enfermedades">Enfermedades</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="alergias" className="mt-4">
            <HealthItem value={client.clientAllergies} />
          </TabsContent>

          <TabsContent value="enfermedades" className="mt-4">
            <HealthItem value={client.clientDiseases} />
          </TabsContent>

          <TabsContent value="medicamentos" className="mt-4">
            <HealthItem value={client.clientMedications} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function HealthItem({ value }: { value?: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">
      {value?.trim() ? value : "Sin información registrada"}
    </div>
  );
}
