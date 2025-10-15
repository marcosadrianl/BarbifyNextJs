import Clients from "@/models/Clients";
import SingleClientCard from "./singleClientCard";
export default function ClientCards({
  props,
}: {
  props: { clients: object[] };
}) {
  return (
    <div className="flex flex-col flex-wrap gap-4">
      {props.clients.map((client: any) => (
        <div key={client._id.toString()}>
          <h2>{client.clientName}</h2>
          <p>{client.clientEmail}</p>
        </div>
      ))}
    </div>
  );
}
