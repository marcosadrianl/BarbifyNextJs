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
import { Loader2, Trash2 } from "lucide-react"; // Importa los iconos
import useTheme from "@/hooks/useTheme";

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
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleCancel() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDeleting(false);
    setOpen(false);
  }

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {title}
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
            ¿Seguro que querés eliminar este cliente?
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: theme.textSecondary }}>
            Esta acción no se puede deshacer. El cliente y toda su información
            serán eliminados permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            style={{ color: theme.textPrimary }}
          >
            Cancelar
          </AlertDialogCancel>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
            style={{
              backgroundColor: theme.danger,
              color: theme.dangerText,
              borderColor: theme.danger,
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Sí, eliminar</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
