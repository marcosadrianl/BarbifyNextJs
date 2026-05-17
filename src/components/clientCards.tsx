import { IClient } from "@/models/Clients.schema";
import useTheme from "@/hooks/useTheme";

export default function ClientCards({
  props,
}: {
  props: { clients: IClient[] };
}) {
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col flex-wrap gap-4"
      style={{ color: theme.textPrimary }}
    >
      {props.clients.map((client: IClient) => (
        <div
          key={client._id!.toString()}
          style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
          className="rounded-2xl border p-4"
        >
          <h2 style={{ color: theme.textPrimary }}>{client.clientName}</h2>
          <p style={{ color: theme.textSecondary }}>{client.clientPhone}</p>
        </div>
      )) || (
        <p style={{ color: theme.textSecondary }}>
          No hay clientes registrados
        </p>
      )}
    </div>
  );
}
