/**
 * 🆕 NUEVO SISTEMA MANUAL: Sistema de permisos con UN ÚNICO PLAN
 *
 * TODOS los usuarios tienen ACCESO A TODO
 * El único límite es la fecha de vencimiento (subscriptionExpiresAt)
 *
 * Este archivo reemplaza el anterior con validación por plan
 */

/**
 * Características disponibles en el nuevo sistema unificado
 */
export const MANUAL_PLAN_FEATURES = {
  // Páginas completas - TODO DISPONIBLE
  pages: {
    dashboard: true,
    clients: true,
    barbers: true,
    appointments: true,
    diary: true,
    insights: true,
    analytics: true,
    reports: true,
  },

  // Funcionalidades específicas - TODO DISPONIBLE
  features: {
    // Dashboard - Todos los componentes
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
    maxBarbers: 999, // Ilimitado
    barberAnalytics: true,

    // Reportes
    basicReports: true,
    exportPDF: true,
    exportExcel: true,
    customDateRanges: true,

    // Insights
    insightsDashboard: true,

    // Todas las demás features
    advancedAnalytics: true,
    customReports: true,
    prioritySupport: true,
    unlimitedDataExport: true,
  },
};

/**
 * Hook para verificar si el usuario tiene una feature
 * En el nuevo sistema: SIEMPRE retorna true (todas las features disponibles)
 *
 * La restricción es SOLO por subscriptionExpiresAt
 */
export function useManualPermissions() {
  const hasFeature = (feature: string): boolean => {
    // 🆕 En el nuevo sistema, TODOS tienen acceso a TODO
    // La validación es SOLO por fecha de vencimiento
    return true;
  };

  const canAccessPage = (page: string): boolean => {
    // 🆕 En el nuevo sistema, TODOS pueden acceder a TODAS las páginas
    // La validación es SOLO por fecha de vencimiento
    return true;
  };

  const hasAppAccess = (): boolean => {
    // 🆕 El acceso a la app es validado por subscriptionExpiresAt
    // Esta función debería estar combinada con checkManualSubscriptionStatus()
    return true;
  };

  return {
    hasFeature,
    canAccessPage,
    hasAppAccess,
  };
}

/**
 * Función helper para migrar desde el sistema antiguo
 * Convierte PLAN_FEATURES(antigua) a este nuevo sistema
 */
export const migrateToManualPlanSystem = () => {
  // 🆕 Todo usuario automáticamente tiene acceso a todo
  // Solo hay que validar subscriptionExpiresAt
  console.log("✅ Sistema migrante a validación por subscriptionExpiresAt");
};
