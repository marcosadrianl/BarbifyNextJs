import React, { useEffect } from "react";
import Bullet from "@/components/bullet";
import { IClient } from "@/models/Clients";

export default function MoreInfoModal({ client }: { client: IClient }) {
  /*PErmite abrir y cerrar el modal usando ESC*/
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (!isOpen) return;

    /**
     * Event handler for keydown events.
     * If the key pressed is "Escape", it will close the modal.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  //funcion para definir el sexo del cliente segun la letra en la base de datos

  /**
   * Define el sexo del cliente segun la letra en la base de datos.
   * @returns El sexo del cliente en formato de string.
   * @example "Masculino" si el sexo es "M"
   */
  function defineClientSex() {
    if (client.clientSex === "M") {
      return "Masculino";
    } else if (client.clientSex === "F") {
      return "Femenino";
    } else {
      return "Otro";
    }
  }

  /**
   * Verifica que la fecha sea en el formato correcto., de serlo, devuelve la fecha en formato "DD/MM/YYYY".
   * @param dateString - La fecha en formato "YYYY-MM-DD"
   * @returns la fecha en formato "DD/MM/YYYY"
   */
  function validateDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <p className="cursor-pointer">
          Más información sobre el cliente{" "}
          <span className="hover:underline cursor-pointer font-semibold">
            ...m&aacute;s
          </span>
        </p>
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500/60 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[#ffe7c7] w-full m-80 p-4 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-between">
              <h2 className=" font-bold mb-4">
                {client.clientName} {client.clientLastName}
              </h2>
              <div
                className="animate-pulse p-1"
                title={
                  client.clientActive ? "Cliente activo" : "Cliente inactivo"
                }
              >
                <Bullet state={client.clientActive} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Notas:</h3>
            <p className="text-sm mb-4">{client.clientNotes || "Sin Notas"}</p>
            <hr />
            <p className="mt-4 font-bold">M&aacute;s informaci&oacute;n:</p>
            <p>
              • Fecha de Nacimiento:{" "}
              {client.clientBirthdate
                ? validateDate(client.clientBirthdate.toLocaleString())
                : "Sin Detalle"}
            </p>
            <p>• Sexo: {defineClientSex()}</p>
            <p>• % Pelo Blanco: {client.clientWhiteHairs || 0}%</p>
            <p>• Tono Base: {client.clientBaseColor || "Sin Detalle"}</p>
            <p>• Tipo de Pelo: {client.clientHairType || "Sin Detalle"}</p>
            <button
              className="mt-4 bg-[#cdaa7e] hover:bg-[#dda863] font-bold py-1 px-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
