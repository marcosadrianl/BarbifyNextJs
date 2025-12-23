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
        await connectDB();

        const user = await (User as mongoose.Model<IUser>).findOne({
          userEmail: credentials?.email,
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.userPassword
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.userName,
          email: user.userEmail,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * Modifica el token JWT para incluir el id del usuario.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as AuthUser).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        // extendemos el tipo de session.user para incluir id
        (session.user as AuthUser).id = token.id as string;
      }
      return session;
    },
  },
};

// Handler para App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
