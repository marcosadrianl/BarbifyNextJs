import { Schema, model, models, Document, Types } from "mongoose";
import { IClient } from "@/models/Clients.types";

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
      default: "O",
      required: true,
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
    clientFromUserId: { type: String, ref: "BarbifyUsers" },
  },
  {
    _id: true,
    timestamps: true,
    collection: "BarbifyClients",
  },
);

/* ───────────────────────────────
   4. MODELO
───────────────────────────────── */
const Clients =
  models.BarbifyClients || model<IClient>("BarbifyClients", ClientsSchema);

export default Clients;
