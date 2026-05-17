/**
 * Delete a service in the /clients/[id]/history page
 */
"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react"; // Añadí Loader2 para mejor UX
import useTheme from "@/hooks/useTheme";

interface DeleteServiceProps {
  serviceId: string;
  Id: string;
  trigger?: React.ReactNode; // Agregado porque lo usas en el render
}

export default function DeleteService({
  serviceId,
  Id,
  trigger,
}: DeleteServiceProps) {
  const [open, setOpen] = useState(false); // Controla la visibilidad del modal
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    // Evitamos que el modal se cierre automáticamente antes de terminar la petición
    e.preventDefault();

    setLoading(true);

    try {
      await axios.delete(`/api/clients/${Id}/services/${serviceId}`);

      setOpen(false); // Cerramos el modal solo si la petición fue exitosa
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error al eliminar el servicio:", error);
      alert(error.response?.data?.message || "Error al eliminar el servicio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            className="flex flex-row rounded-full cursor-pointer gap-1"
            style={{
              backgroundColor: theme.accentBg,
              color: theme.textPrimary,
              borderColor: theme.border,
            }}
          >
            <Trash2 className="h-4 w-4" style={{ color: theme.danger }} />
            Eliminar Servicio
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent
        style={{
          backgroundColor: theme.bgCard,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: theme.textPrimary }}>
            ¿Seguro que querés eliminar este servicio?
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: theme.textSecondary }}>
            Esta acción no se puede deshacer. Los datos de este servicio serán
            eliminados permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            style={{ color: theme.textPrimary }}
          >
            Cancelar
          </AlertDialogCancel>

          <Button
            onClick={handleConfirmDelete}
            disabled={loading}
            className="flex items-center gap-2"
            style={{
              backgroundColor: theme.danger,
              color: theme.dangerText,
              borderColor: theme.danger,
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
