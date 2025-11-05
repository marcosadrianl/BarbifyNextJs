// lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "@/utils/mongoose";

export const auth = betterAuth({
  // Configuración de la base de datos
  database: mongodbAdapter(async () => {
    await connectDB();
    const mongoose = await import("mongoose");
    return mongoose.connection.getClient();
  }),

  // Configuración de email y password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Cambia a true si quieres verificación
  },

  // Configuración de sesiones
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualiza cada 24 horas
  },

  // Configuración de usuarios
  user: {
    additionalFields: {
      // Campos personalizados para tus usuarios
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  // Configuración de URLs
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,

  // Opcional: Configurar OAuth providers
  socialProviders: {
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
});
