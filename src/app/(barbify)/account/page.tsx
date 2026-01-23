import AccountSettings from "@/components/accountSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }
  //Permitir que solo usuarios con cuenta activa accedan a la pagina de cuenta
  /*   // Verificar si el usuario está activo
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user?.userActive) {
    redirect("/subscription");
  } */

  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Tu Cuenta</h1>
      <p className="text-gray-400 mb-6 px-4">
        Ve la información de la cuenta asociada a tu usuario.
      </p>
      <AccountSettings />
    </div>
  );
}
