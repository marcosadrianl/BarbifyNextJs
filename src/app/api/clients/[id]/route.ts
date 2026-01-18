import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { Types } from "mongoose";
import mongoose from "mongoose";
import type { IClient } from "@/models/Clients.types";

// --- Helper: Validar sesión ---
async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  return session;
}

// --- Helper: Validar ID ---
function validateId(id: string) {
  return Types.ObjectId.isValid(id);
}

/**
 * GET /api/clients/[id]
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await requireSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const clientId = id;

    // Validar ID
    if (!validateId(clientId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const userId = new Types.ObjectId(session.user.id);

    // Buscar el cliente que pertenezca al usuario
    // Ajusta .select(...) si quieres limitar campos devueltos
    //const clients = await (Clients as mongoose.Model<IClient>)
    const client = await (Clients as mongoose.Model<IClient>)
      .findOne({
        _id: new Types.ObjectId(clientId),
        clientFromUserId: userId,
      })
      .lean(); // ← importante: devuelve POJO

    if (!client)
      return NextResponse.json({ error: "Client not found" }, { status: 404 });

    return NextResponse.json(client);
  } catch (error) {
    console.error("GET Client error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/clients/[id]
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await requireSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!validateId(params.id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const userId = new Types.ObjectId(session.user.id);
    const body = await request.json();

    const updated = await (Clients as mongoose.Model<IClient>).findOneAndUpdate(
      { _id: params.id, clientFromUserId: userId },
      body,
      { new: true, runValidators: true },
    );

    if (!updated)
      return NextResponse.json({ error: "Client not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT client error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/clients/[id]
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await requireSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    if (!validateId(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const userId = new Types.ObjectId(session.user.id);
    const data = await request.json();

    const updated = await (Clients as mongoose.Model<IClient>).findOneAndUpdate(
      { _id: id, clientFromUserId: userId },
      data,
      { new: true, runValidators: true },
    );

    if (!updated)
      return NextResponse.json({ error: "Client not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH client error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/clients/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const session = await requireSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!validateId(params.id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const userId = new Types.ObjectId(session.user.id);

    const deleted = await (Clients as mongoose.Model<IClient>).findOneAndDelete(
      {
        _id: params.id,
        clientFromUserId: userId,
      },
    );

    if (!deleted)
      return NextResponse.json({ error: "Client not found" }, { status: 404 });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("DELETE client error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
