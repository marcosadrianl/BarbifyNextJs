"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IClient } from "@/models/Clients.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Plus } from "lucide-react";

export default function ClientListView({ clients }: { clients: IClient[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-xl border-b bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">
                <Button
                  onClick={() => router.push("/clients/new")}
                  className="hover:cursor-pointer ml-auto m-1 bg-[#55533b] hover:bg-[#837d3d] text-white"
                >
                  <Plus className=" h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <DropdownMenu
                  key={client._id!.toString() + Math.random().toString()}
                >
                  <DropdownMenuTrigger asChild>
                    <TableRow
                      key={client._id!.toString() + Math.random().toString()}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              client.clientImage == "/default-client.png"
                                ? undefined
                                : client.clientImage
                            }
                          />
                          <AvatarFallback>
                            {client.clientName?.[0]}
                            {client.clientLastName?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        <span className="font-medium">
                          {client.clientName} {client.clientLastName}
                        </span>
                      </TableCell>

                      <TableCell>{client.clientEmail}</TableCell>
                      <TableCell>{client.clientPhone}</TableCell>

                      <TableCell className="">
                        <MoreHorizontal className="h-4 w-4 opacity-50 ml-auto mr-4" />
                      </TableCell>
                    </TableRow>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild className="hover:bg-slate-200">
                      <Link href={`/clients/${client._id}`}>Ver cliente</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-slate-200">
                      <Link href={`/clients/${client._id}/edit`}>Editar</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
