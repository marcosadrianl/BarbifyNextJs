"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserSchemaZod } from "@/models/Users";

/**
 * Formulario de registro que valida con Zod (UserSchemaZod) antes de enviar.
 * No uso react-hook-form para mantenerlo simple; si quieres lo convierto.
 */

type FormState = {
  userEmail: string;
  userPassword: string;
  userName?: string;
  userLastName?: string;
  userPhone?: string;
  userRole?: string;
  userLevel?: 0 | 1;
  userCity?: string;
  userAddress?: string;
  userPostalCode?: string;
  userBirthdate?: string; // ISO date string
  userSex?: string;
};

export default function UserRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    userEmail: "",
    userPassword: "",
    userName: "",
    userLastName: "",
    userPhone: "",
    userRole: "user",
    userLevel: 0,
    userCity: "",
    userAddress: "",
    userPostalCode: "",
    userBirthdate: "",
    userSex: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "userLevel" ? (value === "1" ? 1 : 0) : value,
    }));
  };

  const showToast = (message: string, title?: string) => {
    alert((title ? title + "\n" : "") + message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Construyo el payload tal como lo envía el cliente
    const payload = {
      userEmail: form.userEmail,
      userPassword: form.userPassword,
      userName: form.userName,
      userLastName: form.userLastName,
      userPhone: form.userPhone,
      userRole: form.userRole,
      userLevel: form.userLevel,
      userCity: form.userCity,
      userAddress: form.userAddress,
      userPostalCode: form.userPostalCode,
      userBirthdate: form.userBirthdate,
      userSex: form.userSex,
    };

    // Validación con Zod usando el schema exportado desde el modelo
    const validation = UserSchemaZod.safeParse(payload);

    if (!validation.success) {
      // Formateo errores
      const errorMessages = validation.error.issues
        .map((err) => {
          const path = err.path.length ? err.path.join(".") : "campo";
          return `${path}: ${err.message}`;
        })
        .join("\n");
      showToast(errorMessages, "Errores de validación");
      setIsSubmitting(false);
      return;
    }

    try {
      // Si Zod transformó algunos campos, uso validation.data (ya tipado)
      const res = await axios.post("/api/users/create", validation.data);

      if (res.status === 201) {
        showToast("Usuario creado correctamente", "Éxito");
        router.push("/auth/login");
      } else {
        showToast(
          res.data?.error || "Respuesta inesperada del servidor",
          "Error"
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Error al crear el usuario";
      showToast(message, "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 w-full max-w-md">
      <div className="grid gap-1">
        <Label htmlFor="userName">Nombre</Label>
        <Input
          id="userName"
          name="userName"
          value={form.userName}
          onChange={onChange}
          placeholder="Tu nombre"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userLastName">Apellido</Label>
        <Input
          id="userLastName"
          name="userLastName"
          value={form.userLastName}
          onChange={onChange}
          placeholder="Tu apellido"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userEmail">Email</Label>
        <Input
          id="userEmail"
          name="userEmail"
          type="email"
          value={form.userEmail}
          onChange={onChange}
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userPassword">Contraseña</Label>
        <Input
          id="userPassword"
          name="userPassword"
          type="password"
          value={form.userPassword}
          onChange={onChange}
          placeholder="Contraseña"
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userPhone">Teléfono</Label>
        <Input
          id="userPhone"
          name="userPhone"
          value={form.userPhone}
          onChange={onChange}
          placeholder="011-1234-5678"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userLevel">Nivel</Label>
        <select
          id="userLevel"
          name="userLevel"
          value={String(form.userLevel)}
          onChange={onChange}
          className="border rounded px-2 py-1"
        >
          <option value="0">Usuario</option>
          <option value="1">Administrador</option>
        </select>
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userCity">Ciudad</Label>
        <Input
          id="userCity"
          name="userCity"
          value={form.userCity}
          onChange={onChange}
          placeholder="Buenos Aires"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userAddress">Dirección</Label>
        <Input
          id="userAddress"
          name="userAddress"
          value={form.userAddress}
          onChange={onChange}
          placeholder="Calle 123"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userPostalCode">Código postal</Label>
        <Input
          id="userPostalCode"
          name="userPostalCode"
          value={form.userPostalCode}
          onChange={onChange}
          placeholder="1900"
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userBirthdate">Fecha de nacimiento</Label>
        <Input
          id="userBirthdate"
          name="userBirthdate"
          type="date"
          value={form.userBirthdate ?? ""}
          onChange={onChange}
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="userSex">Sexo</Label>
        <Input
          id="userSex"
          name="userSex"
          value={form.userSex}
          onChange={onChange}
          placeholder="M / F / Otro"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
