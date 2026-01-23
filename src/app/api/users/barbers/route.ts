import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // 1. Importar getServerSession
import { authOptions } from "@/utils/auth"; // 2. Importar tus authOptions
import Barbers, { IBarbers } from "@/models/Barbers";
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
    const barbers = await (Barbers as mongoose.Model<IBarbers>).find({
      ownerUserId: session.user.id,
    });

    // También tienes acceso a tus campos personalizados:

    return NextResponse.json(barbers);
  } catch (error) {
    console.error("Error en GET Barbers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      barberName,
      barberLastName,
      barberEmail,
      barberPhone,
      barberActive,
      barberRole,

      city,
      state,
      address,
      postalCode,

      barberLevel,
      barberBirthDate,
      barberImageURL,
      ownerUserId,
    } = body;

    await connectDB();

    const existingBarber = await (Barbers as mongoose.Model<IBarbers>).findOne({
      barberEmail,
    });

    if (existingBarber) {
      return NextResponse.json(
        { error: "Ya existe un barber con este email" },
        { status: 400 },
      );
    }

    const newBarber = new (Barbers as mongoose.Model<IBarbers>)({
      barberName,
      barberLastName,
      barberEmail,
      barberPhone,
      barberActive,
      barberRole,

      city,
      state,
      address,
      postalCode,

      barberLevel,
      barberBirthDate,
      barberImageURL,
      ownerUserId,
    });

    await newBarber.save();

    return NextResponse.json(
      { message: "Barber creado correctamente" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creando barber:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("id");

    if (!barberId) {
      return NextResponse.json(
        { error: "ID de barber es requerido" },
        { status: 400 },
      );
    }
    await connectDB();

    const deletedBarber = await (
      Barbers as mongoose.Model<IBarbers>
    ).findByIdAndDelete(barberId);
    if (!deletedBarber) {
      return NextResponse.json(
        { error: "Barber no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Barber eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error eliminando barber:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
