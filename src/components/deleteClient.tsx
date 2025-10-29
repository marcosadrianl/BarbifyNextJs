/*
 *Dele a client in the /[id] page
 * the endpoint is /api/clients/[id]
 * metod DELETE
 */

import React, { useState } from "react";

export default function DeleteClient({ id }: { id: string | unknown }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    fetch(`/api/clients/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setShowConfirm(false);
      });
    //dirigir a /clients
    window.location.href = "/clients";
  }

  return (
    <div className="flex flex-row gap-4 bg-[#ffd49d] text-[#43553b]">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex flex-row items-center gap-1 py-1 px-2 rounded-2xl m-1 bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer transition ml-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#43553b"
        >
          <path d="M791-55 686-160H160v-112q0-34 17.5-62.5T224-378q45-23 91.5-37t94.5-21L55-791l57-57 736 736-57 57ZM240-240h366L486-360h-6q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm496-138q29 14 46 42.5t18 61.5L666-408q18 7 35.5 14t34.5 16ZM568-506l-59-59q23-9 37-29.5t14-45.5q0-33-23.5-56.5T480-720q-25 0-45.5 14T405-669l-59-59q23-34 58-53t76-19q66 0 113 47t47 113q0 41-19 76t-53 58Zm38 266H240h366ZM457-617Z"></path>
        </svg>
        Borrar Cliente
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-[#ffe7c7]/50  bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-[#ffe7c7] p-6 rounded-lg shadow-lg">
            <h2 className="font-bold">
              ¿Seguro que quieres borrar este cliente?
            </h2>
            <p className="text-[#43553b]/60 text-sm mb-4">
              Esta accion no se puede deshacer
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-[#e68f1d] hover:bg-[#cdaa7e] text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Sí, borrar
              </button>
              <button
                className="bg-[#eed1ab] hover:bg-[#cdaa7e] text-white px-4 py-2 rounded"
                onClick={() => setShowConfirm(false)}
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
