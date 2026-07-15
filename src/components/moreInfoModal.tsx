import React, { useEffect } from "react";
import { IClient } from "@/models/Clients.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import useTheme from "@/hooks/useTheme";
import {
  User,
  Calendar,
  Palette,
  Scissors,
  FileText,
  Info,
} from "lucide-react";

export default function MoreInfoModal({ client }: { client: IClient }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function defineClientSex() {
    if (client.clientSex === "M") {
      return "Masculino";
    } else if (client.clientSex === "F") {
      return "Femenino";
    } else {
      return "Otro";
    }
  }

  function validateDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatHexId(hexId: string) {
    // Divide en bloques de 4 caracteres
    return hexId
      .match(/.{1,4}/g)
      .join("-")
      .toLocaleUpperCase();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="text-md transition-colors"
          style={{ color: theme.textSecondary }}
        >
          Más información sobre el cliente{" "}
          <span
            className="hover:underline font-semibold"
            style={{ color: theme.primary }}
          >
            ...más
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto w-[60vw] no-scrollbar rounded-2xl"
        style={{
          backgroundColor: theme.bgCard,
          color: theme.textPrimary,
          borderColor: theme.border,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between ">
            <div>
              <DialogTitle
                className="text-2xl flex items-center gap-2"
                style={{ color: theme.textPrimary }}
              >
                <User className="w-6 h-6" style={{ color: theme.primary }} />
                {client.clientName} {client.clientLastName}
              </DialogTitle>
              <span title="ID del cliente" className="flex items-center gap-2">
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {formatHexId(client._id)}
                </p>
              </span>
            </div>
            <div
              className="flex items-center gap-2"
              title={
                client.clientActive ? "Cliente activo" : "Cliente inactivo"
              }
            >
              <Badge variant={client.clientActive ? "default" : "secondary"}>
                {client.clientActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Notas Section */}
          <Card>
            <CardContent className="">
              <div className="flex items-center gap-2 mb-3">
                <FileText
                  className="w-5 h-5"
                  style={{ color: theme.primary }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: theme.textPrimary }}
                >
                  Notas
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.textSecondary }}
              >
                {client.clientNotes || "Sin notas registradas"}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Información Personal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5" style={{ color: theme.primary }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: theme.textPrimary }}
              >
                Información Personal
              </h3>
            </div>

            <div className="grid gap-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Calendar
                  className="w-4 h-4"
                  style={{ color: theme.primary }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Fecha de Nacimiento
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {client.clientBirthdate
                      ? validateDate(
                          client.clientBirthdate.toLocaleString("es-AR"),
                        )
                      : "Sin detalle"}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <User className="w-4 h-4" style={{ color: theme.primary }} />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Sexo
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {defineClientSex()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información del Cabello */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5" style={{ color: theme.primary }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: theme.textPrimary }}
              >
                Información del Cabello
              </h3>
            </div>

            <div className="grid gap-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Pelo Blanco
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {client.clientWhiteHairs || 0}%
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Palette className="w-4 h-4" style={{ color: theme.primary }} />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Tono Base
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {client.clientBaseColor || "Sin detalle"}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Scissors
                  className="w-4 h-4"
                  style={{ color: theme.primary }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Tipo de Pelo
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {client.clientHairType || "Sin detalle"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
