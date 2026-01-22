"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  isTrialExpired: boolean;
  daysRemaining: number;
  message: string;
  plan: string;
}

export function TrialBanner() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/users/subscription-status");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Verificar cada 5 minutos
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !status) return null;

  // No mostrar banner si tiene suscripción activa pagada
  if (!status.isTrial && status.isActive) return null;

  // Trial expirado
  if (status.isTrialExpired) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Período de prueba expirado</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Tu período de prueba ha finalizado. Actualiza tu plan para seguir
            disfrutando de todas las funcionalidades.
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => router.push("/subscription")}
          >
            Ver Planes
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Trial activo con advertencia si quedan pocos días
  if (status.isTrial && status.daysRemaining <= 3) {
    return (
      <Alert variant="default" className="mb-4 border-yellow-500 bg-yellow-50">
        <Clock className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">
          Quedan {status.daysRemaining} días de prueba
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between text-yellow-700">
          <span>
            Tu período de prueba está por finalizar. ¡Actualiza ahora y sigue
            disfrutando de Barbify!
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-4 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            onClick={() => router.push("/subscription")}
          >
            Ver Planes
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Trial activo con información
  if (status.isTrial && status.daysRemaining > 3) {
    return (
      <Alert variant="default" className="mb-4 border-blue-500 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">
          Período de prueba gratuito
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Tienes {status.daysRemaining} días restantes de prueba gratuita del
          plan Standard. ¡Aprovecha todas las funcionalidades!
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
