"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IClient } from "@/models/Clients.types";
import useTheme from "@/hooks/useTheme";

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
  const { theme } = useTheme();
  const [buttonBg, setButtonBg] = useState(theme.primary);

  useEffect(() => {
    setButtonBg(theme.primary);
  }, [theme.primary]);

  return (
    <div
      className="space-y-2 border rounded-xl shadow-md py-4"
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        borderColor: theme.border,
      }}
    >
      <Button
        onClick={() => router.push("/clients/new")}
        className="flex flex-row items-center cursor-pointer mr-2 ml-auto"
        onMouseEnter={() => setButtonBg(theme.primaryHover)}
        onMouseLeave={() => setButtonBg(theme.primary)}
        style={{
          backgroundColor: buttonBg,
          color: theme.accentBg,
          borderColor: theme.border,
        }}
      >
        <Plus className="h-4 w-4" />
        Nuevo Cliente
      </Button>
      {/* Table */}
      <div
        className="shadow-md"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.border,
        }}
      >
        <Table className="" style={{ backgroundColor: theme.bgCard }}>
          <TableHeader>
            <TableRow
              style={{
                backgroundColor: theme.accentBg,
              }}
            >
              <TableHead style={{ color: theme.textPrimary }}>
                CLIENTE
              </TableHead>
              <TableHead style={{ color: theme.textPrimary }}>
                TEL&Eacute;FONO
              </TableHead>
              <TableHead
                className="text-right"
                style={{ color: theme.textPrimary }}
              >
                ÚLTIMA VISITA
              </TableHead>
              <TableHead
                className="text-right"
                style={{ color: theme.textPrimary }}
              >
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <DropdownMenu key={client._id!.toString()}>
                  <DropdownMenuTrigger asChild>
                    <TableRow
                      className=""
                      style={{ backgroundColor: theme.bgCard }}
                    >
                      <TableCell
                        className="flex items-center gap-3 "
                        style={{ color: theme.textPrimary }}
                      >
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

                        <Link
                          href={`/clients/${client._id}`}
                          className="font-medium block w-full hover:underline cursor-pointer"
                        >
                          {client.clientName} {client.clientLastName}
                        </Link>
                      </TableCell>

                      <TableCell>{client.clientPhone}</TableCell>

                      <TableCell
                        className="text-right"
                        style={{ color: theme.textSecondary }}
                      >
                        {client.updatedAt
                          ? new Date(client.updatedAt).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              },
                            )
                          : "Sin visitas"}
                      </TableCell>
                      <TableCell
                        className=""
                        style={{ color: theme.textSecondary }}
                      >
                        <MoreHorizontal
                          className="h-4 w-4 ml-auto mr-4"
                          style={{ color: theme.textSecondary }}
                        />
                      </TableCell>
                    </TableRow>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/clients/${client._id}`}
                        className="block w-full hover:underline  cursor-pointer"
                      >
                        Ver cliente
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/clients/${client._id}/edit`}
                        className="block w-full hover:underline cursor-pointer"
                      >
                        Editar
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))
            ) : (
              <TableRow style={{ backgroundColor: theme.bgCard }}>
                <TableCell
                  colSpan={4}
                  className="text-center py-6"
                  style={{ color: theme.textSecondary }}
                >
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
