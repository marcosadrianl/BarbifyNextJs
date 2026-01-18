import { z } from "zod";
/* ───────────────────────────────
   3. SERIALIZADOR UNIFICADO
───────────────────────────────── */

////////////////////////// ZOD SCHEMAS //////////////////////////
// 1. Creamos el ServiceSchemaZod basándonos en ClientsSchema
export const ServiceSchemaZod = z
  .object({
    serviceDate: z.date(),
    serviceName: z.string().max(50),
    serviceNotes: z.string().max(500).optional(),
    servicePrice: z.number().min(0).default(0),
    serviceDuration: z.number().min(1).default(30),
    fromBarberId: z.string().optional(), // Usamos string para ObjectId
    forUserId: z.string(), // Usamos string para ObjectId
    toClientId: z.string(), // Usamos string para ObjectId
    status: z
      .enum(["completed", "cancelled", "no_show", "pending"])
      .default("completed"),
    paymentMethod: z.enum(["cash", "card", "mp", "transfer"]).optional(),
    createdBy: z.string().optional(), // Usamos string para ObjectId
    isManual: z.boolean().default(false),
    isEdited: z.boolean().default(false),
  })
  .strict();

// 3. Para el modelo con ID, extendemos el schema base
export const ServiceSchemaZodWithId = ServiceSchemaZod.extend({
  _id: z.string(), // Para el ObjectId de MongoDB
  createdAt: z.date(),
  updatedAt: z.date(),
});
