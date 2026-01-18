import { create } from "zustand";
import { IBarbers } from "@/models/Barbers";
import { IService } from "@/models/Service.schema";
import { IClient } from "@/models/Clients.types";
import { IServiceCombined } from "@/models/models";
import axios from "axios";

const TTL_MINUTES = 30;

// --- Funciones de Ayuda (Sin cambios en lógica, solo uso) ---

export function combineClientService(
  client: IClient,
  service: IService,
): IServiceCombined {
  return {
    // Cliente
    _id: client._id,
    clientName: client.clientName,
    clientLastName: client.clientLastName,
    clientSex: client.clientSex,

    // Servicio
    serviceDate: service.serviceDate,
    serviceName: service.serviceName,
    servicePrice: service.servicePrice,
    serviceDuration: service.serviceDuration,
    serviceNotes: service.serviceNotes,
    status: service.status,
    paymentMethod: service.paymentMethod,
    fromBarberId: service.fromBarberId,
  };
}

function getCurrentDateInArgentina(): Date {
  const now = new Date();
  const argentinaTimeString = now.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  return new Date(argentinaTimeString);
}

function filterPastOrPresentServices(
  services: IServiceCombined[],
): IServiceCombined[] {
  const now = getCurrentDateInArgentina();
  return services.filter((service) => {
    // Validación de seguridad por si serviceDate es null/undefined
    if (!service?.serviceDate) return false;
    const serviceDate = new Date(service.serviceDate);
    console.log(serviceDate <= now);
    return serviceDate <= now;
  });
}

function isCacheExpired(lastSaved: string | null): boolean {
  if (!lastSaved) return true;
  const diff = Date.now() - Number(lastSaved);
  return diff > TTL_MINUTES * 60 * 1000;
}

// --- Definición del Store ---

type ServicesStore = {
  services: IServiceCombined[]; // 👈 Mantiene solo Pasados/Presentes (comportamiento default)
  allServices: IServiceCombined[]; // 👈 NUEVO: Contiene TODOS los servicios (Futuros incluidos)
  loading: boolean;
  lastUpdated: number | null;

  loadFromCache: () => void;
  refreshFromAPI: () => Promise<void>;
  clearCache: () => void;
};

type BarbersStore = {
  barbers: IBarbers[]; // 👈 Mantiene solo Pasados/Presentes (comportamiento default)

  loading: boolean;
  lastUpdated: number | null;
  loadFromCache: () => void;
  refreshFromAPI: () => Promise<void>;
  clearCache: () => void;
};

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  allServices: [], // Inicialización
  loading: false,
  lastUpdated: null,

  loadFromCache: () => {
    const cached = localStorage.getItem("services");
    const lastSaved = localStorage.getItem("services_last_saved");

    if (!cached) return;

    if (isCacheExpired(lastSaved)) return;

    try {
      // Ahora asumimos que el cache tiene TODOS los servicios
      const allServices: IServiceCombined[] = JSON.parse(cached);

      // Calculamos la vista filtrada
      const filteredServices = filterPastOrPresentServices(allServices);
      console.log("Servicios cargados desde cache:", filteredServices);

      set({
        allServices: allServices, // Guardamos crudos
        services: filteredServices, // Guardamos filtrados
        lastUpdated: Number(lastSaved),
      });
    } catch (error) {
      console.error("❌ Error parseando cache:", error);
      localStorage.removeItem("services");
      localStorage.removeItem("services_last_saved");
    }
  },

  refreshFromAPI: async () => {
    set({ loading: true });

    try {
      const [res, resClients] = await Promise.all([
        axios.get<IService[]>("/api/services"),
        axios.get<{
          data: IClient[];
        }>("/api/clients"),
      ]);

      //si responde con un 404 entonces poner todos los campos en empty array
      if (!res.status || res.status !== 200) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const allServices = res.data || [];
      const allClients = resClients.data.data || []; // 👈 importante

      const servicesWithClients: IServiceCombined[] = allServices
        .map((service) => {
          if (!service.toClientId) return null;

          const client = allClients.find(
            (c) => c._id === service.toClientId?.toString(),
          );

          return client ? combineClientService(client, service) : null;
        })
        .filter((item): item is IServiceCombined => item !== null);

      console.log("Servicios combinados:", servicesWithClients);

      // 1. Filtramos para la vista principal
      const filteredServices = filterPastOrPresentServices(servicesWithClients);

      // 2. Guardamos TODO en localStorage (para poder usar allServices offline)
      localStorage.setItem("services", JSON.stringify(servicesWithClients));
      localStorage.setItem("services_last_saved", String(Date.now()));

      set({
        allServices: servicesWithClients || [], // 👈 Estado completo
        services: filteredServices || [], // 👈 Estado filtrado
        lastUpdated: Date.now(),
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error refrescando servicios:", error);
      set({ loading: false });
    }
  },

  clearCache: () => {
    localStorage.removeItem("services");
    localStorage.removeItem("services_last_saved");
    set({
      services: [],
      allServices: [],
      lastUpdated: null,
    });
    /* console.log("🗑️ Cache limpiado"); */
  },
}));

/**
 * 🪝 HOOK HELPER: useAllServicesStore
 * Este hook envuelve el store original pero intercambia la propiedad 'services'
 * para devolver el array completo 'allServices' en su lugar.
 */
export const useAllServicesStore = () => {
  const store = useServicesStore();

  return {
    ...store,
    services: store.allServices, // 🔄 Aquí ocurre la magia: 'services' ahora es 'allServices'
    filteredServices: store.services, // Opcional: acceso a los filtrados si se necesita con otro nombre
  };
};

/**
 * 🪝 HOOK HELPER: useBarbers
 */
export const useBarbers = create<BarbersStore>((set) => ({
  barbers: [],
  loading: false,
  lastUpdated: null,

  loadFromCache: () => {
    const cached = localStorage.getItem("barbers");
    const lastSaved = localStorage.getItem("barbers_last_saved");

    if (!cached) return;

    if (isCacheExpired(lastSaved)) return;

    try {
      // Ahora asumimos que el cache tiene los Barbers
      const allBarbers: IBarbers[] = JSON.parse(cached);

      set({
        barbers: allBarbers, // Guardamos filtrados
        lastUpdated: Number(lastSaved),
      });
    } catch (error) {
      console.error("❌ Error parseando cache:", error);
      localStorage.removeItem("barbers");
      localStorage.removeItem("barbers_last_saved");
    }
  },

  refreshFromAPI: async () => {
    set({ loading: true });

    try {
      const res = await axios.get("/api/users/barbers");

      if (!res.status || res.status !== 200) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = res.data;
      const barbers: IBarbers[] = json || [];
      console.log("Respuesta Barbers:", json);

      // 2. Guardamos TODO en localStorage (para poder usar  offline)
      localStorage.setItem("barbers", JSON.stringify(barbers));
      localStorage.setItem("barbers_last_saved", String(Date.now()));

      set({
        barbers: barbers, // 👈 Estado completo
        lastUpdated: Date.now(),
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error refrescando barbers:", error);
      set({ loading: false });
    }
  },

  clearCache: () => {
    localStorage.removeItem("barbers");
    localStorage.removeItem("barbers_last_saved");
    set({
      barbers: [],
      lastUpdated: null,
    });
    /* console.log("🗑️ Cache limpiado"); */
  },
}));
