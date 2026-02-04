import { Types } from "mongoose";

export interface IMpSubscription {
  _id?: Types.ObjectId;
  userId: Types.ObjectId; // Change from string to Types.ObjectId
  mpSubscriptionId: string;
  externalReference?: string;
  payerId?: number;
  payerEmail?: string;
  status?: string;
  planReason?: string;
  amount?: number;
  currency?: string;
  frequency?: number;
  frequencyType?: string;
  nextPaymentDate?: Date;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
