import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import DiaryClient from "./DiaryClient";
import { canAccessPage, hasAppAccess } from "@/lib/permissions";

export default async function DiaryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Cargar usuario con datos de suscripción
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user) {
    redirect("/login");
  }

  // Validar acceso a la aplicación (activo + suscripción válida)
  if (!hasAppAccess(user)) {
    redirect("/subscription");
  }

  // Validar acceso a la página específica según el plan
  if (!canAccessPage(user, "diary")) {
    redirect("/unauthorized?feature=diary");
  }

  return <DiaryClient />;
}
