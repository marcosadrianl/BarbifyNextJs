import { Suspense } from "react";
import ClientsPageContent from "@/components/ClientsPageContent";
import ClientsTableSkeleton from "@/skeletons/clientViewSkeleton";

export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsTableSkeleton />}>
      <ClientsPageContent />
    </Suspense>
  );
}
