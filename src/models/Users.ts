import { Schema, model, models } from "mongoose";
import Barbers from "./Barbers";

interface BarbersList extends Document {
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
    userPostalCode?: string;
  };
}

interface IUser {
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;
  userActive: boolean;
  userLocation?: {
    city: string; //Buenos Aires
    state?: string; //La Plata
    address?: string;
    userPostalCode?: string;
  };
  userPhome?: string;
  userLevel: 0 | 1;
  userBirthDate?: Date;
  userHasThisBarbers: BarbersList[];
}

//esuqme del user
const UsersSchema = new Schema(
  {
    UserEmail: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    UserPassword: { type: String, required: true, maxlength: 100 },
    UserActive: { type: Boolean, default: true },
    UserName: { type: String, required: true, maxlength: 50, trim: true },
    UserLastName: { type: String, required: true, maxlength: 50, trim: true },
    UserRole: { type: String, default: "admin", maxlength: 20, trim: true },
    UserPostalCode: { type: String, maxlength: 10, trim: true },
    UserCity: { type: String, maxlength: 50, trim: true },
    UserAddress: { type: String, maxlength: 100, trim: true },
    UserPhone: {
      type: String,
      maxlength: 20,
      trim: true,
      message: "Please enter a valid phone number",
    },
    UserLevel: { type: Number, required: true, default: 0, enum: [0, 1, 2] },
    UserBirthdate: { type: Date },
    UserSex: { type: String, enum: ["M", "F", "O"], default: "O" },
    UserHasThisBarbers: [Barbers],
  },
  {
    timestamps: true,
    collection: "BarbifyUsers",
  }
);

export default models.BarbifyUsers || model("BarbifyUsers", UsersSchema);
