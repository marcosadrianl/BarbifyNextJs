"use client";

/*
 * Delete client in the /[id] page
 * endpoint: /api/clients/[id]
 * method: DELETE
 */

import React, { useEffect, useRef, useState } from "react";

export default function DeleteClient({
  id,
  title,
}: {
  id: string | unknown;
  title?: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpia el timeout si se cierra la modal o se desmonta
  useEffect(() => {
    if (!showConfirm && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsDeleting(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showConfirm]);

  async function handleDelete() {
    setIsDeleting(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/clients/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        setShowConfirm(false);
        window.location.href = "/clients";
      } catch (error) {
        console.error("Error deleting client", error);
        setIsDeleting(false);
      }
    }, 5000); // ⏱️ delay de 5 segundos
  }

  return (
    <div className="flex flex-row gap-4 text-[#43553b]">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex flex-row items-center cursor-pointer transition ml-auto gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#43553b"
        >
          <path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
        </svg>
        {title}
      </button>

      {showConfirm && (
        <div className="absolute inset-0 bg-[#ffe7c7]/50 flex items-center justify-center z-50 w-full h-full">
          <div className="bg-[#ffe7c7] p-6 rounded-lg shadow-lg w-fit">
            <h2 className="font-bold mb-1">
              ¿Seguro que quieres borrar este cliente?
            </h2>
            <p className="text-[#43553b]/60 text-sm mb-4">
              Esta acción no se puede deshacer
            </p>

            <div className="flex gap-4 justify-end">
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="bg-[#e68f1d] hover:bg-[#cdaa7e] disabled:opacity-70 text-white px-4 py-2 rounded flex items-center justify-center min-w-27.5"
              >
                {isDeleting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Sí, borrar"
                )}
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#eed1ab] hover:bg-[#cdaa7e] text-white px-4 py-2 rounded"
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
