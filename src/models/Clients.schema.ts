import { IClient } from "@/models/Clients.types";
import { z } from "zod";
/* ───────────────────────────────
   3. SERIALIZADOR UNIFICADO
───────────────────────────────── */

export const serializeClient = (
  client: IClient | (IClient & { _doc?: IClient }),
) => {
  const doc = (client as any).toObject ? (client as any).toObject() : client;

  return {
    _id: doc._id.toString(),
    clientName: doc.clientName,
    clientLastName: doc.clientLastName,
    clientSex: doc.clientSex,
    clientBirthdate: doc.clientBirthdate?.toISOString?.() ?? null,
    clientEmail: doc.clientEmail,
    clientPhone: doc.clientPhone,
    clientImage: doc.clientImage,
    clientActive: doc.clientActive,
    clientBaseColor: doc.clientBaseColor,
    clientHairType: doc.clientHairType,
    clientAllergies: doc.clientAllergies,
    clientDiseases: doc.clientDiseases,
    clientMedications: doc.clientMedications,
    clientNotes: doc.clientNotes,
    clientWhiteHairs: doc.clientWhiteHairs,
    clientFromUserId: doc.clientFromUserId ?? null,
    createdAt: doc.createdAt?.toISOString?.() ?? null,
    updatedAt: doc.updatedAt?.toISOString?.() ?? null,
  };
};

////////////////////////// ZOD SCHEMAS //////////////////////////

// 2. Creamos el ClientSchemaZod basándonos en ClientsSchema
export const ClientSchemaZod = z
  .object({
    clientName: z.string().min(1).max(50),
    clientLastName: z.string().min(1).max(50),
    clientSex: z.enum(["M", "F", "O"]).default("O"),
    clientBirthdate: z.string().optional(),
    clientEmail: z.email().optional(),
    clientPhone: z.string().min(1).max(20).optional(),
    clientImage: z.string().optional(),
    clientActive: z.boolean().default(true),
    clientBaseColor: z.string().max(30).optional(),
    clientHairType: z.string().max(30).optional(),
    clientAllergies: z.string().max(200).optional(),
    clientDiseases: z.string().max(200).optional(),
    clientMedications: z.string().max(200).optional(),
    clientNotes: z.string().max(500).optional(),
    clientWhiteHairs: z.number().min(0).max(100).default(0),
    clientFromUserId: z.string().optional(), // Cambiado de UUID a string para ObjectId
    ClientPassword: z.string().max(100).optional(),
  })
  .strict(); // Añadido .strict() para no permitir campos adicionales

// 3. Para el modelo con ID, extendemos el schema base
export const ClientZod = ClientSchemaZod.extend({
  _id: z.string(), // Para el ObjectId de MongoDB
  createdAt: z.string(),
  updatedAt: z.string(),
});
