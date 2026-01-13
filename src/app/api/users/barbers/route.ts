import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // 1. Importar getServerSession
import { authOptions } from "@/utils/auth"; // 2. Importar tus authOptions
import Barbers, { IBarbers } from "@/models/Barbers";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    // 3. Obtener la sesión pasando authOptions
    /* const session = await getServerSession(authOptions);

    // 4. Validar si existe el usuario y su ID
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    } */

    await connectDB();

    // 5. Ahora puedes usar session.user.id con seguridad
    const barbers = await (Barbers as mongoose.Model<IBarbers>).find({
      ownerUserId: "690e01c4aa84ca63d3fa6572",
    });

    // También tienes acceso a tus campos personalizados:
    /* console.log("Nivel del usuario:", session.user.userLevel); */

    return NextResponse.json(barbers);
  } catch (error) {
    console.error("Error en GET Barbers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
