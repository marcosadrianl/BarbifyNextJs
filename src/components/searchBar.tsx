"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 🚨 clave
    handleSearch();
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <input type="search" autoComplete="off" className="hidden" />
      <div className="flex flex-row items-center border border-gray-900/50 rounded-2xl mx-4">
        <Search className="w-4 h-4 m-1" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente..."
          spellCheck={false}
          autoComplete="off"
          className="px-2 focus:outline-none focus:bg-amber-50 focus:text-black rounded-l-xl w-64"
        />
        <button
          type="submit" // ✅ ahora sí
          className="border-l border-gray-300 px-2 rounded-r-2xl hover:bg-gray-200 hover:text-black"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
