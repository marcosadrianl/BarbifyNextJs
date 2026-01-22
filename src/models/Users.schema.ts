import { z } from "zod";

const SubscriptionSchemaZod = z
  .object({
    plan: z.enum(["standard", "premium"]).default("standard"),
    status: z
      .enum(["active", "pending", "cancelled", "expired", "paused", "trial"])
      .default("trial"),
    startDate: z.date().default(() => new Date()),
    endDate: z.date().optional(),
    trialEndDate: z.date().optional(),
    mercadoPagoSubscriptionId: z.string().optional(),
    mercadoPagoPreapprovalId: z.string().optional(),
    lastPaymentDate: z.date().optional(),
    nextPaymentDate: z.date().optional(),
    cancelledAt: z.date().optional(),
  })
  .optional();

export const UserSchemaZod = z
  .object({
    userName: z.string().max(50).default(""),
    userLastName: z.string().max(50).default(""),
    userEmail: z.email().max(100).default(""),
    userPassword: z.string().max(100),
    userActive: z.boolean().optional().default(false), // Requiere pago para activarse
    userHasThisBarbers: z.array(z.string()).default([]),

    userCity: z.string().max(50).default(""),
    userState: z.string().max(50).default(""),
    userAddress: z.string().max(100).default(""),
    userPostalCode: z.string().max(10).default(""),

    userPhone: z.string().max(20).default(""),
    userLevel: z.enum(["0", "1"]).transform(Number).default(0),
    userBirthDate: z.string().optional().default(""),
    userSex: z.enum(["M", "F", "O"]).optional().default("O"),
    paymentStatus: z.boolean().default(false),

    subscription: SubscriptionSchemaZod.default({
      plan: "standard",
      status: "trial",
      startDate: new Date(),
      trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
    }),
  })
  .strict();

export const UserZod = UserSchemaZod.extend({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
