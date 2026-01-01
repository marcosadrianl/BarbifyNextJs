// middleware.ts (en la raíz del proyecto)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.log("🔐 Middleware:", {
      path,
      hasToken: !!token,
      email: token?.email,
    });

    // Si intenta acceder a /login con sesión activa, redirigir a dashboard
    if (path === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Permitir acceso si hay token
    return NextResponse.next();
  },
  {
    callbacks: {
      // Esta función decide si el middleware se ejecuta
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Siempre permitir acceso a páginas públicas
        if (
          path === "/login" ||
          path === "/register" ||
          path === "/" ||
          path.startsWith("/api/auth")
        ) {
          return true;
        }

        // Para rutas protegidas, verificar token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// ✅ IMPORTANTE: Configuración correcta del matcher
export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - api (excepto /api/auth)
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public files
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
