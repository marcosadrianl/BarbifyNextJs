import { Schema, model, models, Document, Types } from "mongoose";
import { z } from "zod";
import Services, { IService } from "@/models/Service";

/* ───────────────────────────────
   1. INTERFACES TYPESCRIPT
───────────────────────────────── */
/* export interface IService {
  _id: Types.ObjectId;
  serviceDate: Date;
  serviceName: string;
  serviceNotes?: string;
  servicePrice: number;
  serviceDuration: number;
  fromBarberId?: Types.ObjectId;
} */

export interface IClient extends Document {
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O"; //male, female, other
  clientBirthdate?: Date;
  clientEmail?: string;
  clientPhone?: string;
  clientImage?: string;
  clientActive: boolean;
  clientBaseColor?: string;
  clientHairType?: string;
  clientAllergies?: string;
  clientDiseases?: string;
  clientMedications?: string;
  clientNotes?: string;
  clientWhiteHairs: number;
  clientFromUserId?: Types.ObjectId;
  ClientPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ───────────────────────────────
   2. ESQUEMAS MONGOOSE
───────────────────────────────── */

const ClientsSchema = new Schema<IClient>(
  {
    clientName: { type: String, required: true, maxlength: 50, trim: true },
    clientLastName: { type: String, required: true, maxlength: 50, trim: true },
    clientSex: {
      type: String,
      enum: ["M", "F", "O"],
    },
    clientBirthdate: { type: Date },
    clientEmail: { type: String, unique: true, maxlength: 100, trim: true },
    clientPhone: { type: String, unique: true, maxlength: 20, trim: true },
    clientImage: { type: String },
    clientActive: { type: Boolean, default: true },
    clientBaseColor: { type: String, maxlength: 30 },
    clientHairType: { type: String, maxlength: 30 },
    clientAllergies: { type: String, maxlength: 200 },
    clientDiseases: { type: String, maxlength: 200 },
    clientMedications: { type: String, maxlength: 200 },
    clientNotes: { type: String, maxlength: 500 },
    clientWhiteHairs: { type: Number, default: 0, min: 0, max: 100 },
    clientFromUserId: { type: Schema.Types.ObjectId, ref: "BarbifyUsers" },
    ClientPassword: { type: String, maxlength: 100 },
  },
  {
    _id: true,
    timestamps: true,
    collection: "BarbifyClients",
  }
);

/* ───────────────────────────────
   3. SERIALIZADOR UNIFICADO
───────────────────────────────── */

export const serializeClient = (
  client: IClient | (IClient & { _doc?: IClient })
) => {
  const doc = client.toObject ? client.toObject() : client;

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
    clientFromUserId: doc.clientFromUserId?.toString?.() ?? null,
    createdAt: doc.createdAt?.toISOString?.() ?? null,
    updatedAt: doc.updatedAt?.toISOString?.() ?? null,
  };
};

////////////////////////// ZOD SCHEMAS //////////////////////////
// 1. Primero definimos el schema de servicios en Zod
const ServiceSchemaZod = z.object({
  serviceDate: z.coerce.date(),
  serviceName: z.string().min(1).max(50),
  serviceNotes: z.string().max(500).optional(),
  servicePrice: z.number().min(0).default(0),
  serviceDuration: z.number().min(1).default(30),
  fromBarberId: z.string().optional, // Cambiado de UUID a string para ObjectId
});

// 2. Creamos el ClientSchemaZod basándonos en ClientsSchema
export const ClientSchemaZod = z
  .object({
    clientName: z.string().min(1).max(50),
    clientLastName: z.string().min(1).max(50),
    clientSex: z.enum(["M", "F", "O"]).default("O"),
    clientBirthdate: z.coerce.date().optional(),
    clientEmail: z.string().email().optional(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

/* ───────────────────────────────
   4. MODELO
───────────────────────────────── */
const Clients =
  models.BarbifyClients || model<IClient>("BarbifyClients", ClientsSchema);

export default Clients;
