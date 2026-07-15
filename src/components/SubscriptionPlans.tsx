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

export function SubscriptionPlans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Plan Premium</CardTitle>
        <CardDescription className="mt-2 text-red-600 font-medium">
          Tu periodo de prueba ha finalizado
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">$9.99</span>
          <span className="text-muted-foreground">/mes</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 list-disc list-inside text-sm text-muted-foreground">
          <li>Acceso ilimitado a todas las funciones</li>
          <li>Soporte prioritario</li>
          <li>Actualizaciones exclusivas</li>
        </ul>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Suscríbete ahora
        </Button>
        <p className="mt-2 text-xs text-center text-muted-foreground">
          ¿Tienes dudas?{" "}
          <a href="mailto:contacto@tuempresa.com" className="underline">
            Contáctanos
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
