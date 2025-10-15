"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

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

export default function CreateClientForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      clientSex: "O",
      clientActive: true,
      clientServices: [],
      clientWhiteHairs: 0,
      clientBirthdate: new Date().toISOString().split("T")[0],
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    criteriaMode: "firstError",
  });

  const [serverError, setServerError] = React.useState<ServerError | null>(
    null
  );
  const [selectedImage, setSelectedImage] = React.useState(
    "/default-client.png"
  );
  const router = useRouter();

  const handleImageChange = (imgSrc: string) => {
    setSelectedImage(imgSrc);
    setValue("clientImage", imgSrc, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = (await res.json()) as ServerError;
        throw errData;
      }

      // Cliente creado correctamente
      router.push("/clients/");
    } catch (err: unknown) {
      console.error(err);

      if (typeof err === "object" && err !== null && "error" in err) {
        setServerError(err as ServerError);
      } else {
        setServerError({ error: "Unknown error occurred" });
      }
    }
  };

  function OnErrorModal({ errors, serverError }: any) {
    const [isOpen, setIsOpen] = React.useState(true);

    if (!isOpen) return null;

    return (
      <div
        className={`${
          isOpen ? "bg-red-0" : "bg-red-100"
        }  text-red-800 rounded-md mb-3`}
      >
        {errors.clientName?.message && <p>{errors.clientName.message}</p>}
        {errors.clientLastName?.message && (
          <p>{errors.clientLastName.message}</p>
        )}

        {serverError?.error && (
          <p>
            <strong>Error:</strong> {serverError.error}
          </p>
        )}
      </div>
    );
  }

  /*   //modal de imagenes para elegir
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
            className={`border rounded p-1 ${
              value === img.src ? "border-amber-500" : "border-gray-50"
            }`}
            onClick={() => onChange(img.src)}
          >
            <Image src={img.src} alt={img.label} width={50} height={50} />
            <div className="text-xs">{img.label}</div>
          </button>
        ))}
      </div>
    );
  } */

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 px-4 w-full mx-auto"
    >
      <div className=" flex flex-row items-center p-4 gap-4 w-full max-w-[1500px] mb-4 mx-auto">
        <div className="flex flex-col gap-2 w-full max-w-lg mx-auto">
          <h1 className="font-bold">Nombre *</h1>
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

          {/* Campo oculto registrado */}
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
        <label className="hidden">
          Activo:
          <input
            type="checkbox"
            className="p-2 bg-amber-50"
            {...register("clientActive")}
          />
        </label>
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
        <div className="w-full max-w-lg">
          <button
            type="submit"
            className="bg-amber-400 rounded w-full p-2 font-bold"
          >
            Crear Cliente
          </button>
          {(errors || serverError) && (
            <OnErrorModal errors={errors} serverError={serverError} />
          )}
        </div>
      </div>
    </form>
  );
}
