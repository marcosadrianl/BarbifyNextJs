/**
 * Crear usuaruio API Route y guardarlo en mongodb
 * importar connectDB() y User model
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userPassword, userName, userLastName } = body;

    const existingUser = await User.findOne({ userEmail });
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
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
