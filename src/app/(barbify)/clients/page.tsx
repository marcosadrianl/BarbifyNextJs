import { Suspense } from "react";
import ClientsPageContent from "@/components/ClientsPageContent";
import ClientsTableSkeleton from "@/skeletons/clientViewSkeleton";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/dist/client/components/navigation";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  console.log("🛡️ Session en clients page:", session);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!session?.user?.userActive) {
    redirect("/subscription");
  }

  return (
    <Suspense fallback={<ClientsTableSkeleton />}>
      <ClientsPageContent />
    </Suspense>
  );
}
