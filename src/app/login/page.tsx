import { getServerSession } from "next-auth";

import LoginPageClient from "@/components/LoginPageClient";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/clients");
  }

  return <LoginPageClient />;
}
