import { Button } from "@/components/ui/button";
import { UserRoundPen } from "lucide-react";
import Link from "next/link";
import useTheme from "@/hooks/useTheme";
/**
 * este componente recive el client.id desde /clients/[id]
 * y lo envia al endpoint /clients/[id]/edit para ser actualizado
 */
export default function EditClientButton({
  clientId,
}: {
  clientId: string | unknown;
}) {
  const { theme } = useTheme();

  return (
    <Button
      className="flex flex-row w-36 rounded-full cursor-pointer gap-1"
      style={{ backgroundColor: theme.accentBg, color: theme.textPrimary }}
    >
      <UserRoundPen style={{ color: theme.textPrimary }} />
      <Link
        href={`/clients/${clientId}/edit`}
        style={{ color: theme.textPrimary }}
      >
        Editar Cliente
      </Link>
    </Button>
  );
}
