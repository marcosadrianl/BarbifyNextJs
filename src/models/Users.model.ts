import { Schema, model, models } from "mongoose";
import { IUser } from "@/models/Users.type";

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
    userActive: { type: Boolean, default: false }, // Default false: requiere pago para activarse
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    userPassword: { type: String, required: true, maxlength: 100 },
    userName: { type: String, required: true, maxlength: 50, trim: true },
    userLastName: { type: String, required: true, maxlength: 50, trim: true },
    userRole: { type: String, default: "admin", maxlength: 20, trim: true },
    userHasThisBarbers: { type: [String], default: [] },

    userCity: { type: String, maxlength: 50, trim: true },
    userState: { type: String, maxlength: 50, trim: true },
    userAddress: { type: String, maxlength: 100, trim: true },
    userPostalCode: { type: String, maxlength: 10, trim: true },

    subscription: {
      plan: {
        type: String,
        enum: ["standard", "premium"],
        default: "standard",
      },
      status: {
        type: String,
        enum: ["active", "pending", "cancelled", "expired", "paused", "trial"],
        default: "trial",
      },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date },
      trialEndDate: { type: Date },
      mercadoPagoSubscriptionId: { type: String },
      mercadoPagoPreapprovalId: { type: String },
      lastPaymentDate: { type: Date },
      nextPaymentDate: { type: Date },
      cancelledAt: { type: Date },
    },

    userPhone: {
      type: String,
      maxlength: 20,
      trim: true,
    },
    userBirthDate: { type: String }, // ✅ Cambiado a string
    userSex: { type: String, enum: ["M", "F", "O"], default: "O" },
  },
  {
    timestamps: true,
    collection: "BarbifyUsers",
    _id: true,
  },
);

const User = models.BarbifyUsers || model<IUser>("BarbifyUsers", UsersSchema);

export default User;
