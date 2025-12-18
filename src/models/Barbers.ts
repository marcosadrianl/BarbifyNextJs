import { Schema, model, models } from "mongoose";
import z from "zod";

import mongoose, { Document } from "mongoose";

//Este es para hacerlo compatible con la tabla en barberstable.
export type BarbersData = {
  id: Date | string; //lo pide la tabla
  name: string; // barberName + barberLastName
  email: IBarbers["barberEmail"];
  amount: number;
  status: "activo" | "inactivo";
};

// 1. Interface Definition
export interface IBarbers {
  barberName: string;
  barberLastName: string;
  barberEmail: string;
  barberPhone: string;
  barberActive: boolean;
  barberRole: string;
  barberLocation?: {
    city: string; //Buenos Aires
    state?: string; //La Plata
    address?: string;
    postalCode?: string;
  };
  barberLevel?: 0 | 1 | 2; // 0 = Admin, 1 = Barber, 2 = etc
  barberBirthDate?: Date;
  barberImageURL?: string;
  ownerUserId?: mongoose.Types.ObjectId | Document;
}

//schema mongoDB
const BarbersSchema = new Schema(
  {
    barberName: { type: String, required: true, maxlength: 50, trim: true },
    barberLastName: { type: String, required: true, maxlength: 50, trim: true },
    barberEmail: { type: String, unique: true, maxlength: 100, trim: true },
    barberPhone: { type: String, unique: true, maxlength: 20, trim: true },
    barberActive: { type: Boolean, default: true },
    barberRole: { type: String, default: "admin", maxlength: 20, trim: true },
    barberLocation: {
      city: { type: String, maxlength: 50, trim: true },
      state: { type: String, maxlength: 50, trim: true },
      address: { type: String, maxlength: 100, trim: true },
      postalCode: { type: String, maxlength: 10, trim: true },
    },
    barberLevel: { type: Number, required: true, default: 0, enum: [0, 1, 2] },
    barberBirthDate: { type: Date },
    barberImageURL: { type: String },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarbifyUsers",
    },
  },
  {
    timestamps: true,
    collection: "BarbifyBarbers", // 👈 importante para que use tu colección ya existente
  }
);

//ZOD validation schema
export const BarberSchemaZod = z.object({
  barberName: z.string().min(1).max(50),
  barberLastName: z.string().min(1).max(50),
  barberEmail: z.email().max(100),
  barberPhone: z.string().max(20),
  barberActive: z.boolean().default(true),
  barberRole: z.string().max(20),
  barberLocation: z
    .object({
      city: z.string().max(50),
      state: z.string().max(50),
      address: z.string().max(100),
      postalCode: z.string().max(10),
    })
    .optional(),
  barberLevel: z.number().min(0).max(2),
  barberBirthDate: z.date().optional(),
  barberImageURL: z.string().optional(),
  ownerUserId: z.string().optional(),
});

export default mongoose.models.BarbifyBarbers ||
  model<IBarbers>("BarbifyBarbers", BarbersSchema);
