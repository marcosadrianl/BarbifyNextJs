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

type ServicesStore = {
  services: ClientService[];
  loading: boolean;
  lastUpdated: number | null;

  loadFromCache: () => void;
  refreshFromAPI: () => Promise<void>;
};

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  loading: false,
  lastUpdated: null,

  loadFromCache: () => {
    const cached = localStorage.getItem("services");
    const lastSaved = localStorage.getItem("services_last_saved");

    if (!cached || !lastSaved) return;

    const diff = Date.now() - Number(lastSaved) > TTL_MINUTES * 60 * 1000;

    if (diff) return;

    set({
      services: JSON.parse(cached),
      lastUpdated: Number(lastSaved),
    });
  },

  refreshFromAPI: async () => {
    set({ loading: true });

    try {
      const res = await fetch("/api/diary");
      const json = await res.json();

      const data = json.data || [];

      localStorage.setItem("services", JSON.stringify(data));
      localStorage.setItem("services_last_saved", String(Date.now()));

      set({
        services: data,
        lastUpdated: Date.now(),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
