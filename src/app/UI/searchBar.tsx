"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

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
    <div className="   border rounded-3xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar cliente..."
        className="px-2 focus:outline-none focus:bg-amber-50 focus:text-black  rounded-l-3xl w-64"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="border-l border-gray-300 px-2 rounded-r-3xl hover:bg-gray-200 hover:transition-colors cursor-pointer hover:text-black"
      >
        Buscar
      </button>
    </div>
  );
}
