import { Types, Model } from "mongoose";
import type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

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
