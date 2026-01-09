/**
 * Crear usuaruio API Route y guardarlo en mongodb
 * importar connectDB() y User model
 */
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUser } from "@/models/Users";

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
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User<IUser>({
      userEmail,
      userPassword: hashedPassword,
      userName,
      userLastName,
      userActive: body.userActive,
      userLevel: body.userLevel,
      paymentStatus: body.paymentStatus,
      userRole: body.userRole,
      userLocation: {
        userCity: body.userLocation.userCity,
        userState: body.userLocation.userState,
        userAddress: body.userLocation.userAddress,
        userPostalCode: body.userLocation.userPostalCode,
      },
      userPhone: body.userPhone,
      userSex: body.userSex,
      userBirthDate: body.userBirthDate,
      userHasThisBarbers: body.userHasThisBarbers,
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
