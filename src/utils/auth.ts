import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { IUser } from "@/models/Users.type";
import User from "@/models/Users.model";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

// ============================================
// TIPOS - Extender NextAuth
// ============================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName: string;
      userEmail: string;
      userActive: boolean;
      paymentStatus: boolean;
      userLevel: number;
    };
  }

  interface User {
    id: string;
    userName: string;
    userEmail: string;
    userActive: boolean;
    paymentStatus: boolean;
    userLevel: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName: string;
    userEmail: string;
    userActive: boolean;
    paymentStatus: boolean;
    userLevel: number;
  }
}

// ============================================
// AUTH OPTIONS
// ============================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorize iniciado:", credentials?.email);

          await connectDB();
          /* console.log("✅ Conectado a DB"); */

          if (!credentials?.email || !credentials?.password) {
            /* console.log("❌ Credenciales faltantes"); */
            return null;
          }

          // Buscar usuario
          const user = await (User as mongoose.Model<IUser>).findOne({
            userEmail: credentials.email,
          });

          if (!user) {
            /* console.log("❌ Usuario no encontrado"); */
            return null;
          }

          /* console.log("✅ Usuario encontrado:", user.userEmail); */
          // Validar contraseña
          const isValid = await bcrypt.compare(
            credentials.password,
            user.userPassword,
          );

          if (!isValid) {
            /* console.log("❌ Contraseña incorrecta"); */
            return null;
          }

          /* console.log("✅ Login exitoso"); */

          // Retornar datos del usuario
          return {
            id: user._id.toString(),
            userName: user.userName,
            userEmail: user.userEmail,
            userActive: user.userActive,
            paymentStatus: user.paymentStatus,
            userLevel: user.userLevel,
            subscription: user.subscription,
          };
        } catch (error) {
          console.error("❌ Error en authorize:", error);
          return null;
        }
      },
    }),
  ],

  // Configuración de sesión
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // Configuración JWT - Seguridad mejorada
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días (debe coincidir con session.maxAge)
  },

  // Cookies seguras - Mejora seguridad y previene ataques
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true, // No accesible desde JavaScript (protege contra XSS)
        sameSite: "lax", // Protege contra CSRF
        path: "/",
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      },
    },
  },

  // Páginas personalizadas
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Secret - ⚠️ IMPORTANTE: Generar uno nuevo con: openssl rand -base64 64
  secret: process.env.NEXTAUTH_SECRET,

  // Debug (desactivar en producción)
  debug: process.env.NODE_ENV === "development",

  // Callbacks
  callbacks: {
    /**
     * JWT Callback - Se ejecuta cuando se crea/actualiza el token
     */
    async jwt({ token, user }) {
      // Solo en el primer login, user está disponible
      if (user) {
        token.id = user.id;
        token.userName = user.userName;
        token.userEmail = user.userEmail;
        token.userActive = user.userActive;
        token.paymentStatus = user.paymentStatus;
        token.userLevel = user.userLevel;
        token.subscription = user.subscription;

        /* console.log("✅ JWT creado con campos:", {
          id: token.id,
          email: token.email,
          userActive: token.userActive,
          paymentStatus: token.paymentStatus,
          userLevel: token.userLevel,
        }); */
      }

      return token;
    },

    /**
     * Session Callback - Se ejecuta cada vez que se accede a la sesión
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userName = token.userName as string;
        session.user.userEmail = token.userEmail as string;
        session.user.userActive = token.userActive as boolean;
        session.user.paymentStatus = token.paymentStatus as boolean;
        session.user.userLevel = token.userLevel as number;
        session.user.subscription = token.subscription as any;

        /* console.log("✅ Sesión creada:", {
          id: session.user.id,
          email: session.user.email,
          userActive: session.user.userActive,
          paymentStatus: session.user.paymentStatus,
          userLevel: session.user.userLevel,
        }); */
      }

      return session;
    },

    /**
     * Redirect Callback - Controla las redirecciones después del login
     */
    async redirect({ url, baseUrl }) {
      // Si es URL relativa, agregar baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Si es la misma origin, permitir
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Por defecto, ir a /clients
      return `${baseUrl}/clients`;
    },
  },
};

// ============================================
// HANDLER
// ============================================

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
