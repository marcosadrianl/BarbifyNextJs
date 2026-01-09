"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { ChevronRight, ChevronLeft, SquareArrowUpRight } from "lucide-react";
import EditUserCard from "@/components/EditUserCard";

/**
 * UsersList - componente cliente que consume un endpoint GET y muestra campos dinámicamente.
 * Ajusta endpoint si tu ruta es distinta.
 */
type UsersListProps = {
  endpoint?: string;
};

export default function UsersList({ endpoint = "/api/users" }: UsersListProps) {
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<
    "account" | "user" | "edit" | null
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

  console.log("UsersList - users:", users);

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

  return (
    <div className="flex flex-col">
      {openSection !== "user" &&
        openSection !== "edit" &&
        (openSection !== "account" ? (
          <div
            className="text-muted cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("account")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Información de la cuenta</h2>
                <p className="text-xs text-muted-foreground">
                  Ve información de la cuenta como email, teléfono, estado y
                  fecha de creación.
                </p>
              </span>
              <ChevronRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="p-4 ">
            <div className="flex flex-row gap-4 mb-4">
              <ChevronLeft
                className="cursor-pointer text-muted rounded-full hover:bg-gray-100"
                onClick={() => setOpenSection(null)}
              />
              <h2>Información de la cuenta</h2>
            </div>

            <div className="mb-2">
              <h2>Email de la cuenta</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userEmail}
              </p>
            </div>

            <div className="mb-2">
              <h2>Teléfono</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userPhone}
              </p>
            </div>

            <div className="mb-2">
              <h2>Activo</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userActive ? "Sí" : "No"}
              </p>
            </div>

            <div className="mb-2">
              <h2>Creación de la cuenta</h2>
              <p className="text-muted-foreground text-sm">
                {formatValue(users[0].createdAt)}
              </p>
            </div>
          </div>
        ))}

      {openSection !== "account" &&
        openSection !== "edit" &&
        (openSection !== "user" ? (
          <div
            className="text-muted cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("user")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Información de Usuario</h2>
                <p className="text-xs text-muted-foreground">
                  Ve información personal asociada a tu usuario.
                </p>
              </span>
              <ChevronRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex flex-row gap-4 mb-4">
              <ChevronLeft
                className="cursor-pointer text-muted rounded-full hover:bg-gray-100"
                onClick={() => setOpenSection(null)}
              />
              <h2>Información de Usuario</h2>
            </div>

            <div className="mb-2">
              <h2>Nombre de usuario</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userName} {users[0].userLastName}
              </p>
            </div>

            <div className="mb-2">
              <h2>Ubicación</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userState ?? "-"}, {users[0].userCity},{" "}
                {users[0].userAddress}, {users[0].userPostalCode}
              </p>
            </div>

            <div className="mb-2">
              <h2>Género</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userSex === "M"
                  ? "Hombre"
                  : users[0].userSex === "F"
                  ? "Mujer"
                  : "Otro"}
              </p>
            </div>

            <div className="mb-2">
              <h2>Nacimiento</h2>
              <p className="text-muted-foreground text-sm">
                {users[0].userBirthDate
                  .toString()
                  .slice(0, 10)
                  .replaceAll("-", "/")
                  .split("/")
                  .reverse()
                  .join("/")}
              </p>
            </div>
          </div>
        ))}

      {openSection !== "account" &&
        openSection !== "user" &&
        (openSection !== "edit" ? (
          <div
            className="text-muted cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("edit")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Editar Información de la Cuenta</h2>
                <p className="text-xs text-muted-foreground">
                  Edita la información general de tu cuenta.
                </p>
              </span>
              <SquareArrowUpRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex flex-row gap-4 mb-4">
              <ChevronLeft
                className="cursor-pointer text-muted rounded-full hover:bg-gray-100"
                onClick={() => setOpenSection(null)}
              />
              <h2>Editar Información de la Cuenta</h2>
            </div>
            <EditUserCard
              open={true}
              onClose={() => setOpenSection(null)}
              user={users[0]}
            />
          </div>
        ))}
    </div>
  );
}
