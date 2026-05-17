"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { History, Trash2 } from "lucide-react";
import { useFeatureAccess } from "@/hooks/usePermissions";
import NewServiceModal from "@/components/newServiceModal";
import DeleteClient from "@/components/deleteClient";
import EditClientButton from "@/components/editClientButton";
import useTheme from "@/hooks/useTheme";
import { IClient } from "@/models/Clients.types";

export default function ClientActions({ client }: { client: IClient }) {
  const clientHistory = useFeatureAccess("clientHistory");
  const { theme } = useTheme();

  return (
    <div
      className="flex justify-between p-4 rounded-2xl"
      style={{
        backgroundColor: theme.bgCard,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
    >
      {/* Acciones principales */}
      <div className="flex gap-3">
        <NewServiceModal />

        <EditClientButton clientId={client._id} />

        <Button
          disabled={!clientHistory}
          className="flex flex-row w-36 rounded-full cursor-pointer gap-1"
          style={{
            backgroundColor: theme.accentBg,
            color: theme.textPrimary,
            borderColor: theme.border,
          }}
        >
          <History className="h-6 w-6" style={{ color: theme.primary }} />
          <Link
            href={`/clients/${client._id}/history`}
            style={{ color: theme.textPrimary }}
          >
            Ver historial
          </Link>
        </Button>
      </div>
      <div className="flex flex-row gap-3">
        <Separator orientation="vertical" className="h-6" />

        {/* Acción destructiva */}
        <DeleteClient
          id={client._id as string}
          title="Eliminar cliente"
          trigger={
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
