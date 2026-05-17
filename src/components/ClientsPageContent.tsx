"use client";

import ClientListView from "@/components/clientListView";
import { useClients } from "@/utils/useClients";
import ClientsTableSkeleton from "@/skeletons/clientViewSkeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function ClientsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

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
    <div
      className="relative flex flex-col w-full p-4"
      style={{ backgroundColor: theme.bg }}
    >
      {loading ? (
        <ClientsTableSkeleton />
      ) : (
        <ClientListView clients={clients} />
      )}

      <div className="mx-auto mt-auto flex gap-2 justify-center">
        <button
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className="p-1 disabled:opacity-50 cursor-pointer"
          style={{ color: theme.textSecondary }}
        >
          <ChevronLeft
            size={24}
            className="inline-block"
            style={{ color: theme.textSecondary }}
          />
        </button>

        <span
          className="flex items-center text-nowrap"
          style={{ color: theme.textPrimary }}
        >
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className="p-1 disabled:opacity-50 cursor-pointer"
          style={{ color: theme.textSecondary }}
        >
          <ChevronRight
            size={24}
            className="inline-block"
            style={{ color: theme.textSecondary }}
          />
        </button>
      </div>
    </div>
  );
}
