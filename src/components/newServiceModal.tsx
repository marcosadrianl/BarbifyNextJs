import { use, useEffect, useState } from "react";
import { IClient } from "@/models/Clients";
import { IBarbers } from "@/models/Barbers";

interface BarberWithId extends IBarbers {
  _id: string;
}

export default function NewServiceModal({ client }: { client: IClient }) {
  /*PErmite abrir y cerrar el modal usando ESC*/
  const [isOpen, setIsOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [barberId, setBarberId] = useState("");
  const [barberList, setBarberList] = useState<BarberWithId[]>([]);

  /**
   * Event handler for keydown events.
   * If the key pressed is "Escape", it will close the modal.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSave = async () => {
    //const numericPrice = servicePrice === "" ? 0 : Number(servicePrice);
    // Convertir a UTC
    const localDate = new Date(serviceDate);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset()
    );

    const serviceData = {
      serviceName,
      servicePrice: Number(servicePrice) * 100,
      serviceDate: utcDate,
      serviceNotes,
      fromBarberId: barberId,
      serviceDuration: Number(serviceDuration),
    };

    try {
      const res = await fetch(`/api/services/${client._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
      if (res.ok) {
        // Opcional: feedback, cerrar modal, refrescar datos, etc.
        //refresh
        setIsOpen(false);
        window.location.reload();
      } else {
        // Manejo de error
        alert("Error al guardar el servicio");
      }
    } catch (err) {
      alert("Error de red" + err);
    }
  };

  const getBarberList = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      console.log("Barberos disponibles:", data);
      return data;
    } catch (err) {
      console.error("Error al obtener la lista de barberos:", err);
    }
  };

  useEffect(() => {
    const fetchBarberList = async () => {
      const barberList = await getBarberList();
      setBarberList(barberList);
    };
    fetchBarberList();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-row items-center gap-1 py-1 px-2 rounded-2xl m-1 bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#43553b"
        >
          <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path>
        </svg>
        Nuevo Servicio
      </button>

      {/* Modal when open */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-gray-500/60 bg-opacity-50 flex items-center justify-center z-50 text-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[#ffe7c7]  w-1/2 p-4 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-between">
              <h2 className=" font-bold mb-4">Nuevo Servicio</h2>
            </div>
            <div className="flex flex-row justify-between gap-4 w-full">
              <div className="w-1/2">
                <h3 className="font-semibold mb-2">Nombre:</h3>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Corte de cabello, Afeitado, etc."
                />
              </div>
              <div className="w-1/2">
                <h3 className="font-semibold mb-2">Precio:</h3>
                <input
                  type="number"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Precio del servicio"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-4 w-full">
              <div className="w-1/2">
                <h3 className="font-semibold mb-2">Duracion:</h3>
                <input
                  type="number"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Duración en minutos"
                  required
                />
              </div>

              <div className="w-1/2">
                <h3 className="font-semibold mb-2">Fecha:</h3>
                <input
                  type="datetime-local"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              </div>
            </div>

            <h3 className="font-semibold mb-2">Observaciones:</h3>
            <textarea
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Observaciones"
            ></textarea>
            <p className="mt-4 font-bold">Atendido por:</p>
            {/*es una lista de barberos*/}
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">Selecciona un barbero</option>
              {barberList &&
                barberList.map((barber: BarberWithId) => (
                  <option key={barber._id} value={barber._id}>
                    {barber.barberName}
                  </option>
                ))}
            </select>

            <div className="flex flex-row justify-end gap-4">
              <button
                className="mt-4 bg-[#cdaa7e] hover:bg-[#f0b66c] font-bold py-1 px-2 rounded"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="mt-4 bg-[#cdaa7e] hover:bg-[#e7c598] font-bold py-1 px-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
