"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateZod } from "@/models/userUpdate.schema";
import { z } from "zod";
import { useState } from "react";
import { UserPen } from "lucide-react";

type FormData = z.infer<typeof UserUpdateZod>;

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    userName?: string;
    userLastName?: string;
    userPhone?: string;
    userEmail?: string;
    userSex?: "M" | "F" | "O";
    userBirthDate?: string;
    userCity?: string;
    userState?: string;
    userAddress?: string;
    userPostalCode?: string;
  };
};

export default function EditUserCard({ open, onClose, user }: Props) {
  const [loading, setLoading] = useState(false);

  const cleanObject = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) return obj;

    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      // Ignorar valores vacíos o undefined
      if (value === "" || value === undefined || value === null) continue;

      // Si es un objeto, limpiar recursivamente
      if (typeof value === "object" && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value);
        // Solo incluir si el objeto tiene propiedades
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }

    return cleaned;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(UserUpdateZod) as any,
    defaultValues: {
      userName: user.userName ?? "",
      userLastName: user.userLastName ?? "",
      userPhone: user.userPhone ?? "",
      userEmail: user.userEmail ?? "",
      userSex: user.userSex,
      userBirthDate: user.userBirthDate ?? "",

      userCity: user.userCity ?? "",
      userState: user.userState ?? "",
      userAddress: user.userAddress ?? "",
      userPostalCode: user.userPostalCode ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      console.log("Data before clean:", data);

      // Limpiar campos vacíos
      const payload = cleanObject(data);

      console.log("Payload after clean:", payload);

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        throw new Error("Error updating user");
      }

      onClose();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-[#43553b] flex flex-row gap-4 items-center">
            <UserPen />
            Editar información personal
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-[#43553b]"
        >
          <div className="flex flex-row gap-4">
            <Input placeholder="Nombre" {...form.register("userName")} />
            <Input placeholder="Apellido" {...form.register("userLastName")} />
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-1/2">
              <p>Teléfono</p>
              <Input placeholder="Teléfono" {...form.register("userPhone")} />
            </div>
            <div className="w-1/2">
              <p>Email</p>
              <Input placeholder="Email" {...form.register("userEmail")} />
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-1/2">
              <p>Género</p>
              <Select
                defaultValue={user.userSex}
                onValueChange={(value) =>
                  form.setValue("userSex", value as "M" | "F" | "O")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Hombre</SelectItem>
                  <SelectItem value="F">Mujer</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/2">
              <p>Fecha de Nacimiento</p>
              <Input type="date" {...form.register("userBirthDate")} />
            </div>
          </div>

          <div className="flex flex-col">
            <p>Ubicación</p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                <Input placeholder="Estado" {...form.register("userState")} />
                <Input placeholder="Ciudad" {...form.register("userCity")} />
              </div>
              <div className="flex gap-1">
                <Input
                  placeholder="Dirección"
                  {...form.register("userAddress")}
                />
                <Input
                  placeholder="Código Postal"
                  {...form.register("userPostalCode")}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
