"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SubscriptionFailurePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Pago rechazado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No se pudo procesar tu pago. Por favor, verifica tus datos e
              intenta nuevamente.
            </p>
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => router.push("/subscription")}
                className="w-full"
              >
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => router.push("/clients")}
                variant="outline"
                className="w-full"
              >
                Volver a Clientes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
