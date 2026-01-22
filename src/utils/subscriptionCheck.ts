/**
 * Utilidades para verificar el estado de la suscripción del usuario
 */

import { IUser } from "@/models/Users.type";

export interface SubscriptionCheckResult {
  isActive: boolean;
  isTrial: boolean;
  isTrialExpired: boolean;
  daysRemaining: number;
  message: string;
}

/**
 * Verifica el estado de la suscripción del usuario
 * @param user - Objeto de usuario de la base de datos
 * @returns Resultado del chequeo de suscripción
 */
export function checkSubscriptionStatus(
  user: IUser | null,
): SubscriptionCheckResult {
  if (!user) {
    return {
      isActive: false,
      isTrial: false,
      isTrialExpired: false,
      daysRemaining: 0,
      message: "Usuario no encontrado",
    };
  }

  const subscription = user.subscription;

  if (!subscription) {
    return {
      isActive: false,
      isTrial: false,
      isTrialExpired: false,
      daysRemaining: 0,
      message: "Sin suscripción",
    };
  }

  const now = new Date();
  const isTrial = subscription.status === "trial";

  // Si está en período de prueba
  if (isTrial && subscription.trialEndDate) {
    const trialEnd = new Date(subscription.trialEndDate);
    const isTrialExpired = trialEnd < now;
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    if (isTrialExpired) {
      return {
        isActive: false,
        isTrial: true,
        isTrialExpired: true,
        daysRemaining: 0,
        message: "Período de prueba expirado. Por favor, actualiza tu plan.",
      };
    }

    return {
      isActive: true,
      isTrial: true,
      isTrialExpired: false,
      daysRemaining,
      message: `Período de prueba activo. ${daysRemaining} días restantes.`,
    };
  }

  // Si tiene suscripción activa
  if (subscription.status === "active") {
    return {
      isActive: true,
      isTrial: false,
      isTrialExpired: false,
      daysRemaining: -1, // -1 indica suscripción pagada sin límite
      message: "Suscripción activa",
    };
  }

  // Para cualquier otro estado (cancelled, expired, paused, pending)
  return {
    isActive: false,
    isTrial: false,
    isTrialExpired: false,
    daysRemaining: 0,
    message: `Suscripción ${subscription.status}. Por favor, actualiza tu plan.`,
  };
}

/**
 * Determina si el usuario debe tener acceso a la aplicación
 * @param user - Objeto de usuario de la base de datos
 * @returns true si el usuario tiene acceso, false si no
 */
export function hasApplicationAccess(user: IUser | null): boolean {
  const status = checkSubscriptionStatus(user);
  return status.isActive;
}
