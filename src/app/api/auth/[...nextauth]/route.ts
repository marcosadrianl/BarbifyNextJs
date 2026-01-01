import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User, { IUser } from "@/models/Users";
import { connectDB } from "@/utils/mongoose";
import mongoose from "mongoose";

// Definimos el tipo de usuario que vamos a devolver
interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          await connectDB();

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await (User as mongoose.Model<IUser>).findOne({
            userEmail: credentials.email,
          });

          if (!user) {
            console.log("❌ Usuario no encontrado:", credentials.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.userPassword
          );

          if (!isValid) {
            console.log("❌ Contraseña incorrecta");
            return null;
          }

          console.log("✅ Login exitoso:", user.userEmail);

          return {
            id: user._id.toString(),
            name: user.userName,
            email: user.userEmail,
          };
        } catch (error) {
          console.error("❌ Error en authorize:", error);
          return null;
        }
      },
    }),
  ],

  // ✅ IMPORTANTE: Definir estrategia de sesión
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
    error: "/login", // ← Redirigir errores al login
  },

  secret: process.env.NEXTAUTH_SECRET,

  // ✅ IMPORTANTE: Debug en desarrollo
  debug: process.env.NODE_ENV === "development",

  callbacks: {
    /**
     * Modifica el token JWT para incluir el id del usuario.
     */
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = (user as AuthUser).id;
        token.name = (user as AuthUser).name;
        token.email = (user as AuthUser).email;
      }
      return token;
    },

    /**
     * Modifica la sesión para incluir el id del usuario.
     */
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as AuthUser).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    /**
     * Controla las redirecciones
     */
    async redirect({ url, baseUrl }) {
      // Si es una URL relativa, agregar baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Si es la misma origin, permitir
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Por defecto, ir al dashboard
      return `${baseUrl}/dashboard`;
    },
  },
};

// Handler para App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
