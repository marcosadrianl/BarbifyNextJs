import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userLevel: 0 | 1;
      paymentStatus: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    userLevel: 0 | 1;
    paymentStatus: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userLevel: 0 | 1;
    paymentStatus: boolean;
  }
}
