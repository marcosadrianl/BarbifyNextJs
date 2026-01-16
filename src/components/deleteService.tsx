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
          <Button className="flex flex-row  rounded-full bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer text-[#43553b] gap-1">
            <Trash2 className="h-4 w-4" />
            Eliminar Servicio
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            ¿Seguro que querés eliminar este servicio?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Los datos de este servicio serán
            eliminados permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="text-black">
            Cancelar
          </AlertDialogCancel>

          <Button
            onClick={handleConfirmDelete}
            disabled={loading}
            variant="destructive"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
