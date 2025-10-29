import { Schema, model, models, Document, Types } from "mongoose";
import { z } from "zod";

// 1. Interface con los tipos
// 1. Define la DATA del servicio (sin _id)
export interface IServiceData {
  serviceDate: Date;
  serviceName: string;
  serviceNotes?: string;
  servicePrice: number;
  serviceDuration: number;
  fromBarberId?: Types.ObjectId;
}

export interface IService extends IServiceData {
  _id: Types.ObjectId; // _id es agregado por Mongoose en el subdocumento
}

export interface IClientData {
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O";
  clientBirthdate?: Date;
  // ... (todos los demás campos de IClient)
  clientNotes?: string;
  clientServices: IService[]; // Usa el tipo IService con _id
  clientWhiteHairs: number;
  clientFromUserId?: Types.ObjectId;
  ClientPassword?: string;
}

export interface IClient extends IClientData, Document {
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O";
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
  clientServices: IService[];
  clientWhiteHairs: number;
  clientFromUserId?: Types.ObjectId;
  ClientPassword?: string;
}

// 2. Schemas
const ServicesSchema = new Schema<IService>(
  {
    serviceDate: { type: Date, required: true },
    serviceName: { type: String, required: true, maxlength: 50, trim: true },
    serviceNotes: { type: String, maxlength: 500 },
    servicePrice: { type: Number, min: 0, default: 0, required: true },
    serviceDuration: { type: Number, required: true },
    fromBarberId: {
      type: Schema.Types.ObjectId,
      ref: "Barbers",
    },
  },
  { timestamps: false }
);

const ClientsSchema = new Schema<IClient>(
  {
    clientName: { type: String, required: true, maxlength: 50, trim: true },
    clientLastName: { type: String, required: true, maxlength: 50, trim: true },
    clientSex: { type: String, enum: ["M", "F", "O"], default: "O" },
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
    clientServices: [ServicesSchema],
    clientWhiteHairs: { type: Number, default: 0, min: 0, max: 100 },
    clientFromUserId: { type: Schema.Types.ObjectId, ref: "BarbifyUsers" },
    ClientPassword: { type: String, maxlength: 100 },
  },
  {
    timestamps: true,
    collection: "BarbifyClients", // 👈 importante para que use tu colección ya existente
  }
);

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
    clientServices: z.array(ServiceSchemaZod).default([]),
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

// ----------------------------------------------------
// NUEVAS INTERFACES PARA EL DOCUMENTO PLAIN (resultado de .lean())
// ----------------------------------------------------

// 1. Interfaz para el servicio plano (después de .lean())
// Mongoose NO convierte ObjectId a string aquí, solo a un objeto ObjectId de JS.
// Si necesitas serializar, tienes que hacerlo explícitamente.
export interface IServiceLean {
  _id: Types.ObjectId; // Aún como ObjectId antes de serializar
  serviceDate: Date; // Aún como Date antes de serializar
  serviceName: string;
  serviceNotes?: string;
  servicePrice: number;
  serviceDuration: number;
  fromBarberId?: Types.ObjectId; // Aún como ObjectId antes de serializar
}

// 2. Interfaz para el Cliente Plano (después de .lean())
export interface IClientLean {
  _id: Types.ObjectId;
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O";
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
  clientServices: IServiceLean[];
  clientWhiteHairs: number;
  clientFromUserId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const Clients =
  models.BarbifyClients || model<IClient>("BarbifyClients", ClientsSchema);

export default Clients<IClient>;
