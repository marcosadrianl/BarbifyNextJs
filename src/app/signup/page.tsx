"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 en app router se usa next/navigation
import axios from "axios";

export default function SignUpPage() {
  const router = useRouter(); // 👈 hook en el cuerpo del componente

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastname] = useState("");

  const signUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", {
        userEmail: email,
        userPassword: password,
        userName: name,
        userLastName: lastname,
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={signUpSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellido"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Registrarse</button>
    </form>
  );
}
