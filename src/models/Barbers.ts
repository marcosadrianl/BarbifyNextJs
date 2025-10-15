import { Schema, model, models, Document } from "mongoose";

// 1. Interface Definition
export interface IBarber extends Document {
  barberName: string;
  barberLastName: string;
  barberEmail: string;
  barberPhone: string;
  barberActive: boolean;
  barberRole: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Schema Definition
const BarbersSchema = new Schema<IBarber>(
  {
    barberName: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [50, "Name cannot be longer than 50 characters"],
      trim: true,
    },
    barberLastName: {
      type: String,
      required: [true, "Last name is required"],
      maxlength: [50, "Last name cannot be longer than 50 characters"],
      trim: true,
    },
    barberEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      maxlength: [100, "Email cannot be longer than 100 characters"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    barberPhone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      maxlength: [20, "Phone number cannot be longer than 20 characters"],
      trim: true,
    },
    barberActive: {
      type: Boolean,
      default: true,
    },
    barberRole: {
      type: String,
      default: "Barber",
      maxlength: [20, "Role cannot be longer than 20 characters"],
      enum: ["Barber", "Admin", "Manager"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// 3. Export Model with Interface
export default models.Barbers || model<IBarber>("Barbers", BarbersSchema);
