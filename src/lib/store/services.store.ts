import { create } from "zustand";

export type ClientService = {
  clientId: string;
  clientName: string;
  clientLastName: string;
  clientPhone: string;
  clientSex: "M" | "F" | "O";
  clientActive: boolean;
  createdAt: string;

  clientServices: {
    _id: string;
    serviceName: string;
    servicePrice: number;
    serviceDate: string;
    serviceDuration: number;
    serviceNotes: string;
  };
};

const TTL_MINUTES = 30;

/**
 * Obtiene la fecha/hora actual en Argentina (UTC-3)
 * Retorna un objeto Date en hora de Argentina
 */
function getCurrentDateInArgentina(): Date {
  // Crear fecha en UTC
  const now = new Date();

  // Convertir a hora de Argentina (UTC-3)
  // toLocaleString con timezone devuelve string, lo convertimos a Date
  const argentinaTimeString = now.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return new Date(argentinaTimeString);
}

/**
 * Filtra servicios que sean anteriores o iguales a la fecha actual en Argentina
 */
function filterPastOrPresentServices(
  services: ClientService[]
): ClientService[] {
  const now = getCurrentDateInArgentina();

  return services.filter((service) => {
    const serviceDate = new Date(service.clientServices.serviceDate);

    // Comparar: servicio debe ser <= ahora
    return serviceDate <= now;
  });
}

/**
 * Verifica si el cache está expirado
 */
function isCacheExpired(lastSaved: string | null): boolean {
  if (!lastSaved) return true;

  const diff = Date.now() - Number(lastSaved);
  const isExpired = diff > TTL_MINUTES * 60 * 1000;

  if (isExpired) {
    console.log("⚠️ Cache expirado:", {
      minutosTranscurridos: Math.floor(diff / 60000),
      TTL: TTL_MINUTES,
    });
  }

  return isExpired;
}

type ServicesStore = {
  services: ClientService[];
  loading: boolean;
  lastUpdated: number | null;

  loadFromCache: () => void;
  refreshFromAPI: () => Promise<void>;
  clearCache: () => void;
};

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  loading: false,
  lastUpdated: null,

  /**
   * Carga servicios desde localStorage si no está expirado
   */
  loadFromCache: () => {
    const cached = localStorage.getItem("services");
    const lastSaved = localStorage.getItem("services_last_saved");

    if (!cached) {
      console.log("📭 No hay servicios en cache");
      return;
    }

    // Verificar si está expirado
    if (isCacheExpired(lastSaved)) {
      console.log("🔄 Cache expirado, se necesita refresh");
      return;
    }

    try {
      const allServices: ClientService[] = JSON.parse(cached);

      // ✅ Filtrar solo servicios pasados o presentes
      const filteredServices = filterPastOrPresentServices(allServices);

      console.log("📦 Servicios cargados del cache:", {
        total: allServices.length,
        filtrados: filteredServices.length,
        eliminados: allServices.length - filteredServices.length,
      });

      set({
        services: filteredServices,
        lastUpdated: Number(lastSaved),
      });
    } catch (error) {
      console.error("❌ Error parseando cache:", error);
      localStorage.removeItem("services");
      localStorage.removeItem("services_last_saved");
    }
  },

  /**
   * Refresca servicios desde la API
   */
  refreshFromAPI: async () => {
    set({ loading: true });

    try {
      console.log("🔄 Refrescando servicios desde API...");

      const res = await fetch("/api/diary");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const allServices: ClientService[] = json.data || [];

      console.log("📡 Servicios recibidos de API:", allServices.length);

      // ✅ Filtrar solo servicios pasados o presentes
      const filteredServices = filterPastOrPresentServices(allServices);

      console.log("✅ Servicios filtrados:", {
        total: allServices.length,
        filtrados: filteredServices.length,
        futuros: allServices.length - filteredServices.length,
        fechaActualArgentina: getCurrentDateInArgentina().toISOString(),
      });

      // Guardar en localStorage
      localStorage.setItem("services", JSON.stringify(filteredServices));
      localStorage.setItem("services_last_saved", String(Date.now()));

      set({
        services: filteredServices,
        lastUpdated: Date.now(),
        loading: false,
      });
    } catch (error) {
      console.error("❌ Error refrescando servicios:", error);
      set({ loading: false });
    }
  },

  /**
   * Limpia el cache de servicios
   */
  clearCache: () => {
    localStorage.removeItem("services");
    localStorage.removeItem("services_last_saved");
    set({
      services: [],
      lastUpdated: null,
    });
    console.log("🗑️ Cache limpiado");
  },
}));
