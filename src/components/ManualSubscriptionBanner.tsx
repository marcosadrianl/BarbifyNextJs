"use client";

/**
 * 🆕 Banner de estado de suscripción manual
 *
 * Muestra:
 * - Días restantes
 * - Fecha de vencimiento
 * - Advertencia si está próximo a vencer
 */

import { useEffect, useState } from "react";
import { IUser } from "@/models/Users.type";
import { checkManualSubscriptionStatus } from "@/utils/subscriptionCheckManual";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ManualSubscriptionBannerProps {
  user: IUser | null;
}

export function ManualSubscriptionBanner({
  user,
}: ManualSubscriptionBannerProps) {
  const [status, setStatus] = useState(checkManualSubscriptionStatus(user));

  useEffect(() => {
    setStatus(checkManualSubscriptionStatus(user));
  }, [user]);

  if (!user || status.isExpired) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>⚠️ Suscripción Expirada</strong>
          <p className="text-sm mt-1">
            Tu suscripción ha vencido. Contacta con el administrador para
            renovarla.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  const daysWarningThreshold = 7; // Mostrar alerta si quedan 7 días o menos
  const isWarning = status.daysRemaining <= daysWarningThreshold;

  return (
    <Alert
      className={`${
        isWarning
          ? "bg-amber-50 border-amber-200"
          : "bg-green-50 border-green-200"
      }`}
    >
      {isWarning ? (
        <Clock className="h-4 w-4 text-amber-600" />
      ) : (
        <CheckCircle className="h-4 w-4 text-green-600" />
      )}
      <AlertDescription
        className={isWarning ? "text-amber-800" : "text-green-800"}
      >
        {isWarning ? (
          <>
            <strong>⏰ Tu suscripción vence pronto</strong>
            <p className="text-sm mt-1">
              {status.expiresAt && (
                <>
                  Vencimiento:{" "}
                  {format(status.expiresAt, "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}{" "}
                  ({status.daysRemaining} días)
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <strong>✅ Suscripción Activa</strong>
            <p className="text-sm mt-1">
              {status.expiresAt && (
                <>
                  Vencimiento:{" "}
                  {format(status.expiresAt, "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}{" "}
                  ({status.daysRemaining} días)
                </>
              )}
            </p>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
