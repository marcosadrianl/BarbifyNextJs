/**
 * este componente recive el client.id desde /clients/[id]
 * y lo envia al endpoint /clients/[id]/edit para ser actualizado
 */
export default function EditClientButton({ clientId }: { clientId: string }) {
  return (
    <button
      onClick={() => (window.location.href = `/clients/${clientId}/edit`)}
      className="flex flex-row items-center py-1 px-2 rounded-2xl m-1 bg-[#cdaa7e] hover:bg-amber-100 cursor-pointer transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#43553b"
      >
        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"></path>
      </svg>
      Editar Cliente
    </button>
  );
}
