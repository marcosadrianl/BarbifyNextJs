import NewServiceModal from "@/components/newServiceModal";
import DeleteClient from "@/components/deleteClient";
import EditClientButton from "@/components/editClientButton";
import { IClientLean } from "@/models/Clients";

export default function ClientActions({ client }: { client: IClientLean }) {
  return (
    <div className="flex flex-row gap-4 p-2.5 bg-[#ffd49d]">
      <div className="flex flex-row items-center align-middle gap-1 w-2/3">
        <div className="flex flex-row items-center align-middle gap-1 w-48">
          <NewServiceModal client={client as IClientLean} />
        </div>
        <div className="flex flex-row items-center align-middle gap-1 w-48">
          <EditClientButton clientId={client._id.toString()} />
        </div>
      </div>

      <div className="flex flex-row items-center align-middle gap-1 ml-auto">
        <DeleteClient id={client._id.toString()} />
      </div>
    </div>
  );
}
