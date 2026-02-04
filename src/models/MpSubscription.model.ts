import { Schema, model, models } from "mongoose";
import { IMpSubscription } from "@/models/MpSubscription.types";

/* ───────────────────────────────
   ESQUEMA MONGOOSE
───────────────────────────────── */
const MpSubscriptionSchema = new Schema<IMpSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "BarbifyUsers",
      required: true,
    },
    mpSubscriptionId: { type: String, required: true, unique: true },
    externalReference: { type: String },
    payerId: { type: Number },
    payerEmail: { type: String },
    status: { type: String },
    planReason: { type: String },
    amount: { type: Number },
    currency: { type: String },
    frequency: { type: Number },
    frequencyType: { type: String },
    nextPaymentDate: { type: Date },
    cancelledAt: { type: Date },
  },
  { _id: true, timestamps: true, collection: "BarbifyMpSubscriptions" },
);

const MpSubscription =
  models.BarbifyMpSubscriptions ||
  model<IMpSubscription>("BarbifyMpSubscriptions", MpSubscriptionSchema);

export default MpSubscription;
