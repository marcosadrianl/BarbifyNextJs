import React, { useEffect } from "react";
import Bullet from "@/components/bullet";
import { IClient } from "@/models/Clients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  Palette,
  Scissors,
  FileText,
  Info,
} from "lucide-react";

export default function MoreInfoModal({ client }: { client: IClient }) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-md text-muted-foreground hover:text-foreground transition-colors">
          Más información sobre el cliente{" "}
          <span className="hover:underline font-semibold text-primary">
            ...más
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white w-[60vw] text-[#43553b] no-scrollbar rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between ">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="w-6 h-6" />
              {client.clientName} {client.clientLastName}
            </DialogTitle>
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
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Notas</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {client.clientNotes || "Sin notas registradas"}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Información Personal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Información Personal</h3>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Fecha de Nacimiento</p>
                  <p className="text-sm text-muted-foreground">
                    {client.clientBirthdate
                      ? validateDate(client.clientBirthdate.toLocaleString())
                      : "Sin detalle"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sexo</p>
                  <p className="text-sm text-muted-foreground">
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
              <Scissors className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Información del Cabello</h3>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pelo Blanco</p>
                  <p className="text-sm text-muted-foreground">
                    {client.clientWhiteHairs || 0}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Tono Base</p>
                  <p className="text-sm text-muted-foreground">
                    {client.clientBaseColor || "Sin detalle"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Scissors className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Tipo de Pelo</p>
                  <p className="text-sm text-muted-foreground">
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
