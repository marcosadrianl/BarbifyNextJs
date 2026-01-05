"use client";

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
import { Plus } from "lucide-react";

export default function ClientsTableSkeleton() {
  return (
    <div className="rounded-xl border-b bg-card animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">
              <Button className="hover:cursor-pointer ml-auto m-1 bg-[#55533b] hover:bg-[#837d3d] text-white">
                <Plus className=" h-4 w-4" />
                Nuevo Cliente
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-50" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-30" />
              </TableCell>

              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
