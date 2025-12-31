"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

// Esquema Zod (igual que el que ya tenías)
const ClientSchema = z.object({
  clientName: z.string().min(1, "Nombre requerido"),
  clientLastName: z.string().min(1, "Apellido requerido"),
  clientSex: z.enum(["M", "F", "O"]),
  clientBirthdate: z.string(),
  clientEmail: z.string().email("Email inválido").optional(),
  clientPhone: z.string().optional(),
  clientImage: z.string().optional(),
  clientActive: z.boolean(),
  clientBaseColor: z.string().optional(),
  clientHairType: z.string().optional(),
  clientWhiteHairs: z.number().gte(0).lte(100).optional(),
  clientAllergies: z.string().optional(),
  clientDiseases: z.string().optional(),
  clientMedications: z.string().optional(),
  clientNotes: z.string().optional(),
  clientServices: z.array(z.any()).optional(),
});

type ClientFormData = z.infer<typeof ClientSchema>;

interface ServerError {
  error: string;
  field?: string;
  status?: number;
}

export default function EditClientFormPage() {
  const params = useParams(); // obtiene el id de la URL
  const router = useRouter();
  const clientId = params.id as string;

  const [serverError, setServerError] = useState<ServerError | null>(null);
  const [selectedImage, setSelectedImage] = useState("/default-client.png");
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
  });

  // Traer datos actuales del cliente (GET)
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`);

        if (!res.ok) throw new Error("Error al obtener cliente");
        const client = await res.json();

        // Formatear la fecha para el input type="date"
        if (client.clientBirthdate) {
          client.clientBirthdate = client.clientBirthdate.split("T")[0];
        }

        reset(client);
        setSelectedImage(client.clientImage || "/default-client.png");
      } catch (err) {
        console.error(err);
        setServerError({
          error: "No se pudo cargar la información del cliente",
        });
      } finally {
        setLoadingData(false);
      }
    };
    if (clientId) fetchClient();
  }, [clientId, reset]);

  // Función para manejar cambio de imagen
  const handleImageChange = (imgSrc: string) => {
    setSelectedImage(imgSrc);
    setValue("clientImage", imgSrc, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // PATCH al enviar el formulario
  /**
   *
   * Este fragmento de código define una función `onSubmit`
   * que se ejecuta cuando se envía un formulario. La función
   * realiza una solicitud PATCH a la ruta `/api/clients/{clientId}`
   * utilizando `fetch`. La solicitud incluye los datos del formulario en formato JSON.
   * Si la respuesta de la solicitud no es exitosa (`!res.ok`), se captura el error y se lanza.
   * Si la respuesta es exitosa, se redirige al usuario a la página `/clients/{clientId}` utilizando `router.push`.
   * Si ocurre algún error durante la solicitud, se captura el error
   * y se muestra en la consola y en el estado `serverError`.
   *
   */
  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = (await res.json()) as ServerError;
        throw errData;
      }

      router.push("/clients/" + clientId);
    } catch (err: unknown) {
      console.error(err);

      if (typeof err === "object" && err !== null && "error" in err) {
        setServerError(err as ServerError);
      } else {
        setServerError({ error: "Unknown error occurred" });
      }
    }
  };

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
      <div className="flex gap-2 flex-wrap mb-4">
        {imageOptions.map((img) => (
          <button
            type="button"
            key={img.src}
            className={`border rounded p-1 flex flex-col items-center transition-colors duration-200 ${
              value === img.src
                ? "border-amber-500 ring-2 ring-amber-300"
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-pressed={value === img.src}
            onClick={() => onChange(img.src)}
          >
            <Image
              src={img.src}
              alt={img.label}
              width={50}
              height={50}
              className="rounded-md"
            />
            <div className="text-xs mt-1">{img.label}</div>
          </button>
        ))}
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="h-full w-full flex justify-center">
        <p className="text-center self-center w-1/2 align-middle text-gray-500">
          Cargando datos...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 px-4 w-full mx-auto overflow-auto"
    >
      <div className="flex flex-row items-center p-4 gap-4 w-full max-w-375 mb-4 mx-auto">
        <div className="flex flex-col gap-2 w-full max-w-lg mx-auto">
          <h1 className="font-bold">Editar cliente</h1>
          <input
            className="p-2 bg-amber-50"
            {...register("clientName")}
            placeholder="Nombre"
          />
          {errors.clientName && <span>{errors.clientName.message}</span>}
          <input
            className="p-2 bg-amber-50"
            {...register("clientLastName")}
            placeholder="Apellido"
          />
          {errors.clientLastName && (
            <span>{errors.clientLastName.message}</span>
          )}
          <ImageSelector value={selectedImage} onChange={handleImageChange} />
          <input type="hidden" {...register("clientImage")} />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
        <h1 className="font-bold">Información personal *</h1>
        <select className="p-2 bg-amber-50" {...register("clientSex")}>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
        <input
          type="date"
          className="p-2 bg-amber-50"
          {...register("clientBirthdate")}
        />

        <h1 className="font-bold">Datos de contacto *</h1>
        <input
          type="email"
          className="p-2 bg-amber-50"
          {...register("clientEmail")}
          placeholder="Email"
        />
        <input
          className="p-2 bg-amber-50"
          {...register("clientPhone")}
          placeholder="Teléfono"
        />

        <h1 className="font-bold">Datos de cabello</h1>
        <input
          className="p-2 bg-amber-50"
          {...register("clientBaseColor")}
          placeholder="Color base"
        />
        <input
          className="p-2 bg-amber-50"
          {...register("clientHairType")}
          placeholder="Tipo de cabello"
        />
        <div className="flex flex-row items-center">
          <h2 className="bg-amber-50 h-full w-full select-none text-[#a1a893] opacity/80 flex flex-col p-2 justify-center">
            Porcentaje de cabello blanco:
          </h2>
          <input
            type="number"
            className="p-2 bg-amber-50"
            {...register("clientWhiteHairs", { valueAsNumber: true })}
            placeholder="Cabello blanco"
          />
        </div>

        <h1 className="font-bold">Datos de salud</h1>
        <input
          className="p-2 bg-amber-50"
          {...register("clientAllergies")}
          placeholder="Alergias"
        />
        <input
          className="p-2 bg-amber-50"
          {...register("clientDiseases")}
          placeholder="Enfermedades"
        />
        <input
          className="p-2 bg-amber-50"
          {...register("clientMedications")}
          placeholder="Medicamentos"
        />
        <textarea
          className="p-2 bg-amber-50"
          {...register("clientNotes")}
          placeholder="Notas"
        />

        <button
          type="submit"
          className="bg-amber-400 rounded w-full p-2 font-bold mb-8 hover:bg-amber-500 hover:text-white cursor-pointer"
        >
          Guardar cambios
        </button>

        {serverError && (
          <div className="text-red-600 text-sm mt-2">
            {serverError.error || "Error al guardar los cambios"}
          </div>
        )}
      </div>
    </form>
  );
}
