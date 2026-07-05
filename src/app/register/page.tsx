"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useTheme from "@/hooks/useTheme";

export default function RegisterPagePremium() {
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/signup", {
        userEmail: email,
        userPassword: password,
        userName: name,
        userLastName: lastname,
        userCity: "",
        userState: "",
        userAddress: "",
        userPostalCode: "",

        userPhone: "",
        userActive: false, // Cambiado: Usuario inactivo hasta que pague
        userLevel: 0,
        paymentStatus: false,
        userRole: "",
        userSex: "O",
        userBirthDate: "",
        userHasThisBarbers: [],
      });
      router.push("/login?registered=true");
    } catch (err) {
      setError("No se pudo crear la cuenta. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen rounded-4xl flex items-center justify-end px-4">
      <div className="absolute bg-cover w-full h-full top-0 left-0">
        {/* Imagen de fondo */}
        <Image
          src="/seamless-tileable-pattern-in-doodle-d.jpg"
          alt="Doodle peluquería"
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
          loading="eager"
        />

        {/* Overlay con gradiente */}
        <div className="absolute inset-0" />
      </div>
      <div
        className=" rounded-4xl p-10 relative overflow-hidden w-full max-w-md"
        style={{
          backgroundColor: theme.theme.bgCard,
          boxShadow: theme.theme.bgCard,
          color: theme.theme.textPrimary,
        }}
      >
        {/* Decorative accent */}
        <div
          className="absolute -bottom-24 -left-24 w-48 h-48  rounded-full"
          style={{ backgroundColor: theme.theme.accentBg }}
        />

        <div className="flex flex-col items-center mb-8 ">
          <div
            className="w-14 h-14 rounded-2xl  flex items-center justify-center text-white mb-4"
            style={{ backgroundColor: theme.theme.primary }}
          >
            <UserPlus size={28} />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: theme.theme.appName }}
          >
            Crear cuenta en Barbify
          </h1>
          <p
            className="text-sm mt-1 text-center"
            style={{ color: theme.theme.textSecondary }}
          >
            Empezá a gestionar tu peluquería de forma profesional
          </p>
        </div>

        <form
          onSubmit={signUpSubmit}
          className="space-y-4 placeholder-gray-400 dark:placeholder-gray-300"
          style={{
            color: theme.theme.textPrimary,
            backgroundColor: theme.theme.bgCard,
          }}
        >
          <div
            className="grid grid-cols-2 gap-3"
            style={{ color: theme.theme.textPrimary }}
          >
            <input
              type="text"
              placeholder="Nombre"
              style={{ color: theme.theme.textPrimary }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30 placeholder-gray-400 dark:placeholder-gray-300"
            />
            <input
              type="text"
              placeholder="Apellido"
              style={{ color: theme.theme.textPrimary }}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30 placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>

          <input
            type="email"
            style={{ color: theme.theme.textPrimary }}
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30 placeholder-gray-400 dark:placeholder-gray-300"
          />

          <input
            type="password"
            placeholder="Contraseña"
            style={{ color: theme.theme.textPrimary }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30 placeholder-gray-400 dark:placeholder-gray-300"
          />

          {error && (
            <div
              className="rounded-xl text-sm px-4 py-3"
              style={{
                color: theme.theme.dangerHover,
                backgroundColor: theme.theme.bgSidebar,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-60"
            style={{
              backgroundColor: theme.theme.primary,
              color: theme.theme.bgCard,
            }}
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <div
          className="text-center text-sm  mt-6"
          style={{ color: theme.theme.textSecondary }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
