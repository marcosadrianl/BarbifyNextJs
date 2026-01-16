import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import { object, z } from "zod";
import BarbifyClients from "@/models/Clients";

/* ───────────────────────────────
   1. INTERFACES TYPESCRIPT
───────────────────────────────── */
export interface IService {
  serviceDate: Date;
  serviceName: string;
  serviceTypeId?: Types.ObjectId; // Referencia a un posible catálogo de tipos de servicio

  servicePrice: number;
  serviceDuration: number;
  serviceNotes?: string;

  status?: "completed" | "cancelled" | "no_show" | "pending"; // Estado del servicio
  paymentMethod?: "cash" | "card" | "mp" | "transfer";

  fromBarberId: Types.ObjectId;
  forUserId: Types.ObjectId;
  toClientId?: Types.ObjectId;

  createdBy?: Types.ObjectId; // Barber que creó el servicio

  isManual?: boolean; // Indica si el servicio fue agregado manualmente
  isEdited?: boolean; // Indica si el servicio fue editado después de su creación

  createdAt?: Date;
  updatedAt?: Date;
}

/* ───────────────────────────────
   2. ESQUEMAS MONGOOSE
───────────────────────────────── */
const ServiceSchema = new Schema<IService>(
  {
    serviceDate: { type: Date, required: true },
    serviceName: { type: String, required: true, maxlength: 50 },
    serviceNotes: { type: String, maxlength: 500 },
    servicePrice: { type: Number, required: true, min: 0, default: 0 },
    serviceDuration: { type: Number, required: true, min: 1, default: 30 },
    fromBarberId: { type: Schema.Types.ObjectId, ref: "BarbifyBarbers" },
    forUserId: {
      type: Schema.Types.ObjectId,
      ref: "BarbifyUsers",
      required: true,
    },
    toClientId: {
      type: Schema.Types.ObjectId,
      ref: "BarbifyClients",
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "no_show", "pending"],
      default: "completed",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mp", "transfer"],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "BarbifyUsers" },
    isManual: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true, collection: "BarbifyServices" }
);

/* ───────────────────────────────
   3. SERIALIZADOR UNIFICADO
───────────────────────────────── */

export const serializeService = (
  service: IService | (mongoose.Document & IService)
) => {
  // Si es un documento de Mongoose, convertirlo a objeto plano
  const doc =
    typeof (service as any).toObject === "function"
      ? (service as mongoose.Document & IService).toObject()
      : service;

  return {
    id: doc._id?.toString(),
    serviceDate: doc.serviceDate,
    serviceName: doc.serviceName,
    serviceNotes: doc.serviceNotes,
    servicePrice: doc.servicePrice,
    serviceDuration: doc.serviceDuration,
    fromBarberId: doc.fromBarberId?.toString(),
    forUserId: doc.forUserId?.toString(),
    toClientId: doc.toClientId?.toString(),
    status: doc.status,
    paymentMethod: doc.paymentMethod,
    createdBy: doc.createdBy ? doc.createdBy.toString() : undefined,
    isManual: doc.isManual,
    isEdited: doc.isEdited,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

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

/* ───────────────────────────────
   4. MODELO
───────────────────────────────── */
const Services =
  mongoose.models.BarbifyServices ||
  model<IService>("BarbifyServices", ServiceSchema);

export default Services;
