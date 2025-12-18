"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  /**
   * Function to handle search input.
   * If the search query is not empty, it will push to the clients page with the search query.
   * The search query is URL encoded to ensure it can be passed as a parameter in the URL.
   * The page number is set to 1 and the limit to 10 by default.
   */
  const handleSearch = () => {
    if (query.trim()) {
      router.push(
        `/clients?page=1&limit=10&search=${encodeURIComponent(query)}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-row   border rounded-2xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#43553b"
        className="px-1"
      >
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar cliente..."
        spellCheck="false"
        className="px-2 focus:outline-none focus:bg-amber-50 focus:text-black  rounded-l-xl w-64"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="border-l border-gray-300 px-2 rounded-r-2xl hover:bg-gray-200 hover:transition-colors cursor-pointer hover:text-black"
      >
        Buscar
      </button>
    </div>
  );
}
