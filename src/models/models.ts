// lib/models.ts
/**
 * Registry central de modelos
 * Importa este archivo antes de hacer cualquier populate
 * para asegurar que todos los modelos estén registrados
 */

import User from "@/models/Users.model";
import Barbers, { IBarbers } from "@/models/Barbers";
import { IClient } from "@/models/Clients.types";
import Clients from "@/models/Clients.model";
import { IService } from "@/models/Service.type";

// Re-exportar para conveniencia
export { User, Barbers, Clients };

// Función helper para asegurar que los modelos estén registrados
export function ensureModelsRegistered() {
  // Solo importar los modelos ya los registra
  return { User, Barbers, Clients };
}

//Esto mas que nada se usa en el dashboard y la agenda para mostrar servicios con datos del cliente
type IServiceDashboard = Pick<
  IService,
  | "serviceDate"
  | "serviceName"
  | "servicePrice"
  | "serviceDuration"
  | "status"
  | "serviceNotes"
  | "paymentMethod"
  | "fromBarberId"
>;

type IClientDashboard = Pick<
  IClient,
  "_id" | "clientName" | "clientLastName" | "clientSex" | "clientPhone"
>;

export type IServiceCombined = IClientDashboard & IServiceDashboard;
