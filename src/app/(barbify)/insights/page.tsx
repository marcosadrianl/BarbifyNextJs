import ServicesDashboard from "@/components/insightDashboard";
import ServicesPDFGenerator from "@/lib/ServicesPDFGenerator";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { canAccessPage } from "@/lib/permissions";

export default async function Insights() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verificar si el usuario está activo
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user?.userActive) {
    redirect("/subscription");
  }

  // Verificar si el usuario tiene acceso a insights según su plan
  if (!canAccessPage(user, "insights")) {
    redirect("/subscription?feature=insights");
  }

  return (
    <div className="flex flex-col p-4 w-full h-fit gap-4 ">
      <ServicesPDFGenerator />
      <ServicesDashboard />
    </div>
  );
}
