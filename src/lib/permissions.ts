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
      insights: false, // Insights solo en premium
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
      exportPDF: false, // Premium only
      exportExcel: false, // Premium only
      customDateRanges: false, // Solo últimos 30 días
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
    },
  },
} as const;

/**
 * Tipos de permisos
 */
export type PagePermission = keyof typeof PLAN_FEATURES.standard.pages;
export type FeaturePermission = keyof typeof PLAN_FEATURES.standard.features;

/**
 * Verifica si un usuario tiene acceso completo a la aplicación
 */
export function hasAppAccess(user: IUser | null): boolean {
  if (!user) return false;

  // 1. Verificar que la cuenta esté activa
  if (!user.userActive) return false;

  // 2. Verificar estado de suscripción
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
 * Verifica si el usuario tiene acceso a una página específica
 */
export function canAccessPage(
  user: IUser | null,
  page: PagePermission,
): boolean {
  if (!hasAppAccess(user)) return false;

  const plan = getUserPlan(user);
  return PLAN_FEATURES[plan].pages[page];
}

/**
 * Verifica si el usuario tiene acceso a una funcionalidad específica
 */
export function hasFeature(
  user: IUser | null,
  feature: FeaturePermission,
): boolean {
  if (!hasAppAccess(user)) return false;

  const plan = getUserPlan(user);
  return Boolean(PLAN_FEATURES[plan].features[feature]);
}

/**
 * Obtiene el valor de una característica del plan
 */
export function getFeatureLimit<T extends FeaturePermission>(
  user: IUser | null,
  feature: T,
): (typeof PLAN_FEATURES)[SubscriptionPlan]["features"][T] {
  const plan = getUserPlan(user);
  return PLAN_FEATURES[plan].features[feature];
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
