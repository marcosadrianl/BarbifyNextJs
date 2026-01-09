// schemas/userUpdate.schema.ts
import { z } from "zod";

export const UserUpdateZod = z
  .object({
    userName: z.string().max(50).optional(),
    userLastName: z.string().max(50).optional(),
    userPhone: z.string().max(20).optional(),
    userSex: z.enum(["M", "F", "O"]).optional(),
    userBirthDate: z.date().optional(),
    userEmail: z.string().email().max(100).optional(),

    userCity: z.string().max(50).optional(),
    userState: z.string().max(50).optional(),
    userAddress: z.string().max(100).optional(),
    userPostalCode: z.string().max(10).optional(),
  })
  .strict();
