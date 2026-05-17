"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPageClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/clients";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: callbackUrl,
    });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-20 border-2 p-4 rounded-2xl bg-white/70 text-black h-96 justify-center"
    >
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
        className="px-2 focus:outline-none focus:bg-[#E1F7F7] focus:text-slate-900"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="px-2 focus:outline-none focus:bg-[#E1F7F7] focus:text-slate-900"
      />
      <button
        type="submit"
        className="cursor-pointer p-4 bg-slate-900 hover:bg-slate-700 text-white"
      >
        Ingresar
      </button>
    </form>
  );
}
