/**
 * Delete a service in the /clients/[id]/history page
 */
"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteServiceProps {
  serviceId: string; // serviceId
  clientId: string; // clientId
}

export default function DeleteService({
  serviceId,
  clientId,
}: DeleteServiceProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");

    try {
      /*  console.log("🗑️ Eliminando servicio:", { clientId, serviceId }); */

      // ✅ URL correcta con ambos IDs

      const response = await axios.delete(
        `/api/clients/${clientId}/services/${serviceId}`
      );

      /* console.log("✅ Servicio eliminado:", response.data); */

      // Cerrar modal
      setShowModal(false);

      // Recargar la página para ver los cambios
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error al eliminar el servicio:", error);
      setError(
        error.response?.data?.message || "Error al eliminar el servicio"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="flex flex-row items-center bg-[#cdaa7e] hover:bg-[#e7c598] cursor-pointer transition py-1 px-2 rounded-2xl w-24"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#43553b"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
        Eliminar
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#ffe7c7] p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-2">
              ¿Seguro que quieres borrar este servicio?
            </h2>
            <p className="text-[#43553b]/60 text-sm mb-4">
              Esta acción no se puede deshacer
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                className="bg-[#eed1ab] hover:bg-[#cdaa7e] text-[#43553b] px-4 py-2 rounded transition cursor-pointer disabled:opacity-50"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="bg-[#e68f1d] hover:bg-[#d47a0f] text-white px-4 py-2 rounded transition cursor-pointer disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Sí, borrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
