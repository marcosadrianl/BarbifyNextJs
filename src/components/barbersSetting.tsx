"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  SquareArrowUpRight,
  Info,
  ArrowUpRight,
} from "lucide-react";
import EditUserCard from "@/components/EditUserCard";
import { Separator } from "@radix-ui/react-separator";

/**
 * UsersList - componente cliente que consume un endpoint GET y muestra campos dinámicamente.
 * Ajusta endpoint si tu ruta es distinta.
 */
type UsersListProps = {
  endpoint?: string;
};

export default function BarbersSettings({
  endpoint = "/api/users",
}: UsersListProps) {
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<
    "create" | "ver" | "edit" | null
  >(null);

  const normalizeData = (resData: any): any[] => {
    // Si ya es array, devuelvo tal cual
    if (Array.isArray(resData)) return resData;
    if (resData == null) return [];
    // Common wrappers
    if (typeof resData === "object") {
      if (Array.isArray(resData.data)) return resData.data;
      if (Array.isArray(resData.users)) return resData.users;
      if (Array.isArray(resData.results)) return resData.results;
      // Si es un objeto Mongoose/documento o un único recurso, lo envuelvo en array
      return [resData];
    }
    // Otros tipos (string/number), lo devuelvo en array
    return [resData];
  };

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(endpoint);
        // Intenta normalizar distintas formas de respuesta
        const raw = res.data;
        const data = normalizeData(raw);
        if (mounted) setUsers(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.error || err?.message || "Error al obtener datos"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [endpoint]);

  const formatValue = (val: any) => {
    if (val === null || typeof val === "undefined") return "-";
    if (typeof val === "boolean") return val ? "Sí" : "No";
    if (typeof val === "string") {
      // detecta ISO date-like strings
      const d = Date.parse(val);
      if (!isNaN(d) && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
        return new Date(val).toLocaleString();
      }
      return val;
    }
    if (val instanceof Date) return val.toLocaleDateString();
    if (typeof val === "object") {
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  <div className="flex flex-col">
    {openSection !== "create" ? (
      <div
        className="cursor-pointer hover:bg-gray-100 p-4"
        onClick={() => setOpenSection("create")}
      >
        <span className="flex flex-row w-full justify-between items-center">
          <span>
            <h2>Información de los Barbers</h2>
            <p className="text-xs foreground">
              Ve la información de los barbers registrados en tu cuenta.
            </p>
          </span>
          <ChevronRight className="w-6 h-6" />
        </span>
      </div>
    ) : (
      <div>
        <div
          className="flex flex-row gap-4 mb-4 cursor-pointer hover:bg-gray-100 py-4"
          onClick={() => setOpenSection(null)}
        >
          <ChevronLeft />
          <h2>Información de los Barbers</h2>
        </div>

        {/* acá va la lista de barbers */}
      </div>
    )}
  </div>;
}
