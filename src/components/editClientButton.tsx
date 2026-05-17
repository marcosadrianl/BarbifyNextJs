import { Button } from "@/components/ui/button";
import { UserRoundPen } from "lucide-react";
import Link from "next/link";
/**
 * este componente recive el client.id desde /clients/[id]
 * y lo envia al endpoint /clients/[id]/edit para ser actualizado
 */
export default function EditClientButton({
  clientId,
}: {
  clientId: string | unknown;
}) {
  return (
    <Button className="flex flex-row w-36 rounded-full bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-900 gap-1">
      <UserRoundPen />
      <Link href={`/clients/${clientId}/edit`}>Editar Cliente</Link>
    </Button>
  );
}
