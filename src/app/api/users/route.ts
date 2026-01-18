import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // 1. Importar getServerSession
import { authOptions } from "@/utils/auth"; // 2. Importar tus authOptions
import { IUser } from "@/models/Users.type";
import User from "@/models/Users.model";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

export async function GET() {
  // 3. Obtener la sesión pasando authOptions
  const session = await getServerSession(authOptions);

  // 4. Validar si existe el usuario y su ID
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
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
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  // 1️⃣ Sesión
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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
        },
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
      { status: 500 },
    );
  }
}
