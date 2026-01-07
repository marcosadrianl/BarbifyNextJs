"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, History, Trash2 } from "lucide-react";

import NewServiceModal from "@/components/newServiceModal";
import DeleteClient from "@/components/deleteClient";
import EditClientButton from "@/components/editClientButton";
import { IClient } from "@/models/Clients";

export default function ClientActions({ client }: { client: IClient }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Acciones principales */}
      <div className="flex flex-wrap items-center gap-2">
        <NewServiceModal client={client} />

        <EditClientButton clientId={client._id} />

        <Button asChild variant="outline">
          <Link
            href={`/clients/${client._id}/history`}
            className="flex items-center gap-2"
          >
            <History className="h-8 w-8" />
            Ver historial
          </Link>
        </Button>
      </div>

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
  );
}
