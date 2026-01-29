import { IClient } from "@/models/Clients.schema";

export default function ClientCards({
  props,
}: {
  props: { clients: IClient[] };
}) {
  return (
    <div className="flex flex-col flex-wrap gap-4">
      {props.clients.map((client: IClient) => (
        <div key={client._id!.toString()}>
          <h2>{client.clientName}</h2>
          <p>{client.clientPhone}</p>
        </div>
      )) || <p>No hay clientes registrados</p>}
    </div>
  );
}
