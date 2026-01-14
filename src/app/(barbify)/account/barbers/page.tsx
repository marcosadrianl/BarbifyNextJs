import BarbersInfo from "@/components/barbersInfo";
import NewBarber from "@/components/newBarber";
import { getServerSession } from "next-auth/next"; // 1. Importar getServerSession
import { authOptions } from "@/utils/auth"; // 2. Importar tus authOptions

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-4 p-4">Barbers</h1>
      <p className="text-muted-foreground mb-6 px-4">
        Ve la información sobre los Barbers.
      </p>
      <BarbersInfo />
      <NewBarber ownerUserId={session?.user?.id} />
    </div>
  );
}
