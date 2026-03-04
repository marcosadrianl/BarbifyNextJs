/**
 * 🆕 NUEVO SISTEMA MANUAL: Utilidades para verificar el estado de suscripción
 * basado en el campo subscriptionExpiresAt (sin Mercado Pago)
 *
 * El acceso se valida SOLO por la fecha de vencimiento
 * Un CRON job valida diariamente este campo
 */

import { IUser } from "@/models/Users.type";

export interface ManualSubscriptionCheckResult {
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  expiresAt: Date | null;
  message: string;
}

/**
 * Verifica si la suscripción manual está activa
 * @param user - Objeto de usuario de la base de datos
 * @returns Resultado del chequeo de suscripción manual
 */
export function checkManualSubscriptionStatus(
  user: IUser | null,
): ManualSubscriptionCheckResult {
  if (!user) {
    return {
      isActive: false,
      isExpired: true,
      daysRemaining: 0,
      expiresAt: null,
      message: "Usuario no encontrado",
    };
  }

  const subscription = user.subscription;

  if (!subscription) {
    return {
      isActive: false,
      isExpired: true,
      daysRemaining: 0,
      expiresAt: null,
      message: "Sin suscripción",
    };
  }

  // 🆕 Verificar por subscriptionExpiresAt
  if (!subscription.subscriptionExpiresAt) {
    return {
      isActive: false,
      isExpired: true,
      daysRemaining: 0,
      expiresAt: null,
      message: "Suscripción no configurada. Contacta al administrador.",
    };
  }

  const now = new Date();
  const expiresAt = new Date(subscription.subscriptionExpiresAt);
  const isExpired = expiresAt < now;

  if (isExpired) {
    return {
      isActive: false,
      isExpired: true,
      daysRemaining: 0,
      expiresAt,
      message: "Suscripción expirada. Por favor, contacta al administrador.",
    };
  }

  const daysRemaining = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    isActive: true,
    isExpired: false,
    daysRemaining,
    expiresAt,
    message: `Suscripción activa hasta ${expiresAt.toLocaleDateString("es-AR")}. ${daysRemaining} días restantes.`,
  };
}

/**
 * Determina si el usuario debe tener acceso a la aplicación (sistema manual)
 * @param user - Objeto de usuario de la base de datos
 * @returns true si el usuario tiene acceso, false si no
 */
export function hasApplicationAccessManual(user: IUser | null): boolean {
  const status = checkManualSubscriptionStatus(user);
  return status.isActive;
}

/**
 * Helper para obtener la fecha de vencimiento formateada
 */
export function getFormattedExpiryDate(user: IUser | null): string | null {
  if (!user?.subscription?.subscriptionExpiresAt) {
    return null;
  }

  const date = new Date(user.subscription.subscriptionExpiresAt);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
