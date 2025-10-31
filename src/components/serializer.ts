/* // @/components/serializer.ts
// Asegúrate de que IClientLean e IServiceLean se exporten desde tu modelo Clients
import { IClient, IService } from "@/models/Clients";
import { ObjectId } from "mongodb";
// ^^^ ¡IMPORTANTE! Reemplaza IClient, IService con IClientLean, IServiceLean

// Tipo para el cliente serializado (sin ObjectId ni métodos de Mongoose)
export type SerializedClient = {
  _id: ObjectId;
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O";
  clientBirthdate?: Date; // Será un string ISO 8601
  clientEmail?: string;
  clientPhone?: string;
  clientImage?: string;
  clientActive: boolean;
  clientBaseColor?: string;
  clientHairType?: string;
  clientAllergies?: string;
  clientDiseases?: string;
  clientMedications?: string;
  clientNotes?: string;
  clientServices: SerializedService[];
  clientWhiteHairs: number;
  clientFromUserId?: ObjectId;
  createdAt?: Date; // Será un string ISO 8601
  updatedAt?: Date; // Será un string ISO 8601
};

export type SerializedService = {
  _id: string; // ObjectId convertido a string
  serviceDate: string; // Date convertido a string ISO 8601
  serviceName: string;
  serviceNotes?: string;
  servicePrice: number;
  serviceDuration: number;
  fromBarberId?: string; // ObjectId convertido a string
};

// Función para serializar un servicio
// AHORA ESPERA IServiceLean como entrada
export function serializeService(service: IService): SerializedService {
  return {
    _id: service._id.toString(), // .lean() devuelve Types.ObjectId aquí
    serviceDate: service.serviceDate.toISOString(), // .lean() devuelve Date aquí
    serviceName: service.serviceName,
    serviceNotes: service.serviceNotes,
    servicePrice: service.servicePrice,
    serviceDuration: service.serviceDuration,
    fromBarberId: service.fromBarberId?.toString(), // .lean() devuelve Types.ObjectId aquí
  };
}

// Función para serializar un cliente
// AHORA ESPERA IClientLean como entrada
export function serializeClient(client: IClient): SerializedClient {
  const {
    _id,
    clientName,
    clientLastName,
    clientSex,
    clientBirthdate,
    clientEmail,
    clientPhone,
    clientImage,
    clientActive,
    clientBaseColor,
    clientHairType,
    clientAllergies,
    clientDiseases,
    clientMedications,
    clientNotes,
    clientServices,
    clientWhiteHairs,
    clientFromUserId,
    createdAt, // Añade createdAt y updatedAt para serializarlos
    updatedAt, // Añade createdAt y updatedAt para serializarlos
  } = client;

  return {
    _id: _id, // Convertir ObjectId a string
    clientName,
    clientLastName,
    clientSex,
    clientBirthdate: clientBirthdate, // Convertir Date a string ISO 8601
    clientEmail,
    clientPhone,
    clientImage,
    clientActive,
    clientBaseColor,
    clientHairType,
    clientAllergies,
    clientDiseases,
    clientMedications,
    clientNotes,
    // clientServices siempre debería ser un array en IClientLean, no es necesario ?? []
    clientServices: clientServices.map(serializeService),
    clientWhiteHairs,
    clientFromUserId: clientFromUserId, // Convertir ObjectId a string
    createdAt: createdAt, // Convertir Date a string ISO 8601
    updatedAt: updatedAt, // Convertir Date a string ISO 8601
  };
}
 */
