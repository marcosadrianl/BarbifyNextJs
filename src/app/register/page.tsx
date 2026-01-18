"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPagePremium() {
  const router = useRouter();

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
        userActive: true,
        userLevel: 0,
        paymentStatus: false,
        userRole: "",
        userSex: "O",
        userBirthDate: "",
        userHasThisBarbers: [],
      });
      router.push("/login");
    } catch (err) {
      setError("No se pudo crear la cuenta. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#fff7ec] to-[#f3eadb] px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-4xl shadow-2xl p-10 relative overflow-hidden text-black">
          {/* Decorative accent */}
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#2f3e2f]/10 rounded-full" />

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#2f3e2f] flex items-center justify-center text-[#fff7ec] mb-4">
              <UserPlus size={28} />
            </div>
            <h1 className="text-2xl font-semibold">Crear cuenta en Barbify</h1>
            <p className="text-sm text-black/60 mt-1 text-center">
              Empezá a gestionar tu peluquería de forma profesional
            </p>
          </div>

          <form onSubmit={signUpSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30"
              />
            </div>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#2f3e2f]/30"
            />

            {error && (
              <div className="rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-[#2f3e2f] text-[#fff7ec] font-semibold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <div className="text-center text-sm text-black/60 mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-medium underline">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
