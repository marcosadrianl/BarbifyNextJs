import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { authOptions } from "@/utils/auth";
import { connectDB } from "@/utils/mongoose";
import { IUser } from "@/models/Users.type";
import User from "@/models/Users.model";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // 1️⃣ Sesión

    // 2️⃣ Body
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 3️⃣ Política de contraseña
    // Min 8 chars, 1 mayúscula, 1 minúscula, 1 número
    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!PASSWORD_REGEX.test(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long and include uppercase, lowercase and number",
        },
        { status: 400 },
      );
    }

    // 4️⃣ DB
    await connectDB();

    const user = await (User as mongoose.Model<IUser>).findById(
      session.user.id,
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5️⃣ Verificar contraseña actual (BACKEND)
    const isValid = await bcrypt.compare(currentPassword, user.userPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // 6️⃣ Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7️⃣ Update
    user.userPassword = hashedPassword;
    await user.save();

    // 8️⃣ Invalidar sesión
    // 👉 obliga al usuario a loguearse de nuevo
    return NextResponse.json(
      {
        message: "Password updated successfully. Please login again.",
        logout: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PATCH password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
