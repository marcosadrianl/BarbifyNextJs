import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDB } from "@/utils/mongoose"; // tu función para conectar a Mongo
import User from "@/models/Users"; // tu modelo Mongoose
import bcrypt from "bcryptjs";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      active?: boolean;
    };
  }

  interface JWT {
    id: string;
    active?: boolean;
  }

  interface User {
    id: string;
    active?: boolean;
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

      async authorize(credentials, req) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar usuario
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        // Validar password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Validar de nuevo  password
        const isValid2 = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid2) return null;

        // Devolver datos públicos
        return {
          id: user._id.toString(),
          email: user.userEmail,
          name: user.userName,
          active: user.userActive,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // user solo está presente en el login inicial
      if (user) {
        token.id = user.id;
        token.active = user.active;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.active !== undefined) {
        (session.user as any).active = token.active;
      }
      return session;
    },
  },
};
