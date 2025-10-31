import TotalServices from "@/components/fullServiceData";
import React from "react";
import { IClient } from "@/models/Clients";

export default function SingleClientMetrics({
  client, // 👈 Se elimina 'services'
}: {
  client: IClient;
}) {
  return (
    <div className="w-full">
      <TotalServices services={client.clientServices} />
    </div>
  );
}
