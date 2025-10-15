import TotalServices from "@/components/fullServiceData";
import React from "react";
import { IService, IClient } from "@/models/Clients";

export default function SingleClientMetrics({
  services,
  client,
}: {
  services: IService[];
  client: IClient;
}) {
  let clientServices = services;
  if (client) {
    clientServices = client.clientServices;
  }
  return (
    <div className="w-full">
      <TotalServices services={clientServices} />
    </div>
  );
}
