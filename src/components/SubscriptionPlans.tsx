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
  currentPlan = "standard",
}: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setLoading(plan);
    try {
      // Para planes de pago, crear preferencia de Mercado Pago
      const response = await fetch("/api/mp/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error del servidor:", data);
        throw new Error(data.error || "Error al crear la suscripción");
      }

      // Redirigir a Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("No se recibió URL de pago de Mercado Pago");
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert(
        `Error al procesar suscripción: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
        const isCurrentPlan = currentPlan === plan.id;

        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.id === "premium" ? "border-primary shadow-lg" : ""
            } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
          >
            {plan.id === "standard" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  $
                  {(plan.price / 100).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-muted-foreground">/mes</span>
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

            <CardFooter className="mt-auto">
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
                    : "Suscribirse"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
