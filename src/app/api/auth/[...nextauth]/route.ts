import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/Users";
import { connectDB } from "@/utils/mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ userEmail: credentials?.email });
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

  // 👇 NECESARIO PARA GUARDAR id EN TOKEN Y SESSION
  callbacks: {
    async jwt({ token, user }) {
      // user solo está presente en login
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // ahora existe
      }
      return session;
    },
  },
};

// Crear handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
