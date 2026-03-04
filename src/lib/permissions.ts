import { IUser } from "@/models/Users.type";
import { SubscriptionPlan } from "@/types/subscription.types";

/**
 * Define las funcionalidades disponibles en cada plan
 */
export const PLAN_FEATURES = {
  standard: {
    // Páginas completas
    pages: {
      dashboard: true,
      clients: true,
      barbers: false, // Solo 1 barbero (el owner)
      appointments: true,
      diary: false, // Agenda solo en premium
      insights: true, // Insights básico en standard
      analytics: false, // Analytics básicos en dashboard solamente
      reports: false, // Reportes limitados
    },

    // Funcionalidades específicas
    features: {
      // Dashboard - Solo 3 componentes básicos
      servicesPerformed: true, // ChartAreaInteractive
      yearlyServices: true, // YearlyServicesChart
      weeklyServices: true, // WeeklyDayChart

      // Dashboard Premium only
      totalRevenue: false,
      financialSummary: false,
      clientRecurrence: false,
      inactiveClients: false,
      averageTicket: false,
      averageDuration: false,
      incomePerHour: false,
      genderSegmentation: false,
      timeCheck: false,

      // Clientes
      clientManagement: true,
      clientHistory: false,
      clientAnalytics: false, // Solo vista básica
      bulkActions: false, // Premium only

      // Barberos
      maxBarbers: 1,
      barberAnalytics: false,

      // Reportes
      basicReports: true,
      exportPDF: true, // Standard solo con rango limitado
      exportExcel: false, // Premium only
      customDateRanges: false, // Solo últimos 30 días

      // Insights
      insightsDashboard: false, // Solo premium
    },
  },

  premium: {
    pages: {
      dashboard: true,
      clients: true,
      barbers: true,
      appointments: true,
      diary: true, // Agenda disponible
      insights: true, // Insights disponible
      analytics: true,
      reports: true,
    },

    features: {
      // Dashboard - Todas las funcionalidades
      servicesPerformed: true,
      yearlyServices: true,
      weeklyServices: true,
      totalRevenue: true,
      financialSummary: true,
      clientRecurrence: true,
      inactiveClients: true,
      averageTicket: true,
      averageDuration: true,
      incomePerHour: true,
      genderSegmentation: true,
      timeCheck: true,

      // Clientes
      clientManagement: true,
      clientHistory: true,
      clientAnalytics: true,
      bulkActions: true,

      // Barberos
      maxBarbers: Infinity,
      barberAnalytics: true,

      // Reportes
      basicReports: true,
      exportPDF: true,
      exportExcel: true,
      customDateRanges: true,

      // Insights
      insightsDashboard: true,
    },
  },
} as const;

/**
 * Tipos de permisos
 */
export type PagePermission = keyof typeof PLAN_FEATURES.standard.pages;
export type FeaturePermission = keyof typeof PLAN_FEATURES.standard.features;

/**
 * 🆕 Verifica si un usuario tiene acceso completo a la aplicación
 * Basado en subscriptionExpiresAt (sistema manual)
 * Prioriza validación manual sobre el sistema antiguo
 */
export function hasAppAccess(user: IUser | null): boolean {
  if (!user) return false;

  // 1. Verificar que la cuenta esté activa
  if (!user.userActive) return false;

  // 🆕 2. Validar por subscriptionExpiresAt (prioridad)
  if (user.subscription?.subscriptionExpiresAt) {
    const expiresAt = new Date(user.subscription.subscriptionExpiresAt);
    const now = new Date();

    // Si la fecha ya pasó, NO tiene acceso
    if (expiresAt <= now) {
      return false;
    }

    // Si aún no pasó, TIENE ACCESO completo
    return true;
  }

  // Si no tiene subscriptionExpiresAt, validar con sistema anterior (compatibilidad)
  const subStatus = user.subscription?.status;
  if (!subStatus) return false;

  // Estados que bloquean acceso
  if (
    subStatus === "cancelled" ||
    subStatus === "expired" ||
    subStatus === "paused"
  ) {
    return false;
  }

  return true;
}

/**
 * Verifica si un usuario está en período de prueba
 */
export function isTrialUser(user: IUser | null): boolean {
  if (!user) return false;
  return user.subscription?.status === "trial";
}

/**
 * Obtiene el plan del usuario (con fallback a standard)
 */
export function getUserPlan(user: IUser | null): SubscriptionPlan {
  if (!user || !user.subscription?.plan) return "standard";
  return user.subscription.plan;
}

/**
 * 🆕 En el nuevo sistema manual: si hasAppAccess es true,
 * el usuario tiene acceso a TODAS las páginas
 */
export function canAccessPage(
  user: IUser | null,
  page: PagePermission,
): boolean {
  if (!hasAppAccess(user)) return false;

  // 🆕 Nuevo sistema: si tiene acceso a la app, tiene acceso a TODO
  // El único límite es subscriptionExpiresAt
  return true;
}

/**
 * 🆕 En el nuevo sistema manual: si hasAppAccess es true,
 * el usuario tiene acceso a TODAS las funcionalidades
 */
export function hasFeature(
  user: IUser | null,
  feature: FeaturePermission,
): boolean {
  if (!hasAppAccess(user)) return false;

  // 🆕 Nuevo sistema: si tiene acceso a la app, tiene todas las features
  return true;
}

/**
 * 🆕 En el nuevo sistema manual: retorna los límites premium/máximos
 */
export function getFeatureLimit<T extends FeaturePermission>(
  user: IUser | null,
  feature: T,
): (typeof PLAN_FEATURES)[SubscriptionPlan]["features"][T] {
  // Si no tiene acceso, retornar el valor del plan standard
  if (!hasAppAccess(user)) {
    return PLAN_FEATURES["standard"].features[feature];
  }

  // 🆕 Nuevo sistema: retornar siempre el valor premium (máximo)
  return PLAN_FEATURES["premium"].features[feature];
}

/**
 * Hook helper para verificar múltiples permisos a la vez
 */
export function checkPermissions(user: IUser | null) {
  return {
    hasAppAccess: hasAppAccess(user),
    isTrialUser: isTrialUser(user),
    plan: getUserPlan(user),
    canAccessPage: (page: PagePermission) => canAccessPage(user, page),
    hasFeature: (feature: FeaturePermission) => hasFeature(user, feature),
    getFeatureLimit: <T extends FeaturePermission>(feature: T) =>
      getFeatureLimit(user, feature),
  };
}
