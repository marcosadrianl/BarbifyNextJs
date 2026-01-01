"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // No redirigir automáticamente
      });

      console.log("📝 Resultado de login:", result);

      if (result?.error) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Redirigir al dashboard después de login exitoso
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd49d]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd49d]"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffd49d] text-black font-semibold py-2 rounded-md hover:bg-[#ffc570] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
