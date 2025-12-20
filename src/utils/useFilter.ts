import { Model } from "mongoose";
import type { Session } from "next-auth";

// No redeclares el módulo aquí si ya lo hiciste en auth.ts
// Solo importa el tipo Session que ya tiene la declaración completa

export function filterByUser<T>(model: Model<T>, session: Session | null) {
  if (!session?.user?.id) {
    throw new Error("Missing userId in session");
  }

  return model
    .find({
      clientFromUserId: { $eq: session.user.id }, // string match
    })
    .collation({ locale: "en", strength: 2 });
}
