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
      console.log("✅ Ya tiene sesión, redirigiendo a clients");
      return NextResponse.redirect(new URL("/clients", req.url));
    }

    // Permitir acceso
    return NextResponse.next();
  },
  {
    callbacks: {
      // Esta función decide si el middleware se ejecuta
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        console.log("🔍 Authorized callback:", { path, hasToken: !!token });

        // ✅ RUTAS PÚBLICAS (no requieren autenticación)
        const publicPaths = ["/", "/login", "/register", "/about", "/contact"];

        // ✅ PREFIJOS PÚBLICOS
        const publicPrefixes = [
          "/api/auth", // NextAuth endpoints
          "/_next", // Next.js static files
          "/favicon",
          "/public",
        ];

        // Verificar si es ruta pública
        if (publicPaths.includes(path)) {
          console.log("✅ Ruta pública permitida:", path);
          return true;
        }

        // Verificar si empieza con prefijo público
        if (publicPrefixes.some((prefix) => path.startsWith(prefix))) {
          console.log("✅ Prefijo público permitido:", path);
          return true;
        }

        // ✅ RUTAS PROTEGIDAS (requieren autenticación)
        const protectedPrefixes = [
          "/dashboard",
          "/clients",
          "/diary",
          "/insights",
          "/account",
          "/settings",
        ];

        // Si es ruta protegida, verificar token
        if (protectedPrefixes.some((prefix) => path.startsWith(prefix))) {
          if (!token) {
            console.log("❌ Ruta protegida sin token:", path);
            return false;
          }
          console.log("✅ Ruta protegida con token:", path);
          return true;
        }

        // Por defecto, permitir acceso
        console.log("✅ Ruta no especificada, permitir:", path);
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// ✅ Configuración del matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
