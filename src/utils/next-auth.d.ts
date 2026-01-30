import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { IUser } from "@/models/Users.type";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName: string;
      userEmail: string;
      userActive: boolean;
      userLevel: 0 | 1;
      paymentStatus: boolean;
      subscription?: IUser["subscription"];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    userName: string;
    userEmail: string;
    userActive: boolean;
    userLevel: 0 | 1;
    paymentStatus: boolean;
    subscription?: IUser["subscription"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName: string;
    userEmail: string;
    userActive: boolean;
    userLevel: 0 | 1;
    paymentStatus: boolean;
    subscription?: IUser["subscription"];
  }
}
