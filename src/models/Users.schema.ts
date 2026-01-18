import { z } from "zod";

export const UserSchemaZod = z
  .object({
    userName: z.string().max(50).default(""),
    userLastName: z.string().max(50).default(""),
    userEmail: z.email().max(100).default(""),
    userPassword: z.string().max(100),
    userActive: z.boolean().optional().default(true),
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
  })
  .strict();

export const UserZod = UserSchemaZod.extend({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
