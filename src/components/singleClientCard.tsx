"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Phone, MapPin, Save } from "lucide-react";

import MoreInfoModal from "./moreInfoModal";
import useTheme from "@/hooks/useTheme";

import { IClient } from "@/models/Clients.types";

export default function SingleClientCard({ client }: { client: IClient }) {
  const { theme } = useTheme();

  return (
    <Card
      className="w-full overflow-hidden rounded-2xl shadow-md"
      style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
    >
      {/* Header */}
      <CardHeader
        className="px-8 py-10"
        style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
      >
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
            <h1
              className="text-4xl font-semibold tracking-tight"
              style={{ color: theme.textPrimary }}
            >
              {client.clientName} {client.clientLastName}
            </h1>

            <div
              className="mt-4 flex flex-col gap-2 text-base"
              style={{ color: theme.textSecondary }}
            >
              {client.clientPhone && (
                <div className="flex flex-row justify-between items-center gap-4">
                  {/* Llamar */}
                  <Link
                    href={`https://wa.me/${client.clientPhone}`}
                    className="flex items-center gap-3 hover:underline"
                    style={{ color: theme.textSecondary }}
                  >
                    <Phone
                      className="h-5 w-5"
                      style={{ color: theme.primary }}
                    />
                    {client.clientPhone}
                  </Link>

                  {/* Guardar contacto */}
                  <Link
                    href={`/api/clients/${client._id.toString()}/vcard`}
                    className="flex flex-row items-center gap-1 mr-4 text-xs hover:underline"
                    style={{ color: theme.textSecondary }}
                  >
                    <Save
                      className="h-4 w-4"
                      style={{ color: theme.primary }}
                    />{" "}
                    Guardar contacto
                  </Link>
                </div>
              )}
              {client.clientAddress && (
                <div className="flex items-center gap-3">
                  <MapPin
                    className="h-5 w-5"
                    style={{ color: theme.primary }}
                  />
                  {client.clientAddress}
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
