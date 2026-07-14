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
import axios from "axios";
import useTheme from "@/hooks/useTheme";

export default function DeleteBarber({
  id,
  title = "",
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
    try {
      await axios.delete(`/api/users/barbers?id=${id}`);
      window.location.href = "/account/barbers";
    } catch (error) {
      console.error("Error deleting barber", error);
      setIsDeleting(false);
    }
  }

  const { theme } = useTheme();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="cursor-pointer">
        {trigger ?? (
          <Button
            className="flex items-center gap-2 cursor-pointer"
            style={{
              backgroundColor: theme.danger,
              color: theme.dangerText,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.dangerHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.danger;
            }}
          >
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
            ¿Seguro que querés eliminar este barber?
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: theme.textSecondary }}>
            Esta acción no se puede deshacer. Tu barber y toda su información
            serán eliminados permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="cursor-pointer"
            style={{
              backgroundColor: theme.bgCard,
              color: theme.textMuted,
              borderColor: theme.border,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.accentBg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.bgCard;
            }}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
            style={{
              backgroundColor: theme.danger,
              color: theme.dangerText,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.dangerHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                theme.danger;
            }}
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
