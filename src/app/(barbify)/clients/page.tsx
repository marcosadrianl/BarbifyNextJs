"use client";

import ClientListView from "@/components/clientListView";
import { useClients } from "@/utils/useClients";
import ClientsTableSkeleton from "@/skeletons/clientViewSkeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import React from "react";
/* import LoadingDots from "@/components/loadingDots"; */

function CheckAuth() {
  const { status } = useSession();
  const router = useRouter();

  // redirect ONLY inside an effect
  React.useEffect(() => {
    if (status === "unauthenticated") {
      console.log("errior al iniciar", status);

      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
      );
    }
  }, [status, router]);

  return null;
}

function ClientsPageContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  const {
    data: clients,
    totalPages,
    loading,
  } = useClients(page, limit, search);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    params.set("limit", String(limit));
    params.set("search", search);
    router.push(`/clients?${params.toString()}`);
  };

  return (
    <>
      <CheckAuth />
      <div className="relative flex flex-col">
        {loading ? (
          <ClientsTableSkeleton />
        ) : (
          <ClientListView clients={clients} />
        )}

        <div className="fixed bottom-0 left-0 right-0 mx-auto p-4 flex gap-2 justify-center">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="p-1 disabled:opacity-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#43553b"
              className="inline-block transition-transform duration-200 hover:-translate-x-1"
            >
              {" "}
              <path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" />{" "}
            </svg>
          </button>

          <span className="flex items-center text-nowrap">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className="p-1 disabled:opacity-50 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#43553b"
              className="inline-block transition-transform duration-200 hover:translate-x-1"
            >
              {" "}
              <path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" />{" "}
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsTableSkeleton />}>
      <ClientsPageContent />
    </Suspense>
  );
}
