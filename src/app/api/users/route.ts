import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // 1. Importar getServerSession
import { authOptions } from "@/utils/auth"; // 2. Importar tus authOptions
import User, { IUser } from "@/models/Users";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

/* interface IUser {
  userName: string;
  userLastName?: string;
  userEmail: string;
  userPassword: string;
  userLocation?: {
    userCity: string; //Buenos Aires
    userState?: string; //La Plata
    userAddress?: string; // 44 y 132
    userPostalCode?: string; // 1900
  };
  userPhone?: string;
  userActive: boolean;
  userLevel: 0 | 1;
  paymentStatus: boolean;
  userRole?: string;
  userSex?: string;
  userBirthDate?: Date;
  userHasThisBarbers?: IBarbers[];
} */

export async function GET() {
  try {
    // 3. Obtener la sesión pasando authOptions
    const session = await getServerSession(authOptions);

    // 4. Validar si existe el usuario y su ID
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();

    // 5. Ahora puedes usar session.user.id con seguridad
    const Users = await (User as mongoose.Model<IUser>).findOne({
      _id: session.user.id,
    });

    // También tienes acceso a tus campos personalizados:
    /* console.log("Nivel del usuario:", session.user.userLevel); */

    return NextResponse.json(Users);
  } catch (error) {
    console.error("Error en GET Barbers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    // 1️⃣ Sesión
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Body
    const body = await req.json();

    // Seguridad básica: si viene vacío
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    console.log("Received body:", body);

    // 3️⃣ DB
    await connectDB();

    // 4️⃣ Aplanar objetos anidados para actualización granular
    const flattenedUpdate: any = {};

    for (const [key, value] of Object.entries(body)) {
      if (
        key === "userLocation" &&
        typeof value === "object" &&
        value !== null
      ) {
        // Aplanar userLocation para actualizar campos individuales
        for (const [locationKey, locationValue] of Object.entries(value)) {
          flattenedUpdate[`userLocation.${locationKey}`] = locationValue;
        }
      } else {
        flattenedUpdate[key] = value;
      }
    }

    console.log("Flattened update:", flattenedUpdate);

    // 5️⃣ Update
    const updatedUser = await (User as mongoose.Model<IUser>)
      .findByIdAndUpdate(
        session.user.id,
        {
          $set: flattenedUpdate, // 🔥 campos aplanados para actualización granular
        },
        {
          new: true, // devuelve el doc actualizado
          runValidators: true, // respeta el schema
        }
      )
      .select("-userPassword");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Updated user:", updatedUser);

    // 6️⃣ OK
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error PATCH User:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
