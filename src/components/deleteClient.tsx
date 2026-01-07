"use client";

import { useEffect, useRef, useState } from "react";
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
import { Trash2 } from "lucide-react";

export default function DeleteClient({
  id,
  title = "Eliminar cliente",
  trigger,
}: {
  id: string;
  title?: string;
  trigger?: React.ReactNode;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleDelete() {
    setIsDeleting(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/clients/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        window.location.href = "/clients";
      } catch (error) {
        console.error("Error deleting client", error);
        setIsDeleting(false);
      }
    }, 5000);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {title}
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            ¿Seguro que querés eliminar este cliente?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El cliente y toda su información
            serán eliminados permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="text-black">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
