import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { IClient } from "@/models/Clients.types"; // ajustá el import
import Client from "@/models/Clients.model";

/**
 * 
 * @param _req   _id?: string;
  clientName: string;
  clientLastName: string;
  clientSex: "M" | "F" | "O"; //male, female, other
  clientBirthdate?: Date;
  clientPhone?: string;
  clientAddress?: string;
  clientImage?: string;
  clientActive: boolean;
  clientBaseColor?: string;
  clientHairType?: string;
  clientAllergies?: string;
  clientDiseases?: string;
  clientMedications?: string;
  clientNotes?: string;
  clientWhiteHairs: number;
  clientFromUserId?: string;
  clientPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
 * @param param1 
 * @returns 
 */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const client = await (Client as mongoose.Model<IClient>).findById(id).lean();
  console.log("Generando vCard para el cliente:", client);
  if (!client) {
    return new NextResponse("Not found", { status: 404 });
  }

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${client.clientLastName.toUpperCase()};${client.clientName.toUpperCase()};;;
FN:${client.clientName} ${client.clientLastName}
TEL;TYPE=CELL:${client.clientPhone || ""}
ADR;TYPE=HOME:;;${client.clientAddress || ""}
BDAY:${client.clientBirthdate ? new Date(client.clientBirthdate).toISOString().split("T")[0] : ""}
X-CLIENT-SEX:${client.clientSex === "M" ? "Masculino" : client.clientSex === "F" ? "Femenino" : "Otro"}
X-HAIR-TYPE:${client.clientHairType || "No especificado"}
X-HAIR-COLOR:${client.clientBaseColor || "No especificado"}
X-WHITE-HAIRS:${client.clientWhiteHairs || 0}
X-ALLERGIES:${client.clientAllergies || "Ninguna"}
X-DISEASES:${client.clientDiseases || "Ninguna"}
X-MEDICATIONS:${client.clientMedications || "Ninguna"}
NOTE:${client.clientNotes || "Cliente de Barbify"}
UID:client-${client._id}
PRODID:-//Barbify//Barbify Client vCard//ES
END:VCARD
`.trim();

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${client.clientName}-${client.clientLastName}.vcf"`,
    },
  });
}
