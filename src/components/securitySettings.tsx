import { useEffect, useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import useTheme from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditPasswordCard({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme();

  var inputStyle = {
    backgroundColor: theme.bgCard,
    color: theme.textPrimary,
    borderColor: theme.border,
  };

  var labelStyle = {
    color: theme.textSecondary,
  };

  const handleSubmit = async () => {
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        "Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch("/api/users/password", {
        currentPassword,
        newPassword,
      });

      setSuccess(true);

      if (res.data.logout) {
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 1200);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Error al actualizar la contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Reset state when component is unmounted
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(false);
      setLoading(false);
    };
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: theme.bgCard,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: theme.appName }}>
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <Label className="mb-2" style={labelStyle}>
              Contraseña Actual
            </Label>
            <Input
              type="text"
              name="fake-username"
              autoComplete="username"
              className="hidden"
            />
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <Label className="mb-2" style={labelStyle}>
              Nueva Contraseña
            </Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <Label className="mb-2" style={labelStyle}>
              Confirmar Nueva Contraseña
            </Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              Contraseña actualizada correctamente
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              style={{ color: theme.textSecondary }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: theme.primary,
                color: theme.dangerText,
              }}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
