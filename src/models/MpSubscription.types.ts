export interface IMpSubscription {
  _id?: string;
  userId: string;
  mpSubscriptionId: string; // id de MP
  externalReference?: string;
  payerId?: number;
  payerEmail?: string;
  status?: string; // pending, authorized, cancelled...
  planReason?: string; // Suscripción Premium - Barbify
  amount?: number;
  currency?: string;
  frequency?: number;
  frequencyType?: string; // months, days...
  nextPaymentDate?: Date;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
