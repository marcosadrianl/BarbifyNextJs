"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    setPlan(planParam);
  }, [searchParams]);

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Suscripción exitosa!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Tu suscripción al plan <strong>{plan}</strong> ha sido procesada
              correctamente.
            </p>
            <p className="text-sm text-muted-foreground">
              Recibirás un correo de confirmación con los detalles de tu
              suscripción.
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
