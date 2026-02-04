import { z } from "zod";
import { IMpSubscription } from "@/models/MpSubscription.types";

/* ───────────────────────────────
   SERIALIZADOR
───────────────────────────────── */
export const serializeMpSubscription = (
  subscription:
    | IMpSubscription
    | (IMpSubscription & { _doc?: IMpSubscription }),
) => {
  const doc = (subscription as any).toObject
    ? (subscription as any).toObject()
    : subscription;

  return {
    _id: doc._id?.toString?.() ?? doc._id,
    userId: doc.userId?.toString?.() ?? doc.userId,
    mpSubscriptionId: doc.mpSubscriptionId,
    externalReference: doc.externalReference,
    payerId: doc.payerId,
    payerEmail: doc.payerEmail,
    status: doc.status,
    planReason: doc.planReason,
    amount: doc.amount,
    currency: doc.currency,
    frequency: doc.frequency,
    frequencyType: doc.frequencyType,
    nextPaymentDate: doc.nextPaymentDate?.toISOString?.() ?? null,
    cancelledAt: doc.cancelledAt?.toISOString?.() ?? null,
    createdAt: doc.createdAt?.toISOString?.() ?? null,
    updatedAt: doc.updatedAt?.toISOString?.() ?? null,
  };
};

////////////////////////// ZOD SCHEMAS //////////////////////////
export const MpSubscriptionSchemaZod = z.object({
  userId: z.string().min(1),
  mpSubscriptionId: z.string().min(1),
  externalReference: z.string().optional(),
  payerId: z.number().optional(),
  payerEmail: z.string().email().optional(),
  status: z.string().optional(),
  planReason: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  frequency: z.number().optional(),
  frequencyType: z.string().optional(),
  nextPaymentDate: z.string().optional(),
  cancelledAt: z.string().optional(),
});
