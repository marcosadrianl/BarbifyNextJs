// app/api/users/create/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import User, { IUser } from "@/models/Users";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userEmail,
      userPassword,
      userName,
      userLastName,
      userPhone,
      userRole,
      userLevel,
      userCity,
      userAddress,
      userPostalCode,
      userBirthdate,
      userSex,
    } = body;

    await connectDB();

    const existingUser = await (User as mongoose.Model<IUser>).findOne({
      userEmail,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      userEmail,
      userPassword: hashedPassword,
      userName,
      userLastName,
      userPhone,
      userRole,
      userLevel,
      userCity,
      userAddress,
      userPostalCode,
      userBirthdate,
      userSex,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Usuario creado correctamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
