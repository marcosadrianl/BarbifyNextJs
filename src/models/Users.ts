import { Schema, model, models } from "mongoose";
import z from "zod";
import mongoose from "mongoose";
import BarbifyBarbers, { IBarbers } from "@/models/Barbers";

export interface IUser {
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;
  userActive: boolean;
  userLocation?: {
    city: string; //Buenos Aires
    state?: string; //La Plata
    address?: string; // 44 y 132
    userPostalCode?: string; // 1900
  };
  userPhome?: string;
  userLevel: 0 | 1;
  userBirthDate?: Date;
  userHasThisBarbers?: IBarbers[];
}

//schemme del user mongoDB
const UsersSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    userPassword: { type: String, required: true, maxlength: 100 },
    userActive: { type: Boolean, default: true },
    userName: { type: String, required: true, maxlength: 50, trim: true },
    userLastName: { type: String, required: true, maxlength: 50, trim: true },
    userRole: { type: String, default: "admin", maxlength: 20, trim: true },
    userPostalCode: { type: String, maxlength: 10, trim: true },
    userCity: { type: String, maxlength: 50, trim: true },
    userAddress: { type: String, maxlength: 100, trim: true },
    userPhone: {
      type: String,
      maxlength: 20,
      trim: true,
      message: "Please enter a valid phone number",
    },
    userLevel: { type: Number, required: true, default: 0, enum: [0, 1, 2] },
    userBirthdate: { type: Date },
    userSex: { type: String, enum: ["M", "F", "O"], default: "O" },
    userHasThisBarbers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barbers",
      },
    ],
  },
  {
    timestamps: true,
    collection: "BarbifyUsers",
  }
);

//ZOD scheme
export const UserSchemaZod = z
  .object({
    userName: z.string().max(50),
    userLastName: z.string().max(50),
    userEmail: z.email().max(100),
    userPassword: z.string().max(100),
    userActive: z.boolean().optional(),
    userLocation: z
      .object({
        city: z.string().max(50),
        state: z.string().max(50),
        address: z.string().max(100),
        PostalCode: z.string().max(10),
      })
      .optional(),
    userPhone: z.string().max(20),
    userLevel: z.enum(["0", "1"]).transform(Number),
    userBirthDate: z.date().optional(),
    userSex: z.enum(["M", "F", "O"]).optional(),
  })
  .strict();

export const UserZod = UserSchemaZod.extend({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const User = models.BarbifyUsers || model<IUser>("BarbifyUsers", UsersSchema);

export default User;
