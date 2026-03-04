import {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types/subscription.types";

export interface IUser {
  _id?: string;
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;
  userHasThisBarbers: string[];

  userCity: string;
  userState?: string;
  userAddress?: string;
  userPostalCode?: string;

  userPhone?: string;
  userActive: boolean;
  userLevel: 0 | 1 | 2; // 0 = free/trial, 1 = paid user, 2 = admin/super-user
  paymentStatus: boolean;
  userRole?: string;
  userSex?: string;
  userBirthDate?: string; // ✅ Mayúscula D

  subscription?: {
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
    // 🆕 NUEVO SISTEMA MANUAL: Fecha de vencimiento único (validado por CRON)
    subscriptionExpiresAt?: Date;
    lastManualPaymentDate?: Date;
    manualPaymentNotes?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
