/**
 * delete a service in the /clients/[id]/history page
 *
 */
"use client";

import React, { useState } from "react";

export default function DeleteService({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };
  const handleConfirmDelete = () => {
    // Aquí puedes realizar la lógica para eliminar el servicio
    fetch(`/api/services/${id}`, { method: "DELETE" });
    setShowModal(false);
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
        <div className="fixed inset-0 bg-[#ffe7c7]/50  bg-opacity-10 flex items-center justify-center z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffe7c7]  p-6 rounded-lg shadow-lg">
            <h2 className="font-bold">
              ¿Seguro que quieres borrar este servicio?
            </h2>
            <p className="text-[#43553b]/60 text-sm mb-4">
              Esta acci&oacute;n no se puede deshacer
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-[#e68f1d] hover:bg-[#cdaa7e] text-white px-4 py-2 rounded transition cursor-pointer"
                onClick={handleConfirmDelete}
              >
                Sí, borrar
              </button>
              <button
                className="bg-[#eed1ab] hover:bg-[#cdaa7e] text-white px-4 py-2 rounded transition cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
