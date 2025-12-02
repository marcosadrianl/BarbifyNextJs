// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirige si no está autenticado
  },
});

export const config = {
  matcher: [
    "/clients/:path*",
    "/diary/:path*",
    "/insights/:path*",
    "/dashboard/:path*",
    "/account/:path*",
  ], // 👈 protege todo lo que esté bajo /barbify
};
