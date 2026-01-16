import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient } from "@/models/Clients";
import mongoose, { Types } from "mongoose";
import SingleClientCard from "@/components/singleClientCard";
import ClientHealthCard from "@/components/clientHealthCard";
import ServiceList from "@/components/serviceList";
import ClientActions from "@/components/clientActions";
import Services, { IService, serializeService } from "@/models/Service";
import TotalServices from "@/components/fullServiceData";

export default async function ClientsPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return notFound();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) return notFound();

  const client = await (Clients as mongoose.Model<IClient>)
    .findOne({
      _id: new Types.ObjectId(id),
      clientFromUserId: new Types.ObjectId(session.user.id),
    })
    .lean();

  if (!client) return notFound();

  const result = JSON.parse(JSON.stringify(client));

  return (
    <div className="flex flex-row gap-4 p-4 w-full h-fit">
      <div className="flex flex-col gap-4 w-3/5 mx-auto">
        <SingleClientCard client={result as IClient} />
        <ClientActions client={result as IClient} />
        <ClientHealthCard client={result as IClient} />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl w-2/5 ">
        <ServiceList params={{ id }} />
      </div>
    </div>
  );
}
