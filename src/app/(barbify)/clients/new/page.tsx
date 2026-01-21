"use client";

/**
 * Página para crear un nuevo cliente
 */

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
import { ClientSchemaZod } from "@/models/Clients.schema";

type ClientFormData = z.infer<typeof ClientSchemaZod>;

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
    <div className="flex h-24 gap-3">
      {imageOptions.map((img) => (
        <button
          type="button"
          key={img.src}
          className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
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

export default function CreateClientForm() {
  const { data: session } = useSession();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchemaZod) as any,
    defaultValues: {
      clientActive: true,
      clientWhiteHairs: 0,
      clientBirthdate: "",
      clientFromUserId: "",
      clientImage: "",
      clientSex: "O",
      clientName: "",
      clientLastName: "",
      clientEmail: "",
      clientPhone: "",
      clientBaseColor: "",
      clientHairType: "",
      clientAllergies: "",
      clientDiseases: "",
      clientMedications: "",
      clientNotes: "",
    },
  });

  React.useEffect(() => {
    if (session?.user?.id) {
      form.setValue("clientFromUserId", session.user.id);
    }
  }, [session, form]);

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al crear cliente");
      }

      router.push("/clients");
      router.refresh();
    } catch (err) {
      console.error(err);
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Nuevo Cliente</CardTitle>
          <CardDescription>Completa la información del cliente</CardDescription>
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
                          <Input placeholder="Juan" {...field} />
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
                          <Input placeholder="Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField<ClientFormData>
                  control={form.control}
                  name="clientImage"
                  defaultValue="/default-client.png"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto de Perfil</FormLabel>
                      <FormControl>
                        <ImageSelector
                          value={
                            field.value.toString() || "/default-client.png"
                          }
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
                          defaultValue={field.value}
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
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="cliente@ejemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="221 456 7890" {...field} />
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
                          <Input placeholder="Castaño oscuro" {...field} />
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
                          <Input placeholder="Liso, ondulado..." {...field} />
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
                        <Input
                          placeholder="Ej: Polen, medicamentos..."
                          {...field}
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
                          placeholder="Ej: Diabetes, hipertensión..."
                          {...field}
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
                          placeholder="Información adicional del cliente..."
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
                  {isSubmitting ? "Creando..." : "Crear Cliente"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
