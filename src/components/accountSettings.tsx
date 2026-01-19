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

export default function AccountSettings({
  endpoint = "/api/users",
}: UsersListProps) {
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
          err?.response?.data?.error ||
            err?.message ||
            "Error al obtener datos",
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
        return new Date(val).toLocaleString("es-AR");
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
            className="cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("account")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Información de la cuenta</h2>
                <p className="text-xs foreground">
                  Ve información de la cuenta como email, teléfono, estado y
                  fecha de creación.
                </p>
              </span>
              <ChevronRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="">
            <div
              className="flex flex-row gap-4 mb-4 cursor-pointer hover:bg-gray-100 py-4"
              onClick={() => setOpenSection(null)}
            >
              <ChevronLeft />
              <h2>Información de la cuenta</h2>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Email de la cuenta</h2>
              <p className="foreground text-sm">{users[0].userEmail ?? "-"}</p>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Teléfono</h2>
              <p className="foreground text-sm">
                {users[0].userPhone ?? "Sin teléfono registrado"}
              </p>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Cuenta Activa</h2>
              <span className="flex flex-col">
                <p
                  className="foreground text-sm flex items-center w-fit"
                  title={`${
                    users[0].userActive
                      ? "Estas al dia con tu suscripción"
                      : "Tu cuenta está inactiva, revisa el estado de tu suscripción desde MercadoPago."
                  }`}
                >
                  {users[0].userActive ? "Sí" : "No"}{" "}
                  <Info className="inline-block w-4 h-4 ml-1" />
                </p>{" "}
                <Link
                  href="https://www.mercadopago.com.ar/subscriptions"
                  target="_blank"
                  className="flex items-center text-blue-500 hover:underline text-sm w-fit"
                >
                  Gestionar suscripción
                  <ArrowUpRight className="inline-block w-4 h-4 ml-1" />
                </Link>
              </span>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Creación de la cuenta</h2>
              <p className="foreground text-sm">
                {formatValue(users[0].createdAt) ?? "Error al mostrar fecha"}
              </p>
            </div>
          </div>
        ))}

      {openSection !== "account" &&
        openSection !== "edit" &&
        (openSection !== "user" ? (
          <div
            className="cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("user")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Información de Usuario</h2>
                <p className="text-xs foreground">
                  Ve información personal asociada a tu usuario.
                </p>
              </span>
              <ChevronRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="">
            <div
              className="flex flex-row gap-4 mb-4 py-4 cursor-pointer hover:bg-gray-100"
              onClick={() => setOpenSection(null)}
            >
              <ChevronLeft className="" onClick={() => setOpenSection(null)} />
              <h2>Información de Usuario</h2>
            </div>

            <div className="mb-2 px-4">
              <h2>Nombre de usuario</h2>
              <p className="foreground text-sm capitalize">
                {users[0].userName ?? "Sin nombre"}{" "}
                {users[0].userLastName ?? "Sin apellido"}
              </p>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Ubicación</h2>
              <p className="foreground text-sm capitalize">
                {users[0].userState ?? "-"}, {users[0].userCity},{" "}
                {users[0].userAddress}, {users[0].userPostalCode}
              </p>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Género</h2>
              <p className="foreground text-sm">
                {users[0].userSex === "M"
                  ? "Hombre"
                  : users[0].userSex === "F"
                    ? "Mujer"
                    : "Sin especificar"}
              </p>
            </div>

            <div className="mb-2 px-4">
              {" "}
              <h2>Nacimiento</h2>
              <p className="foreground text-sm">
                {users[0].userBirthDate
                  ? (users[0].userBirthDate
                      .toString()
                      .slice(0, 10)
                      .replaceAll("-", "/")
                      .split("/")
                      .reverse()
                      .join("/") ?? "Error al mostrar fecha")
                  : "Sin fecha de nacimiento registrada"}
              </p>
            </div>
          </div>
        ))}

      {openSection !== "account" &&
        openSection !== "user" &&
        (openSection !== "edit" ? (
          <div
            className="cursor-pointer hover:bg-gray-100 p-4"
            onClick={() => setOpenSection("edit")}
          >
            <span className="flex flex-row w-full justify-between items-center">
              <span>
                <h2>Editar Información de la Cuenta</h2>
                <p className="text-xs foreground">
                  Edita la información general de tu cuenta.
                </p>
              </span>
              <SquareArrowUpRight className="w-6 h-6" />
            </span>
          </div>
        ) : (
          <div className="p-4">
            <EditUserCard
              open={true}
              onClose={() => setOpenSection(null)}
              user={users[0]}
            />
          </div>
        ))}

      {openSection === null && (
        <div className="p-4 border-t border-[#cebaa1] mt-4">
          <p className="text-xs">
            Barbify protege tu información personal y no la comparte con nadie.
            Puedes conocer más sobre nuestra{" "}
            <Link
              href="#"
              className="hover:underline text-blue-500 transition-all delay-200"
            >
              Política de Privacidad
            </Link>{" "}
            en nuestra página web.
          </p>
        </div>
      )}
    </div>
  );
}
