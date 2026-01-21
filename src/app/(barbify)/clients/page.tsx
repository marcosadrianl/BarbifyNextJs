import { Suspense } from "react";
import ClientsPageContent from "@/components/ClientsPageContent";
import ClientsTableSkeleton from "@/skeletons/clientViewSkeleton";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/dist/client/components/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  console.log("🛡️ Session en clients page:", session);

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

  return (
    <Suspense fallback={<ClientsTableSkeleton />}>
      <ClientsPageContent />
    </Suspense>
  );
}
