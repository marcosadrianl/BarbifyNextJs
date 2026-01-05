import { Suspense } from "react";
import ClientsPageContent from "@/components/ClientsPageContent";

export default function ClientsPage() {
  return (
    <Suspense fallback={<div>Cargando clientes...</div>}>
      <ClientsPageContent />
    </Suspense>
  );
}
