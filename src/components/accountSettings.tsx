"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  SquareArrowUpRight,
  Info,
  LucideIcon,
} from "lucide-react";
import EditUserCard from "@/components/EditUserCard";
import useTheme from "@/hooks/useTheme";

type UsersListProps = {
  endpoint?: string;
};

type SectionId =
  | "account"
  | "subscription"
  | "user"
  | "edit"
  | "themes"
  | string;

type Section = {
  id: SectionId;
  title: string;
  description: string;
  /** Ícono que se muestra en la fila cerrada (por defecto ChevronRight) */
  closedIcon?: LucideIcon;
  /** Contenido que se muestra cuando la sección está expandida */
  content: (user: any, helpers: SectionHelpers) => React.ReactNode;
};

type SectionHelpers = {
  formatValue: (val: any) => string;
  getStatusLabel: (status: string) => string;
  getPlanLabel: (plan: string) => string;
};

export default function AccountSettings({
  endpoint = "/api/users",
}: UsersListProps) {
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const { theme, themeMode } = useTheme();

  const themeStyles = {
    "--theme-bgCard": theme.bgCard,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
    "--theme-accent-bg": theme.accentBg,
  } as React.CSSProperties;

  const normalizeData = (resData: any): any[] => {
    if (Array.isArray(resData)) return resData;
    if (resData == null) return [];
    if (typeof resData === "object") {
      if (Array.isArray(resData.data)) return resData.data;
      if (Array.isArray(resData.users)) return resData.users;
      if (Array.isArray(resData.results)) return resData.results;
      return [resData];
    }
    return [resData];
  };

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(endpoint);
        const raw = res.data;
        const data = normalizeData(raw);
        console.log("Datos obtenidos del endpoint:", data);
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

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: "Activa",
      inactive: "Inactiva",
      cancelled: "Cancelada",
      paused: "Pausada",
    };
    return statusMap[status] || status;
  };

  const getPlanLabel = (plan: string) => {
    const planMap: { [key: string]: string } = {
      premium: "Premium",
      basic: "Básico",
      free: "Gratuito",
    };
    return planMap[plan] || plan;
  };

  const helpers: SectionHelpers = { formatValue, getStatusLabel, getPlanLabel };

  function ThemeSelector() {
    const { mode, setMode, manualChoice, setManualChoice } = useTheme();

    const options: { key: "system" | "light" | "dark"; label: string }[] = [
      { key: "system", label: "Usar sistema" },
      { key: "light", label: "Claro" },
      { key: "dark", label: "Oscuro" },
    ];

    const isActive = (key: "system" | "light" | "dark") =>
      key === "system"
        ? mode === "system"
        : mode === "manual" && manualChoice === key;

    const handleClick = (key: "system" | "light" | "dark") => {
      if (key === "system") {
        setMode("system");
      } else {
        setMode("manual");
        setManualChoice(key);
      }
    };

    return (
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleClick(opt.key)}
            className="rounded-md border px-3 py-1 text-xs transition-colors"
            style={{
              borderColor: "var(--theme-border)",
              backgroundColor: isActive(opt.key)
                ? "var(--theme-accent-bg)"
                : "transparent",
              color: "var(--theme-text-primary)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Acá está TODA la config de secciones. Para agregar una nueva:
  // copiá un objeto, cambiá id/title/description/content y listo.
  // No hay que tocar nada más del componente.
  // ---------------------------------------------------------------------
  const sections: Section[] = [
    {
      id: "account",
      title: "Información de la cuenta",
      description:
        "Ve información de la cuenta como email, teléfono, estado y fecha de creación.",
      content: (user) => (
        <>
          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Email de la cuenta
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.userEmail ?? "-"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Teléfono
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.userPhone ?? "Sin teléfono registrado"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold">Cuenta Activa</h2>
            <span className="flex flex-col">
              <p
                className="flex w-fit items-center text-sm text-(--theme-text-secondary)"
                title={
                  user.userActive
                    ? "Estas al dia con tu suscripción"
                    : "Tu cuenta está inactiva, revisa el estado de tu suscripción desde MercadoPago."
                }
              >
                {user.userActive ? "Sí" : "No"}{" "}
                <Info className="inline-block w-4 h-4 ml-1" />
              </p>
            </span>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Creación de la cuenta
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {formatValue(user.createdAt) ?? "Error al mostrar fecha"}
            </p>
          </div>
        </>
      ),
    },
    {
      id: "subscription",
      title: "Información de Suscripción",
      description: "Ve detalles de tu plan, estado y fechas importantes.",
      content: (user, { formatValue, getPlanLabel, getStatusLabel }) => (
        <>
          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">Plan</h2>
            <p className="text-sm capitalize text-(--theme-text-secondary)">
              {user.subscription?.plan
                ? getPlanLabel(user.subscription.plan)
                : "Sin plan"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Estado de la suscripción
            </h2>
            <span className="flex flex-col">
              <p className="text-sm text-(--theme-text-secondary)">
                {user.subscription?.status
                  ? getStatusLabel(user.subscription.status)
                  : "Sin información"}
              </p>
            </span>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Fecha de inicio
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.subscription?.startDate
                ? formatValue(user.subscription.startDate)
                : "Sin fecha"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Fin del período de prueba
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.subscription?.trialEndDate
                ? formatValue(user.subscription.trialEndDate)
                : "Sin período de prueba"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Estado de pago
            </h2>
            <p
              className="flex w-fit items-center text-sm text-(--theme-text-secondary)"
              title={
                user.paymentStatus
                  ? "estás al día con tu suscripción, ¡muy bien!"
                  : "Hay un pago pendiente, apresúrate a completar el pago para no perder acceso"
              }
            >
              {user.paymentStatus ? "Al día" : "Pendiente"}{" "}
              <Info className="inline-block w-4 h-4 ml-1" />
            </p>
          </div>
        </>
      ),
    },
    {
      id: "user",
      title: "Información de Usuario",
      description: "Ve información personal asociada a tu usuario.",
      content: (user) => (
        <>
          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Nombre de usuario
            </h2>
            <p className="text-sm capitalize text-(--theme-text-secondary)">
              {user.userName ?? "Sin nombre"}{" "}
              {user.userLastName ?? "Sin apellido"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Ubicación
            </h2>
            <p className="text-sm capitalize text-(--theme-text-secondary)">
              {user.userState ?? "-"}, {user.userCity}, {user.userAddress},{" "}
              {user.userPostalCode}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Género
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.userSex === "M"
                ? "Hombre"
                : user.userSex === "F"
                  ? "Mujer"
                  : "Sin especificar"}
            </p>
          </div>

          <div className="mb-2 px-4">
            <h2 className="font-semibold text-(--theme-text-primary)">
              Nacimiento
            </h2>
            <p className="text-sm text-(--theme-text-secondary)">
              {user.userBirthDate
                ? (user.userBirthDate
                    .toString()
                    .slice(0, 10)
                    .replaceAll("-", "/")
                    .split("/")
                    .reverse()
                    .join("/") ?? "Error al mostrar fecha")
                : "Sin fecha de nacimiento registrada"}
            </p>
          </div>
        </>
      ),
    },
    {
      id: "theme",
      title: "Cambiar Tema",
      description: "Cambia el tema de la aplicación entre claro y oscuro.",
      content: () => (
        <div className="mb-2 px-4">
          <h2 className="font-semibold text-(--theme-text-primary)">
            Tema actual
          </h2>
          <p className="text-sm text-(--theme-text-secondary)">
            {themeMode === "dark" ? "Oscuro" : "Claro"}
          </p>

          <div className="mt-3">
            <ThemeSelector />
          </div>
        </div>
      ),
    },
    {
      id: "edit",
      title: "Editar Información de la Cuenta",
      description: "Edita la información general de tu cuenta.",
      closedIcon: SquareArrowUpRight,
      content: (user) => (
        <div className="p-4">
          <EditUserCard
            open={true}
            onClose={() => setOpenSection(null)}
            user={user}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!users || users.length === 0) {
    return <div className="p-4">No hay datos disponibles</div>;
  }

  const user = users[0];

  return (
    <div className="flex flex-col" style={themeStyles}>
      {sections.map((section) => {
        const isOpen = openSection === section.id;

        // Si hay otra sección abierta, esta ni se muestra (cerrada ni expandida)
        if (openSection !== null && !isOpen) return null;

        if (!isOpen) {
          const ClosedIcon = section.closedIcon ?? ChevronRight;
          return (
            <div
              key={section.id}
              className="cursor-pointer p-4 transition-colors hover:bg-(--theme-accent-bg)"
              onClick={() => setOpenSection(section.id)}
            >
              <span className="flex flex-row align-items w-full justify-between items-center">
                <span>
                  <h2 className="text-(--theme-text-primary)">
                    {section.title}
                  </h2>
                  <p className="text-xs text-(--theme-text-secondary)">
                    {section.description}
                  </p>
                </span>
                <ClosedIcon className="w-6 h-6" />
              </span>
            </div>
          );
        }

        // Vista expandida: el "edit" ya trae su propio padding en content,
        // el resto sigue el patrón header + bloques mb-2 px-4
        if (section.id === "edit") {
          return <div key={section.id}>{section.content(user, helpers)}</div>;
        }

        return (
          <div key={section.id}>
            <div
              className="flex items-center align-items cursor-pointer gap-4 p-4 transition-colors hover:bg-(--theme-accent-bg)"
              onClick={() => setOpenSection(null)}
            >
              <ChevronLeft className="w-6 h-6" />
              <h2 className="font-semibold text-(--theme-text-primary)">
                {section.title}
              </h2>
            </div>
            {section.content(user, helpers)}
          </div>
        );
      })}

      {/* Footer de privacidad */}
      {openSection === null && (
        <div className="mt-4 border-t border-(--theme-border) p-4">
          <p className="text-xs text-(--theme-text-secondary)">
            Barbify protege tu información personal y no la comparte con nadie.
            Puedes conocer más sobre nuestra{" "}
            <Link
              href="#"
              className="text-blue-500 transition-all delay-200 hover:underline"
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
