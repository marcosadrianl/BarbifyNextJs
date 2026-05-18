"use client";

/**
 * Página para editar un cliente existente - UI Sincronizada con CreateClient
 */
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import useTheme from "@/hooks/useTheme";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Esquema Zod (Consistente con page.tsx)
const ClientSchema = z.object({
  clientName: z.string().min(1, "Nombre requerido"),
  clientLastName: z.string().min(1, "Apellido requerido"),
  clientSex: z.enum(["M", "F", "O"]),
  clientBirthdate: z.string(),
  clientPhone: z
    .string()
    .max(20, "El teléfono no puede tener más de 20 caracteres"),
  clientAddress: z.string().optional(),
  clientImage: z.string().optional(),
  clientActive: z.boolean().optional(),
  clientBaseColor: z.string().optional(),
  clientHairType: z.string().optional(),
  clientWhiteHairs: z.number().min(0).max(100).optional(),
  clientAllergies: z.string().optional(),
  clientDiseases: z.string().optional(),
  clientMedications: z.string().optional(),
  clientNotes: z.string().optional(),
  clientServices: z.array(z.any()).optional(),
});

type ClientFormData = z.infer<typeof ClientSchema>;

const imageOptions = [
  { src: "/default-client.png", label: "Default" },
  { src: "/avat1.png", label: "Avatar 1" },
  { src: "/avat2.png", label: "Avatar 2" },
  { src: "/avat3.png", label: "Avatar 3" },
  { src: "/avat4.png", label: "Avatar 4" },
  { src: "/avat5.png", label: "Avatar 5" },
  { src: "/avat6.png", label: "Avatar 6" },
];

function ImageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <div className="flex h-24 gap-3 overflow-x-auto p-2">
      {imageOptions.map((img) => (
        <button
          type="button"
          key={img.src}
          className={`relative shrink-0 aspect-square rounded-lg transition-all hover:scale-105`}
          onClick={() => onChange(img.src)}
          style={{
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: value === img.src ? theme.primary : theme.border,
            boxShadow:
              value === img.src ? `0 0 0 3px ${theme.primary}66` : undefined,
          }}
        >
          <Image
            src={img.src}
            alt={img.label}
            fill
            sizes="256px"
            className="rounded-lg object-cover"
          />
          {value === img.src && (
            <Badge
              className="absolute -top-2 -right-2"
              style={{ background: theme.primary, color: theme.accentText }}
            >
              ✓
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}

export default function EditClientFormPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { theme } = useTheme();

  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      clientImage: "/default-client.png",
    },
  });

  const inputStyle: React.CSSProperties = {
    background: theme.bgCard,
    color: theme.textPrimary,
    borderColor: theme.border,
  };

  const headingStyle: React.CSSProperties = { color: theme.textPrimary };

  const separatorStyle: React.CSSProperties = { borderColor: theme.border };

  // Carga de datos iniciales
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`/api/clients/${clientId}`);
        const client = res.data;

        // 1. Formatear la fecha
        if (client.clientBirthdate) {
          client.clientBirthdate = client.clientBirthdate.split("T")[0];
        }

        // 2. Sanitizar valores null a "" para evitar el error de React
        // Esto recorre todas las propiedades del objeto client
        const sanitizedClient = Object.fromEntries(
          Object.entries(client).map(([key, value]) => [
            key,
            value === null ? "" : value,
          ]),
        );

        // 3. Cargar los datos sanitizados en el formulario
        form.reset(sanitizedClient);
      } catch (err) {
        console.error(err);
        setServerError("No se pudo cargar la información del cliente");
      } finally {
        setLoadingData(false);
      }
    };
    if (clientId) fetchClient();
  }, [clientId, form]);

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al actualizar cliente");
      }

      router.push(`/clients/${clientId}`);
      router.refresh();
    } catch (err: any) {
      console.error("Error", err);
      setServerError(err.message || "Ocurrió un error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ background: theme.bg }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: theme.primary }}
          ></div>
          <p style={{ color: theme.textSecondary }}>
            Cargando datos del cliente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full py-2"
      style={{ background: theme.bg, color: theme.textPrimary }}
    >
      <CardHeader style={{ color: theme.textPrimary }}>
        <CardTitle className="text-3xl ">Editar Cliente</CardTitle>
        <CardDescription>
          Actualiza la información del perfil del cliente
        </CardDescription>
      </CardHeader>

      <CardContent
        className="w-full"
        style={{
          background: theme.bgCard,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={headingStyle}>
                Información Básica
              </h3>
              <Separator style={separatorStyle} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apellido"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto de Perfil</FormLabel>
                    <FormControl>
                      <ImageSelector
                        value={field.value || "/default-client.png"}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Selecciona una imagen para el cliente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={headingStyle}>
                Información Personal
              </h3>
              <Separator style={separatorStyle} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientSex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger style={inputStyle}>
                            <SelectValue placeholder="Selecciona género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientBirthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} style={inputStyle} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={headingStyle}>
                Datos de Contacto
              </h3>
              <Separator style={separatorStyle} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Teléfono"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calle 123, Ciudad"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Datos de Cabello */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={headingStyle}>
                Datos de Cabello
              </h3>
              <Separator style={separatorStyle} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientBaseColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura de Tono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Castaño, 3-4: Castaño oscuro / medio, etc"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientHairType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cabello</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Liso, ondulado, Tipo 3 (Rizado), etc"
                          {...field}
                          style={inputStyle}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientWhiteHairs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de Cabello Blanco (%)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 w-1/2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                        <span style={{ color: theme.textSecondary }}>%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Datos de Salud */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={headingStyle}>
                Datos de Salud
              </h3>
              <Separator style={separatorStyle} />

              <FormField
                control={form.control}
                name="clientAllergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alergias</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Alergias..."
                        {...field}
                        style={inputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientDiseases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enfermedades</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enfermedades..."
                        {...field}
                        style={inputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicamentos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Medicamentos actuales..."
                        {...field}
                        style={inputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionales..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        style={inputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Error del servidor */}
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 justify-end p-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                onMouseEnter={() => setHoverCancel(true)}
                onMouseLeave={() => setHoverCancel(false)}
                style={{
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  background: hoverCancel ? theme.accentBg : "transparent",
                  transition: "background-color .15s",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={() => setHoverSave(true)}
                onMouseLeave={() => setHoverSave(false)}
                style={{
                  background: hoverSave
                    ? (theme.primaryHover ?? theme.primary)
                    : theme.primary,
                  color: theme.accentText,
                  borderColor: theme.primary,
                  transition: "background-color .15s",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
