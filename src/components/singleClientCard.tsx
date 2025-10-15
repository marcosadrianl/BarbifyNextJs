"use client";
/*
 * Este componente muestra la información de un solo cliente.
 * Recibe las propiedades del cliente como props.

 */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import MoreInfoModal from "./moreInfoModal";
import ClientHealthCard from "./clientHealthCard";
import ClientActions from "@/components/clientActions";
import { IClient } from "@/models/Clients";

export default function SingleClientCard({ client }: { client: IClient }) {
  return (
    <div className="flex flex-col w-2xl gap-1">
      {/* Aquí Imagen y Nombre en grande del Cliente*/}
      <div className="bg-[#ffd49d] p-2  h-fit rounded-t-2xl flex flex-col lg:flex-row items-start">
        {/* Imagen del Cliente*/}
        <Image
          src={client.clientImage || "/default-client.png"}
          alt={`Perfil de ${client.clientName}`}
          width={100}
          height={100}
          className="rounded-full mb-4 lg:mb-0 lg:mr-4"
          style={{ width: "100px", height: "100px" }}
        />

        {/* Nombre y detalles del Cliente*/}
        <div className="flex flex-col  w-full">
          <h1 className="text-5xl font-bold">
            {client.clientName} {client.clientLastName}
          </h1>
          <div className="w-fit">
            <Link
              href={`mailto:${client.clientEmail}`}
              className="flex flex-row items-center align-middle gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#43553b"
              >
                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
              </svg>
              <p className="font-bold">{client.clientEmail}</p>
            </Link>
          </div>
          <div>
            <div className="flex flex-row items-center align-middle gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#43553b"
              >
                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
              </svg>
              <p>{client.clientPhone}</p>
            </div>
            <div className="flex flex-row items-center align-middle gap-1">
              <MoreInfoModal client={client} />
            </div>
            {/* Fin Nombre y detalles del Cliente*/}
          </div>
        </div>
      </div>
      {/* Aquí más detalles del Cliente*/}
      <ClientActions client={client} />
      <ClientHealthCard client={client} />
    </div>
  );
}
