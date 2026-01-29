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
  return (
    <div className="flex h-24 gap-3 overflow-x-auto p-2">
      {imageOptions.map((img) => (
        <button
          type="button"
          key={img.src}
          className={`relative shrink-0 aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
            value === img.src
              ? "border-[#ffd49d] ring-2 ring-[#ffd49d] ring-offset-2"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onChange(img.src)}
        >
          <Image
            src={img.src}
            alt={img.label}
            fill
            sizes="256px"
            className="rounded-lg object-cover"
          />
          {value === img.src && (
            <Badge className="absolute -top-2 -right-2 bg-[#ffd49d] text-black hover:bg-[#ffc570]">
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

  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      clientImage: "/default-client.png",
    },
  });

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
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="text-gray-500">Cargando datos del cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Editar Cliente</CardTitle>
          <CardDescription>
            Actualiza la información del perfil del cliente
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Básica</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre" {...field} />
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
                          <Input placeholder="Apellido" {...field} />
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
                <h3 className="text-lg font-semibold">Información Personal</h3>
                <Separator />

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
                            <SelectTrigger>
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Datos de Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Datos de Contacto</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="Teléfono" {...field} />
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
                          <Input placeholder="Calle 123, Ciudad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Datos de Cabello */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Datos de Cabello</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientBaseColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Base</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Castaño, rubio, 01, etc"
                            {...field}
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
                            placeholder="Liso, ondulado, rizado, etc"
                            {...field}
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
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                          <span className="text-gray-400">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Datos de Salud */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Datos de Salud</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="clientAllergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alergias</FormLabel>
                      <FormControl>
                        <Input placeholder="Alergias..." {...field} />
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
                        <Input placeholder="Enfermedades..." {...field} />
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
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ffd49d] text-black hover:bg-[#ffc570]"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
