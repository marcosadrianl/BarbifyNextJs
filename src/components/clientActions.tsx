import NewServiceModal from "@/components/newServiceModal";
import DeleteClient from "@/components/deleteClient";
import EditClientButton from "@/components/editClientButton";
import { IClient } from "@/models/Clients";

export default function ClientActions({ client }: { client: IClient }) {
  return (
    <div className="flex flex-row gap-4 p-2.5 bg-[#ffd49d]">
      <div className="flex flex-row items-center align-middle gap-1 w-2/3">
        <div className="flex flex-row items-center align-middle gap-1 w-48">
          <NewServiceModal client={client} />
        </div>
        <div className="flex flex-row items-center align-middle gap-1 w-48">
          <EditClientButton clientId={client._id} />
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 py-1 px-2 rounded-2xl m-1 bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer transition ml-auto">
        <DeleteClient id={client._id} title={"Eliminar Cliente"} />
      </div>
    </div>
  );
}
