"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas verificando si el usuario tiene cuenta activa
 * y si su período de prueba no ha expirado.
 * Si userActive es false o el trial expiró, redirige a /subscription
 */
export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/login");
        return;
      }

      // Verificar el estado de la suscripción en el servidor
      try {
        const response = await fetch("/api/users/subscription-status");
        const data = await response.json();

        if (!data.hasAccess) {
          router.push("/subscription");
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Error checking subscription:", error);
        // En caso de error, permitir acceso pero marcar que terminó de verificar
        setChecking(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  // Mientras carga o verifica, mostrar spinner
  if (status === "loading" || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay sesión, no mostrar contenido
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
