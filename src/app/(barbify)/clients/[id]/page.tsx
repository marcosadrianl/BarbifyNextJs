import { connectDB } from "@/utils/mongoose";
import Clients, { IClient } from "@/models/Clients"; // <-- Importa IClientLean
import SingleClientCard from "@/components/singleClientCard";
import { notFound } from "next/navigation";
import SingleClientMetrics from "@/components/singleClientMetrics";
import ServiceList from "@/components/serviceList";

/**
 * falta reparar la compatibilidad entre Typos y Esquemas.
 * no consigo serializar la estructura de los datos entre lo que obtengo desde mongoose y lo que espera SingleClientCard
 *
 * queda pendiente esto, aunque NEXT.js no se queja durante ejecucion
 *
 * revisar Client.ts y todos los componentes anidados aqui
 */

// La función debe tipar el retorno de .lean()
async function getClient(id: string): Promise<IClient | null> {
  await connectDB();
  // El resultado de .lean() es un POJO? que concuerda con IClientLean
  const client = await Clients.findById(id).lean<IClient>();
  return client;
}

export default async function ClientsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;
    // client es de tipo IClient | null
    const client = await getClient(id);

    const result = JSON.parse(JSON.stringify(client));

    if (!client) {
      return notFound();
    }

    return (
      <div className="flex flex-row gap-24 bg-[#cebaa1] p-4 ">
        <div className="flex flex-col gap-4 w-full mx-auto">
          <SingleClientCard client={result as IClient} />
          <SingleClientMetrics client={client} />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl w-1/2">
          <ServiceList params={params} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching client:", error);
    return notFound();
  }
}
