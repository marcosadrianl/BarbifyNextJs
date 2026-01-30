import { useState, useEffect } from "react";
import { IClient } from "@/models/Clients.schema";

/**
 * Hook que devuelve los clientes paginados.
 *
 * @param {number} page Número de página.
 * @param {number} limit Número de clientes por página.
 * @param {string} search Búsqueda de clientes por nombre o apellido.
 *
 * @returns {object} Un objeto con los siguientes campos:
 * - data: Un array de objetos con los clientes.
 * - totalPages: Un número con la cantidad de páginas.
 * - loading: Un booleano que indica si se está cargando o no.
 */
export function useClients(page: number, limit: number, search: string) {
  const [data, setData] = useState<IClient[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch(`/api/clients?page=${page}&limit=${limit}&search=${search}`)
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled) {
          setData(res.data);
          setTotalPages(res.totalPages);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page, limit, search]);

  return { data, totalPages, loading };
}
