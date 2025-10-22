import { format } from "date-fns";
//importar interface de clientes desde models
import { IService } from "@/models/Clients";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";

async function getClient(id: string) {
  await connectDB();
  const client = await Clients.findById(id).lean(); // devuelve objeto plano
  return client;
}

export default async function ServiceList({
  params,
}: {
  params: { id: string };
}) {
  try {
    //page.tsx:18   Server  Error: Route "/clients/[id]" used `params.id`. `params` should be awaited before using its properties.
    const { id } = await params;
    const clientServices = await getClient(id);
    const client = JSON.parse(JSON.stringify(clientServices));
    //mapear los servicios del cliente

    return (
      <div className="w-full bg-[#ffd49d] h-fit p-4 rounded-2xl">
        <h2 className=" text-2xl font-bold">Ultimos Servicios</h2>
        <div className="flex flex-col   gap-1 max-w-[500px] ">
          {/*mapear los ultimos 5 servicios del cliente*/}
          {client.clientServices.length === 0 ? (
            <p className="text-center">No hay servicios registrados</p>
          ) : (
            client.clientServices.slice(0, 5).map((service: IService) => (
              <div
                key={service._id.toString()}
                className="p-2 my-2 bg-[#dda863] rounded-2xl"
              >
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xl font-bold capitalize">
                    {service.serviceName}{" "}
                  </p>
                  <p className="text-base font-normal ">
                    {format(service.serviceDate, "yyyy-MM-dd")
                      .split("-")
                      .reverse()
                      .join("/")}
                  </p>
                </div>
                {service.serviceNotes ? (
                  <p className="w-3/4 italic mt-2 truncate">
                    • {service.serviceNotes}
                  </p>
                ) : (
                  <p className=" italic mt-2">• Sin Notas</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
