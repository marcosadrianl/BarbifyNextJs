/* ───────────────────────────────
   1. INTERFACES TYPESCRIPT
───────────────────────────────── */
export interface IService {
  _id?: string;
  serviceDate: Date;
  serviceName: string;
  serviceTypeId?: string; // Referencia a un posible catálogo de tipos de servicio

  servicePrice: number;
  serviceDuration: number;
  serviceNotes?: string;

  status?: "completed" | "cancelled" | "no_show" | "pending"; // Estado del servicio
  paymentMethod?: "cash" | "card" | "mp" | "transfer";

  fromBarberId?: string;
  forUserId: string;
  toClientId?: string;

  createdBy?: string; // Barber que creó el servicio

  isManual?: boolean; // Indica si el servicio fue agregado manualmente
  isEdited?: boolean; // Indica si el servicio fue editado después de su creación

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
