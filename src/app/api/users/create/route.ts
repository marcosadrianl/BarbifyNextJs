import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import User, { IUser } from "@/models/Users";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * DTO (tipo) para la request entrante.
 * Lo mantenemos separado porque la API recibe campos planos
 * (userCity, userAddress, userPostalCode) y la interface IUser
 * define userLocation como objeto anidado.
 */
type CreateUserBody = {
  userEmail: string;
  userPassword: string;
  userPhone?: string;
  userName?: string;
  userLastName?: string;
  userRole?: string;
  userLevel?: 0 | 1;
  userActive: boolean;
  userCity?: string;
  userAddress?: string;
  userPostalCode?: string;
  userBirthdate?: string | Date;
  userSex?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserBody;

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

    // Mapear el DTO plano a la interface IUser esperada por el modelo
    const userLocation =
      userCity || userAddress || userPostalCode
        ? {
            city: userCity ?? "",
            address: userAddress,
            userPostalCode: userPostalCode,
          }
        : undefined;

    const userPayload: IUser = {
      userName: userName ?? "",
      userLastName,
      userEmail,
      userRole,
      userSex,
      userPassword: hashedPassword,
      userLocation,
      userPhone: userPhone,
      userActive: true,
      userLevel: (userLevel ?? 0) as 0 | 1,
      paymentStatus: false,
      userBirthDate: userBirthdate ? new Date(userBirthdate) : undefined,
      userHasThisBarbers: [],
    };

    const newUser = new User(userPayload);

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
