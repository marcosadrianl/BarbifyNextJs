import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";
import SingleClientCard from "@/components/singleClientCard";
import { notFound } from "next/navigation";
import SingleClientMetrics from "@/components/singleClientMetrics";
import ServiceList from "@/components/serviceList";

async function getClient(id: string) {
  await connectDB();
  const client = await Clients.findById(id).lean(); // devuelve objeto plano
  return client;
}

export default async function ClientsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    //page.tsx:18   Server  Error: Route "/clients/[id]" used `params.id`. `params` should be awaited before using its properties.
    const { id } = await params;
    const client = await getClient(id);
    const clientPlane = JSON.parse(JSON.stringify(client));

    if (!clientPlane) {
      return notFound();
    }

    return (
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-col gap-4">
          <SingleClientCard client={clientPlane} />
          <SingleClientMetrics
            services={clientPlane.clientServices}
            client={clientPlane}
          />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl  w-1/2">
          <ServiceList params={params} />
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
