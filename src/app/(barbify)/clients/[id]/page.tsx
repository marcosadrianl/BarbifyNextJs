import { connectDB } from "@/utils/mongoose";
import Clients, { IClientLean } from "@/models/Clients"; // <-- Importa IClientLean
import SingleClientCard from "@/components/singleClientCard";
import { notFound } from "next/navigation";
import SingleClientMetrics from "@/components/singleClientMetrics";
import ServiceList from "@/components/serviceList";
import { serializeClient } from "@/components/serializer";

/**
 * falta reparar la compatibilidad entre Typos y Esquemas.
 * no consigo serializar la estructura de los datos entre lo que obtengo desde mongoose y lo que espera SingleClientCard
 *
 * queda pendiente esto, aunque NEXT.js no se queja durante ejecucion
 *
 * revisar Client.ts y todos los componentes anidados aqui
 */

// La función debe tipar el retorno de .lean()
async function getClient(id: string): Promise<IClientLean | null> {
  await connectDB();
  // El resultado de .lean() es un POJO que concuerda con IClientLean
  const client = await Clients.findById(id).lean<IClientLean>();
  return client;
}

export default async function ClientsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = params;
    // client es de tipo IClientLean | null
    const client = await getClient(id);

    if (!client) {
      return notFound();
    }

    // Serializamos el cliente para pasarlo a Client Components
    const clientData = serializeClient(client);

    return (
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4">
          {/* Asegúrate de que clientData sea el tipo que espera SingleClientCard */}
          <SingleClientCard client={clientData} />
          <SingleClientMetrics client={clientData} />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl w-1/2">
          <ServiceList params={params} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching client:", error);
    return (
      <div className="text-red-500">
        An error occurred while fetching the client. Please try again later.
      </div>
    );
  }
}
