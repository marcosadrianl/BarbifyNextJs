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
    <Button className="flex flex-row w-36 rounded-full bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer text-[#43553b] gap-1">
      <UserRoundPen />
      <Link href={`/clients/${clientId}/edit`}>Editar Cliente</Link>
    </Button>
  );
}
