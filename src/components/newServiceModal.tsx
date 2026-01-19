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
    serviceDuration: "30",
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
      // Convertir la fecha local a UTC
      const localDate = new Date(formData.serviceDate);
      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000,
      );

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
        serviceDate: utcDate.toISOString(),
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
        <Button className="flex flex-row w-36 rounded-full bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer text-[#43553b] gap-1">
          <Plus className="w-6 h-6" />
          <span>Nuevo Servicio</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-131.25 bg-white rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Registrar Servicio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5 py-4 text-[#43553b]">
          {/* Nombre del Servicio */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-slate-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-orange-500" /> Nombre del Servicio
            </Label>
            <Input
              id="name"
              required
              placeholder="Ej: Corte + Barba"
              className="rounded-xl border-slate-200 focus:ring-orange-500"
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
                className="text-slate-600 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-orange-500" /> Precio
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="rounded-xl border-slate-200"
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
                className="text-slate-600 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-orange-500" /> Minutos
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                required
                className="rounded-xl border-slate-200"
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
              className="text-slate-600 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-orange-500" /> Fecha y Hora
            </Label>
            <Input
              id="date"
              type="datetime-local"
              required
              className="rounded-xl border-slate-200 shadow-sm"
              value={formData.serviceDate}
              onChange={(e) =>
                setFormData({ ...formData, serviceDate: e.target.value })
              }
            />
          </div>

          {/* Barbero */}
          <div className="space-y-2">
            <Label className="text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> Atendido por:
            </Label>
            <Select
              value={formData.fromBarberId}
              onValueChange={(val) =>
                setFormData({ ...formData, fromBarberId: val })
              }
            >
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Selecciona un barbero" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {barberList.map((barber) => (
                  <SelectItem
                    key={barber._id.toString()}
                    value={barber._id.toString()}
                  >
                    {barber.barberName} {barber.barberLastName || ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-slate-600 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-orange-500" /> Notas /
              Observaciones
            </Label>
            <Textarea
              id="notes"
              placeholder="Detalles adicionales..."
              className="rounded-xl border-slate-200 min-h-20"
              value={formData.serviceNotes}
              onChange={(e) =>
                setFormData({ ...formData, serviceNotes: e.target.value })
              }
            />
            <p className="text-xs text-slate-500">
              * Se agregará automáticamente el nombre del barbero al guardar
            </p>
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
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 shadow-lg shadow-orange-200"
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
