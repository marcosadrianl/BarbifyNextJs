//TODO crear endpint que permite traer, editar, o eliminar un barber ya creado por un user específico
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";

import Barbers from "@/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";

// --- Helper: Validar sesión ---
async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

// --- Helper: Validar ID ---
function validateId(barberId: string) {
  return Types.ObjectId.isValid(barberId);
}

/**
 * GET /api/users/[id]/barbers/[id]
 */
export async function GET() {}
