"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPageClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/clients",
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
        className="px-2 focus:outline-none focus:bg-amber-50 focus:text-black"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="px-2 focus:outline-none focus:bg-amber-50 focus:text-black"
      />
      <button
        type="submit"
        className="cursor-pointer p-4 bg-amber-300 hover:bg-amber-800"
      >
        Ingresar
      </button>
    </form>
  );
}
