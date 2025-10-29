// src/app/api/auth/route.ts
import { auth } from "@/utils/auth";

export const { GET, POST } = auth.handlers;
