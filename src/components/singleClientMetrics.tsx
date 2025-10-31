import TotalServices from "@/components/fullServiceData";
import React from "react";
import { IClient } from "@/models/Clients";

export default function SingleClientMetrics({
  client, // 👈 Se elimina 'services'
}: {
  client: IClient;
}) {
  const result = JSON.parse(JSON.stringify(client));
  return (
    <div className="w-full">
      <TotalServices services={result.clientServices} />
    </div>
  );
}
