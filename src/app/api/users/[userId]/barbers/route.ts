import { NextResponse } from "next/server";
import mongoose, { Model } from "mongoose";
import { connectDB } from "@/utils/mongoose";
import User, { IUser } from "@/models/Users";
import Barbers from "@/models/Barbers";

// Type assertion para el modelo
const UserModel = User as Model<IUser>;

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await UserModel.findById(userId).populate({
      path: "userHasThisBarbers",
      select: "barberName barberLastName barberEmail barberActive",
      model: Barbers,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.userHasThisBarbers ?? [], { status: 200 });
  } catch (error) {
    console.error("GET barbers error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.userHasThisBarbers = [];
    await user.save();

    return NextResponse.json(
      { message: "Barbers cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id: userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { barbers } = await req.json();

    user.userHasThisBarbers = barbers;

    await user.save();

    return NextResponse.json(user.userHasThisBarbers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id: userId } = params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { barbers } = await req.json();

    user.userHasThisBarbers = barbers;

    await user.save();

    return NextResponse.json(user.userHasThisBarbers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
