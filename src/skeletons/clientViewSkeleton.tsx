"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useTheme from "@/hooks/useTheme";

export default function ClientsTableSkeleton() {
  const { theme } = useTheme();
  const [buttonBg, setButtonBg] = useState(theme.primary);

  useEffect(() => {
    setButtonBg(theme.primary);
  }, [theme.primary]);

  return (
    <div
      className="space-y-2 border rounded-xl shadow-md py-4 animate-pulse"
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
        borderColor: theme.border,
      }}
    >
      <Button
        disabled
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
        <Table style={{ backgroundColor: theme.bgCard }}>
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
                TELÉFONO
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
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} style={{ backgroundColor: theme.bgCard }}>
                <TableCell
                  className="flex items-center gap-3"
                  style={{ color: theme.textPrimary }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell className="text-right">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>

                <TableCell className="text-right">
                  <MoreHorizontal
                    className="h-4 w-4 ml-auto mr-4"
                    style={{ color: theme.textSecondary }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
