export type SubscriptionPlan = "standard" | "premium";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "cancelled"
  | "expired"
  | "paused"
  | "trial";

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
  trialEndDate?: Date;
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
  standard: {
    id: "standard",
    name: "Standard",
    price: 3400000, // $34,000 en centavos
    description: "Plan ideal para peluquerías / barberías pequeñas",
    features: [
      "Hasta 1 Barber",
      "Clientes ilimitados",
      "Historial básico",
      "Reportes básicos",
    ],
    maxBarbers: 1,
    analytics: true,
    priority_support: false,
  },
  premium: {
    id: "premium",
    name: "All Access",
    price: 3400000, // $34,000 en centavos
    description: "Plan completo para peluquerías / barberías profesionales",
    features: [
      "Barbers ilimitados",
      "Clientes ilimitados",
      "Gestión completa de citas",
      "Historial completo",
      "Analytics avanzados",
      "Reportes completos",
    ],
    analytics: true,
    priority_support: true,
  },
};
