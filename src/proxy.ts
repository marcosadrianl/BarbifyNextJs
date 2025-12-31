import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequest) {
    type ModifiedNextRequest = NextRequest & { nextauth: { token: string } };

    const token = (req as ModifiedNextRequest).nextauth?.token;

    // Si NO hay token → no está logueado
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";

      // agregar callbackUrl con la ruta original
      url.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );

      return NextResponse.redirect(url);
    }

    // Si está autenticado → pasar
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/clients/:path*",
    "/diary/:path*",
    "/insights/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
  ],
};
