import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users";
import Barbers from "@/models/Barbers";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(userId).populate({
      path: "userHasThisBarbers",
      select: "barberName barberLastName barberEmail barberActive",
      model: Barbers,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Barbers:", user.userHasThisBarbers);

    return NextResponse.json(user.userHasThisBarbers ?? [], { status: 200 });
  } catch (error: any) {
    console.error("GET barbers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const userId = params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.userHasThisBarbers = [];
    await user.save();

    return NextResponse.json(
      { message: "Barbers cleared successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = params.id;

    // Verifica formato válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { barbers } = await req.json();

    user.userHasThisBarbers = barbers;

    await user.save();

    return NextResponse.json(user.userHasThisBarbers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = params.id;

    // Verifica formato válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { barbers } = await req.json();

    user.userHasThisBarbers = barbers;

    await user.save();

    return NextResponse.json(user.userHasThisBarbers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
