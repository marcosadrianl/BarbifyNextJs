"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

import MoreInfoModal from "./moreInfoModal";

import { IClient } from "@/models/Clients";

export default function SingleClientCard({ client }: { client: IClient }) {
  return (
    <Card className="w-full overflow-hidden rounded-2xl shadow-md">
      {/* Header */}
      <CardHeader className="bg-muted/40 px-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <Image
            src={client.clientImage || "/default-client.png"}
            alt={`Perfil de ${client.clientName}`}
            width={128}
            height={128}
            className="rounded-full border shadow-sm"
          />

          {/* Identidad */}
          <div className="flex-1">
            <h1 className="text-4xl font-semibold tracking-tight">
              {client.clientName} {client.clientLastName}
            </h1>

            <div className="mt-4 flex flex-col gap-2 text-base text-gray-400">
              {client.clientEmail && (
                <Link
                  href={`mailto:${client.clientEmail}`}
                  className="flex items-center gap-3 hover:text-foreground transition"
                >
                  <Mail className="h-5 w-5" />
                  {client.clientEmail}
                </Link>
              )}

              {client.clientPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  {client.clientPhone}
                </div>
              )}
            </div>
            <MoreInfoModal client={client} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
