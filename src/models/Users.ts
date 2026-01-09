import { Schema, model, models } from "mongoose";
import z from "zod";
import mongoose from "mongoose";
import { IBarbers } from "@/models/Barbers";

export interface IUser {
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;

  userCity: string;
  userState?: string;
  userAddress?: string;
  userPostalCode?: string;

  userPhone?: string;
  userActive: boolean;
  userLevel: 0 | 1;
  paymentStatus: boolean;
  userRole?: string;
  userSex?: string;
  userBirthDate?: Date; // ✅ Mayúscula D
  userHasThisBarbers?: IBarbers[];
}

const UsersSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    userLevel: { type: Number, required: true, default: 0, enum: [0, 1, 2] },
    userActive: { type: Boolean, default: true },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    userPassword: { type: String, required: true, maxlength: 100 },
    userName: { type: String, required: true, maxlength: 50, trim: true },
    userLastName: { type: String, required: true, maxlength: 50, trim: true },
    userRole: { type: String, default: "admin", maxlength: 20, trim: true },

    userCity: { type: String, maxlength: 50, trim: true },
    userState: { type: String, maxlength: 50, trim: true },
    userAddress: { type: String, maxlength: 100, trim: true },
    userPostalCode: { type: String, maxlength: 10, trim: true },

    userPhone: {
      type: String,
      maxlength: 20,
      trim: true,
      message: "Please enter a valid phone number",
    },
    userBirthDate: { type: Date }, // ✅ Cambiado a mayúscula D
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

export const UserSchemaZod = z
  .object({
    userName: z.string().max(50),
    userLastName: z.string().max(50),
    userEmail: z.email().max(100),
    userPassword: z.string().max(100),
    userActive: z.boolean().optional(),

    userCity: z.string().max(50),
    userState: z.string().max(50),
    userAddress: z.string().max(100),
    userPostalCode: z.string().max(10),

    userPhone: z.string().max(20),
    userLevel: z.enum(["0", "1"]).transform(Number),
    userBirthDate: z.date().optional(),
    userSex: z.enum(["M", "F", "O"]).optional(),
    paymentStatus: z.boolean().default(false),
  })
  .strict();

export const UserZod = UserSchemaZod.extend({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const User = models.BarbifyUsers || model<IUser>("BarbifyUsers", UsersSchema);

export default User;
