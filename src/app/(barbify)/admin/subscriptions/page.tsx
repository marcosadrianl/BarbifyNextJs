// src/app/(barbify)/admin/subscriptions/page.tsx
import { SubscriptionsListTable } from "@/components/SubscriptionsListTable";
import { ManualSubscriptionUpdateForm } from "@/components/ManualSubscriptionUpdateForm";

export default function AdminSubscriptionsPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">📊 Gestión de Suscripciones</h1>
      <SubscriptionsListTable />
      <ManualSubscriptionUpdateForm />
    </div>
  );
}
