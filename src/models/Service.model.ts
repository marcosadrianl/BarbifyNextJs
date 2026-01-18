import { Schema, model, models } from "mongoose";
import { IService } from "@/models/Service.type";

/* ───────────────────────────────
   2. ESQUEMAS MONGOOSE
───────────────────────────────── */
const ServiceSchema = new Schema<IService>(
  {
    serviceDate: { type: Date, required: true },
    serviceName: { type: String, required: true, maxlength: 50 },
    serviceNotes: { type: String, maxlength: 500, required: false },
    servicePrice: { type: Number, required: true, min: 0, default: 0 },
    serviceDuration: { type: Number, required: true, min: 1, default: 30 },
    fromBarberId: { type: String, ref: "BarbifyBarbers", required: false },
    forUserId: {
      type: String,
      ref: "BarbifyUsers",
      required: true,
    },
    toClientId: {
      type: String,
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
      required: false,
    },
    createdBy: { type: String, ref: "BarbifyUsers", required: false },
    isManual: { type: Boolean, default: false, required: false },
    isEdited: { type: Boolean, default: false, required: false },
  },
  { _id: true, timestamps: true, collection: "BarbifyServices" },
);

const Services =
  models.BarbifyServices || model<IService>("BarbifyServices", ServiceSchema);

export default Services;
