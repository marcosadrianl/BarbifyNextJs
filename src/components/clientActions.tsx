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
    <div className="flex justify-between bg-white p-4 rounded-2xl">
      {/* Acciones principales */}
      <div className="flex  gap-3">
        <NewServiceModal />

        <EditClientButton clientId={client._id} />

        <Button className="flex flex-row w-36 rounded-full bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer text-[#43553b] gap-1">
          <History className="h-6 w-6" />
          <Link href={`/clients/${client._id}/history`}>Ver historial</Link>
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
