import AccountSettings from "@/components/accountSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
import { hasAppAccess } from "@/lib/permissions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user) {
    redirect("/login");
  }

  if (!hasAppAccess(user)) {
    redirect("/subscription");
  }

  return (
    <div className="min-h-full">
      <h1 className="mb-4 p-4 text-xl font-bold text-[var(--theme-text-primary)]">
        Tu Cuenta
      </h1>
      <p className="mb-6 px-4 text-[var(--theme-text-secondary)]">
        Ve la información de la cuenta asociada a tu usuario.
      </p>
      <AccountSettings />
    </div>
  );
}
