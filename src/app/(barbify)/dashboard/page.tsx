// app/dashboard/page.tsx
import { getServerSession } from "@/utils/server-auth";
import { redirect } from "next/navigation";
import UserButton from "@/components/userButton";

export default async function DashboardPage() {
  // Obtener sesión en el servidor
  const session = await getServerSession();

  // Si no hay sesión, redirigir (el middleware ya debería hacer esto)
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton />
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-4">
            ¡Bienvenido, {session.user.name}!
          </h2>
          <p className="text-gray-600 mb-4">Email: {session.user.email}</p>
          <p className="text-gray-600">ID: {session.user.id}</p>

          {/* Información adicional si definiste campos personalizados */}
          {session.user.role && (
            <p className="text-gray-600 mt-2">Rol: {session.user.role}</p>
          )}
        </div>

        {/* Ejemplo de contenido protegido */}
        <div className="mt-6 bg-[#ffd49d] rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Área Protegida</h3>
          <p>Solo los usuarios autenticados pueden ver esto.</p>
        </div>
      </main>
    </div>
  );
}
