import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/utils/mongoose";
import Clients, { IClient } from "@/models/Clients";
import mongoose, { Types } from "mongoose";
import SingleClientCard from "@/components/singleClientCard";
import SingleClientMetrics from "@/components/singleClientMetrics";
import ServiceList from "@/components/serviceList";

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
    <div className="flex flex-row gap-24 p-4 w-full h-full">
      <div className="flex flex-col gap-4 w-full mx-auto">
        <SingleClientCard client={result as IClient} />
        <SingleClientMetrics client={result as IClient} />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl w-1/2 ">
        <ServiceList params={params} />
      </div>
    </div>
  );
}
