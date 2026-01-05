/* import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDB } from "@/utils/mongoose";

import bcrypt from "bcryptjs";
import User, { IUser } from "@/models/Users";

const UserModel = User as Model<IUser>;

// 1. Ampliar los tipos para que TypeScript reconozca los nuevos campos
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName?: string | null;
      userEmail?: string | null;
      userActive: boolean; // Cambio de 'active' a 'userActive'
      paymentStatus: boolean; // Nuevo campo
      userLevel: string; // Nuevo campo
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    userActive: boolean;
    paymentStatus: boolean;
    userLevel: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userActive: boolean;
    paymentStatus: boolean;
    userLevel: number;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (!credentials?.email || !credentials?.password) return null;

          const user = await UserModel.findOne({
            userEmail: credentials.email,
          });
          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.userPassword
          );
          if (!isValid) return null;

          // 2. Retornar los datos desde la base de datos
          return {
            id: user._id.toString(),
            email: user.userEmail,
            name: user.userName,
            userActive: user.userActive,
            paymentStatus: user.paymentStatus, // Ajusta según tu modelo
            userLevel: user.userLevel, // Ajusta según tu modelo
          };
        } catch (error) {
          console.error("Error al autorizar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 3. Pasar los datos del 'user' (retornado en authorize) al 'token'
      if (user) {
        token.id = user.id;
        token.userActive = user.userActive;
        token.paymentStatus = user.paymentStatus;
        token.userLevel = user.userLevel;
      }
      return token;
    },

    async session({ session, token }) {
      // 4. Pasar los datos del 'token' a la 'session'
      if (token) {
        session.user.id = token.id;
        session.user.userActive = token.userActive;
        session.user.paymentStatus = token.paymentStatus;
        session.user.userLevel = token.userLevel;

        // 5. Eliminar explícitamente el campo image si no lo deseas
        // @ts-ignore
        delete session.user.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User, { IUser } from "@/models/Users";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

// ============================================
// TIPOS - Extender NextAuth
// ============================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
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
          console.log("✅ Conectado a DB");

          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Credenciales faltantes");
            return null;
          }

          // Buscar usuario
          const user = await (User as mongoose.Model<IUser>).findOne({
            userEmail: credentials.email,
          });

          if (!user) {
            console.log("❌ Usuario no encontrado");
            return null;
          }

          console.log("✅ Usuario encontrado:", user.userEmail);

          // Validar contraseña
          const isValid = await bcrypt.compare(
            credentials.password,
            user.userPassword
          );

          if (!isValid) {
            console.log("❌ Contraseña incorrecta");
            return null;
          }

          console.log("✅ Login exitoso");

          // Retornar datos del usuario
          return {
            id: user._id.toString(),
            name: user.userName,
            email: user.userEmail,
            userActive: user.userActive,
            paymentStatus: user.paymentStatus ?? false,
            userLevel: user.userLevel,
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

  // Páginas personalizadas
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Secret
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
        token.name = user.name;
        token.email = user.email;
        token.userActive = user.userActive;
        token.paymentStatus = user.paymentStatus;
        token.userLevel = user.userLevel;

        console.log("✅ JWT creado con campos:", {
          id: token.id,
          email: token.email,
          userActive: token.userActive,
          paymentStatus: token.paymentStatus,
          userLevel: token.userLevel,
        });
      }

      return token;
    },

    /**
     * Session Callback - Se ejecuta cada vez que se accede a la sesión
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.userActive = token.userActive as boolean;
        session.user.paymentStatus = token.paymentStatus as boolean;
        session.user.userLevel = token.userLevel as number;

        console.log("✅ Sesión creada:", {
          id: session.user.id,
          email: session.user.email,
          userActive: session.user.userActive,
          paymentStatus: session.user.paymentStatus,
          userLevel: session.user.userLevel,
        });
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
