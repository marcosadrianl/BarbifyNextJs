"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas verificando si el usuario tiene cuenta activa.
 * Si userActive es false, redirige a /subscription
 */
export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Si el usuario no está activo, redirigir a subscription
    if (session.user?.userActive === false) {
      router.push("/subscription");
    }
  }, [session, status, router]);

  // Mientras carga, no mostrar nada
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay sesión o usuario inactivo, no mostrar contenido
  if (!session || session.user?.userActive === false) {
    return null;
  }

  return <>{children}</>;
}
