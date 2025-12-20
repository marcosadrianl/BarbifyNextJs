import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDB } from "@/utils/mongoose";
import { type Model } from "mongoose";
import bcrypt from "bcryptjs";
import User, { IUser } from "@/models/Users";
import { IBarbers } from "@/models/Barbers";

// Type assertion para el modelo
const UserModel = User as Model<IUser>;

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
    email?: string | null;
    name?: string | null;
    active?: boolean;
    barbers?: IBarbers[];
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
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Buscar usuario
        const user = await UserModel.findOne({ userEmail: credentials.email });
        if (!user) return null;

        // Validar password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.userPassword
        );
        if (!isValid) return null;

        // Devolver datos públicos
        return {
          id: user._id.toString(),
          email: user.userEmail,
          name: user.userName,
          active: user.userActive,
          barbers: user.userHasThisBarbers,
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
        session.user.active = token.active as boolean;
      }
      return session;
    },
  },
};
