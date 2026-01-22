/**
 * Crear usuaruio API Route y guardarlo en mongodb
 * importar connectDB() y User model
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

connectDB();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userPassword, userName, userLastName } = body;

    const existingUser = await (User as mongoose.Model<IUser>).findOne({
      userEmail,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Calcular fecha de fin del período de prueba (14 días desde hoy)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);

    const newUser = new User({
      userEmail,
      userPassword: hashedPassword,
      userName,
      userLastName,
      userActive: true, // Activado durante el período de prueba
      userLevel: body.userLevel || 0,
      paymentStatus: false,
      userRole: body.userRole,

      userCity: body.userCity || "",
      userState: body.userState || "",
      userAddress: body.userAddress || "",
      userPostalCode: body.userPostalCode || "",

      userPhone: body.userPhone || "",
      userSex: body.userSex,
      userBirthDate: body.userBirthDate,

      // Configurar suscripción de prueba
      subscription: {
        plan: "standard",
        status: "trial",
        startDate: new Date(),
        trialEndDate: trialEndDate,
      },
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
