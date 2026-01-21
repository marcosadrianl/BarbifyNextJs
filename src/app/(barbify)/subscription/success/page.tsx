import { Suspense } from "react";
import SubscriptionSuccessContent from "./SubscriptionSuccessContent";

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}

function SuccessPageSkeleton() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full mb-4" />
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  );
}
