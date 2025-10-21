import { connectDB } from "@/utils/mongoose";
import Clients, { IClient, IService } from "@/models/Clients"; // 👈 Sigue leyendo sobre este IClient
import SingleClientCard from "@/components/singleClientCard";
import { notFound } from "next/navigation";
import SingleClientMetrics from "@/components/singleClientMetrics";
import ServiceList from "@/components/serviceList";
import { Types } from "mongoose"; // 👈 Importante para el tipado

async function getClient(id: string) {
  await connectDB();
  // .lean() devuelve un objeto plano.
  // Usamos un tipo genérico para decirle a lean que esperamos IClient pero sin los métodos de Document
  const client = await Clients.findById(id).lean<IClient>();
  return client;
}

// Define un tipo para el cliente "plano" (de .lean())
// Esto es IClient pero sin las propiedades de Mongoose Document
// Es una solución rápida. Lo ideal es arreglarlo en Clients.ts (ver abajo)
type PlainClient = Omit<IClient, keyof Document | "Document"> & {
  _id: Types.ObjectId;
  clientServices: IService[];
};

export default async function ClientsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // 1. CORRECCIÓN: 'params' no es una promesa
    const { id } = params;
    const client = await getClient(id);

    if (!client) {
      return notFound();
    }

    // 2. CORRECCIÓN: No usamos JSON.parse(stringify()).
    // Pasamos el objeto 'client' (de .lean()) directamente.
    // Hacemos un casting al tipo PlainClient que definimos arriba.
    const clientData = client as PlainClient;

    return (
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-col gap-4">
          {/* Pasamos clientData a los componentes */}
          <SingleClientCard client={clientData} />

          {/* 3. CORRECCIÓN: Eliminamos el prop 'services' */}
          <SingleClientMetrics client={clientData} />
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
