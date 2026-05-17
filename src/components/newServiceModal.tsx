"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IBarbers } from "@/models/Barbers";
import {
  Plus,
  Calendar,
  Clock,
  DollarSign,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBarbers } from "@/lib/store/services.store";
import { useSession } from "next-auth/react";
import useTheme from "@/hooks/useTheme";

interface IServiceFormData {
  serviceName: string;
  serviceDate: string;
  servicePrice: string | number;
  serviceDuration: string | number;
  serviceNotes: string;
  fromBarberId: string;
  forUserId?: string;
  toClientId?: string;
}

export default function NewServiceModal() {
  const { data: session } = useSession();
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [barberList, setBarberList] = useState<IBarbers[]>([]);
  const router = useRouter();

  // Corrección: useParams solo devuelve los parámetros de la URL
  const params = useParams();
  const clientId = params.id as string; // Asumiendo que el parámetro se llama 'id'

  // Estados del formulario
  const [formData, setFormData] = useState<IServiceFormData>({
    serviceName: "",
    serviceDate: "",
    servicePrice: "",
    serviceDuration: "15",
    serviceNotes: "",
    fromBarberId: "",
  });

  const { barbers, refreshFromAPI } = useBarbers();

  useEffect(() => {
    refreshFromAPI();
  }, [refreshFromAPI]);

  useEffect(() => {
    setBarberList(barbers);
  }, [barbers]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar la fecha directamente del input datetime-local
      const serviceDate = new Date(formData.serviceDate).toISOString();

      // Buscar el nombre del barbero seleccionado
      const selectedBarber = barberList.find(
        (b) => b._id.toString() === formData.fromBarberId,
      );
      const barberName = selectedBarber
        ? `${selectedBarber.barberName} ${
            selectedBarber.barberLastName || ""
          }`.trim()
        : "No especificado";

      // Agregar automáticamente la información del barbero a las notas
      const notesWithBarber = formData.serviceNotes
        ? `${formData.serviceNotes}\n - Atendió: ${barberName}`
        : `Atendió: ${barberName}`;

      const serviceData = {
        serviceName: formData.serviceName.toLocaleLowerCase(),
        servicePrice: Number(formData.servicePrice) * 100, // Convertir a centavos
        serviceDate: serviceDate,
        fromBarberId: formData.fromBarberId,
        serviceDuration: Number(formData.serviceDuration),
        serviceNotes: notesWithBarber,
        toClientId: clientId,
        forUserId: session?.user.id,
      };

      // Corrección: endpoint correcto usando axios
      const res = await fetch(`/api/clients/${clientId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
        // Reset form
        setFormData({
          serviceName: "",
          servicePrice: "",
          serviceDate: "",
          serviceNotes: "",
          serviceDuration: "30",
          fromBarberId: "",
        });
      } else {
        const errorData = await res.json();
        alert(
          `Error al guardar el servicio: ${
            errorData.message || "Error desconocido"
          }`,
        );
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert(
        "Error de red: " +
          (err instanceof Error ? err.message : "Error desconocido"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex flex-row w-36 rounded-full cursor-pointer gap-1"
          style={{
            backgroundColor: theme.accentBg,
            color: theme.textPrimary,
            borderColor: theme.border,
          }}
        >
          <Plus className="w-6 h-6" style={{ color: theme.primary }} />
          <span>Nuevo Servicio</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-131.25 rounded-3xl border-none shadow-2xl"
        style={{
          backgroundColor: theme.bgCard,
          color: theme.textPrimary,
          borderColor: theme.border,
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: theme.textPrimary }}
          >
            Registrar Servicio
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="space-y-5 py-4"
          style={{ color: theme.textSecondary }}
        >
          {/* Nombre del Servicio */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2"
              style={{ color: theme.textSecondary }}
            >
              <Plus className="w-4 h-4" style={{ color: theme.primary }} />{" "}
              Nombre del Servicio
            </Label>
            <Input
              id="name"
              required
              placeholder="Ej: Corte + Barba"
              className="rounded-xl"
              style={{ borderColor: theme.border }}
              value={formData.serviceName}
              onChange={(e) =>
                setFormData({ ...formData, serviceName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="flex items-center gap-2"
                style={{ color: theme.textSecondary }}
              >
                <DollarSign
                  className="w-4 h-4"
                  style={{ color: theme.primary }}
                />{" "}
                Precio
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="rounded-xl"
                style={{ borderColor: theme.border }}
                value={formData.servicePrice}
                onChange={(e) =>
                  setFormData({ ...formData, servicePrice: e.target.value })
                }
              />
            </div>
            {/* Duración */}
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="flex items-center gap-2"
                style={{ color: theme.textSecondary }}
              >
                <Clock className="w-4 h-4" style={{ color: theme.primary }} />{" "}
                Minutos
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                required
                className="rounded-xl"
                style={{ borderColor: theme.border }}
                value={formData.serviceDuration}
                onChange={(e) =>
                  setFormData({ ...formData, serviceDuration: e.target.value })
                }
              />
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="flex items-center gap-2"
              style={{ color: theme.textSecondary }}
            >
              <Calendar className="w-4 h-4" style={{ color: theme.primary }} />{" "}
              Fecha y Hora
            </Label>
            <Input
              id="date"
              type="datetime-local"
              required
              className="rounded-xl shadow-sm"
              style={{ borderColor: theme.border }}
              value={formData.serviceDate}
              onChange={(e) =>
                setFormData({ ...formData, serviceDate: e.target.value })
              }
            />
          </div>

          {/* Barbero */}
          <div className="space-y-2">
            <Label
              className="flex items-center gap-2"
              style={{ color: theme.textSecondary }}
            >
              <User className="w-4 h-4" style={{ color: theme.primary }} />{" "}
              Atendido por:
            </Label>
            <Select
              value={formData.fromBarberId}
              onValueChange={(val) =>
                setFormData({ ...formData, fromBarberId: val })
              }
            >
              <SelectTrigger
                className="rounded-xl"
                style={{ borderColor: theme.border }}
              >
                <SelectValue placeholder="Selecciona un Barber" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {barberList.length > 0 ? (
                  barberList.map((barber) => (
                    <SelectItem
                      key={barber._id.toString()}
                      value={barber._id.toString()}
                    >
                      {barber.barberName} {barber.barberLastName || ""}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-barber" disabled>
                    No hay Barbers disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="flex items-center gap-2"
              style={{ color: theme.textSecondary }}
            >
              <FileText className="w-4 h-4" style={{ color: theme.primary }} />{" "}
              Notas / Observaciones
            </Label>
            <Textarea
              id="notes"
              placeholder="Detalles adicionales..."
              className="rounded-xl min-h-20"
              style={{ borderColor: theme.border }}
              value={formData.serviceNotes}
              onChange={(e) =>
                setFormData({ ...formData, serviceNotes: e.target.value })
              }
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-8"
              style={{
                backgroundColor: theme.primary,
                color: theme.accentText,
                boxShadow: `0 10px 20px rgba(34, 197, 94, 0.2)`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Servicio"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
