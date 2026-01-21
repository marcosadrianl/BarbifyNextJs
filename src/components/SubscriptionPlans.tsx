"use client";

import { useState } from "react";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from "@/types/subscription.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan;
}

export function SubscriptionPlans({
  currentPlan = "free",
}: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setLoading(plan);
    try {
      // Si es plan gratuito, activar directamente sin pago
      if (plan === "free") {
        const response = await fetch("/api/mp/activate-free", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al activar plan gratuito");
        }

        // Recargar la página para actualizar el estado
        window.location.reload();
        return;
      }

      // Para planes de pago, crear preferencia de Mercado Pago
      const response = await fetch("/api/mp/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la suscripción");
      }

      const data = await response.json();

      // Redirigir a Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
        const isCurrentPlan = currentPlan === plan.id;
        const isFree = plan.id === "free";

        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.id === "premium" ? "border-primary shadow-lg" : ""
            } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
          >
            {plan.id === "premium" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${(plan.price / 100).toFixed(2)}
                </span>
                {!isFree && <span className="text-muted-foreground">/mes</span>}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={
                  isCurrentPlan
                    ? "outline"
                    : plan.id === "premium"
                      ? "default"
                      : "secondary"
                }
                disabled={isCurrentPlan || loading === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loading === plan.id
                  ? "Procesando..."
                  : isCurrentPlan
                    ? "Plan Actual"
                    : isFree
                      ? "Activar Plan Gratuito"
                      : "Suscribirse"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
