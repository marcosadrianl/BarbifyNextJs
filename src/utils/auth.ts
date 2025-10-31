/* // src/lib/auth.ts
import { connectDB } from "@/utils/mongoose";
// src/lib/auth.ts
import { createAuth } from "better-auth";
import { mongooseAdapter } from "@better-auth/mongoose-adapter";
import {} from "@/models/Users";

await connectDB(); // conecta antes de inicializar

export const auth = createAuth({
  adapter: mongooseAdapter(UserModel),
  secret: process.env.AUTH_SECRET!,
  session: {
    jwt: true,
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },
  emailAndPassword: {
    enabled: true,
  },
});
 */
