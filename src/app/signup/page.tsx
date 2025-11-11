"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const signUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const router = useRouter();
      await axios.post("/api/auth/signup", { name, email, password });
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={signUpSubmit} className="flex flex-col">
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
