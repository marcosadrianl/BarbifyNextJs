"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function SubscriptionPendingPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Pago pendiente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Tu pago está siendo procesado. Te notificaremos cuando se complete
              la transacción.
            </p>
            <p className="text-sm text-muted-foreground">
              Esto puede tomar unos minutos.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
