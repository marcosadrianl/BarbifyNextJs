import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
