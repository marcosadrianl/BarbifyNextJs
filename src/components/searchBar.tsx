"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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
    <div className="flex flex-row items-center border border-gray-900/50 rounded-2xl mx-4">
      <Search className="w-4 h-4 m-1" />
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
