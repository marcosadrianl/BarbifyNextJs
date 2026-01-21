export type SubscriptionPlan = "free" | "standard" | "premium";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "cancelled"
  | "expired"
  | "paused";

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number;
  description: string;
  features: string[];
  maxBarbers?: number;
  maxClients?: number;
  maxAppointmentsPerMonth?: number;
  analytics: boolean;
  priority_support: boolean;
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  mercadoPagoSubscriptionId?: string;
  mercadoPagoPreapprovalId?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  cancelledAt?: Date;
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  SubscriptionPlanDetails
> = {
  free: {
    id: "free",
    name: "Gratuito",
    price: 0,
    description: "Plan básico para comenzar",
    features: [
      "1 barbero",
      "Hasta 50 clientes",
      "Gestión básica de citas",
      "Historial de 30 días",
    ],
    maxBarbers: 1,
    maxClients: 50,
    maxAppointmentsPerMonth: 100,
    analytics: false,
    priority_support: false,
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: 9999, // $99.99 en centavos
    description: "Plan ideal para barberías pequeñas",
    features: [
      "Hasta 5 barberos",
      "Clientes ilimitados",
      "Gestión completa de citas",
      "Historial completo",
      "Reportes básicos",
      "Recordatorios por email",
    ],
    maxBarbers: 5,
    analytics: true,
    priority_support: false,
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 19999, // $199.99 en centavos
    description: "Plan completo para barberías profesionales",
    features: [
      "Barberos ilimitados",
      "Clientes ilimitados",
      "Gestión completa de citas",
      "Historial completo",
      "Analytics avanzados",
      "Reportes personalizados",
      "Recordatorios por email y SMS",
      "Soporte prioritario 24/7",
      "Integración con redes sociales",
      "Personalización de marca",
    ],
    analytics: true,
    priority_support: true,
  },
};
