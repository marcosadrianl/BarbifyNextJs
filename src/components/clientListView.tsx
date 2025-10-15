"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IClient } from "@/models/Clients";

export default function ClientListView({ clients }: { clients: IClient[] }) {
  const router = useRouter();

  return (
    <div className="px-2">
      <table className="w-full rounded-md overflow-hidden transition-all duration-200">
        <thead className="bg-[#cdaa7e] transition-all duration-200">
          <tr>
            <th className="text-lg px-4 py-2 text-left">Cliente</th>
            <th className="text-lg px-4 py-2 text-left">Email</th>
            <th className="text-lg px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2">
              <button
                className="flex flex-row items-center text-nowrap cursor-pointer gap-1 w-fit font-normal ml-auto bg-[#cdaa7e] hover:bg-[#ffd49d] px-5 py-1 rounded-2xl"
                onClick={() => router.push("/clients/new")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#43553b"
                >
                  <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
                </svg>
                Nuevo Cliente
              </button>
            </th>
          </tr>
        </thead>
        <tbody className=" bg-[#ffd49d]">
          {clients.map((client) => (
            <tr key={client._id!.toString()} className="hover:bg-[#f3c78d]">
              <td className="flex flex-row px-4 py-2 gap-2 items-center text-nowrap">
                <Image
                  src={client.clientImage || "/default-client.png"}
                  alt={`Perfil de ${client.clientName}`}
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                {client.clientName} {client.clientLastName}
              </td>
              <td className="px-4 py-2">{client.clientEmail}</td>
              <td className="px-4 py-2">{client.clientPhone}</td>
              <td
                onClick={(e) => e.stopPropagation()}
                className="px-4 text-nowrap"
              >
                <Link
                  href={`/clients/${client._id}`}
                  className="flex flex-row items-center ml-auto gap-1 w-fit bg-[#cdaa7e] hover:bg-[#ffd49d] px-8 py-1 rounded-2xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#43553b"
                  >
                    <path d="M480-480q-51 0-85.5-34.5T360-600q0-50 34.5-85t85.5-35q50 0 85 35t35 85q0 51-35 85.5T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560ZM240-240v-76q0-21 10.5-39.5T279-385q46-27 96.5-41T480-440q54 0 104.5 14t96.5 41q18 11 28.5 29.5T720-316v76H240Zm240-120q-41 0-80 10t-74 30h308q-35-20-74-30t-80-10Zm0-240Zm0 280h154-308 154ZM160-80q-33 0-56.5-23.5T80-160v-160h80v160h160v80H160ZM80-640v-160q0-33 23.5-56.5T160-880h160v80H160v160H80ZM640-80v-80h160v-160h80v160q0 33-23.5 56.5T800-80H640Zm160-560v-160H640v-80h160q33 0 56.5 23.5T880-800v160h-80Z" />
                  </svg>
                  Ver Cliente
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
