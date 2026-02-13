import ServicesDashboard from "@/components/insightDashboard";
import ServicesPDFGenerator from "@/lib/ServicesPDFGenerator";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { canAccessPage, hasFeature, hasAppAccess } from "@/lib/permissions";

export default async function Insights() {
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
  if (!canAccessPage(user, "insights")) {
    redirect("/unauthorized?feature=insights");
  }

  const canExportPDF = hasFeature(user, "exportPDF");
  const limitToToday = !hasFeature(user, "customDateRanges");
  const canSeeServicesDashboard = hasFeature(user, "insightsDashboard");

  return (
    <div className="flex flex-col p-4 w-full h-fit gap-4 ">
      {canExportPDF && <ServicesPDFGenerator limitToToday={limitToToday} />}
      {canSeeServicesDashboard && <ServicesDashboard />}
    </div>
  );
}
