import TotalServices from "@/components/fullServiceData";
import React from "react";
import { IService, IClient } from "@/models/Clients";
import { LeanService } from "@/models/service";

function leanService(service: IService): LeanService {
  return {
    _id: service._id.toString(),
    serviceName: service.serviceName,
    servicePrice: service.servicePrice,
    serviceDate:
      service.serviceDate instanceof Date
        ? service.serviceDate.toISOString()
        : service.serviceDate,
    serviceDuration: service.serviceDuration,
    serviceNotes: service.serviceNotes,
  };
}

export default function SingleClientMetrics({
  client, // 👈 Se elimina 'services'
}: {
  client: IClient;
}) {
  // Se usa directamente client.clientServices, asumiendo que contiene los datos correctos.
  const clientServices = client.clientServices.map((service) =>
    leanService(service)
  );

  return (
    <div className="w-full">
      <TotalServices services={clientServices} />
    </div>
  );
}
