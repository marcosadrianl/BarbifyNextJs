"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const { theme } = useTheme();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(
        `/clients?page=1&limit=10&search=${encodeURIComponent(query)}`,
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
      <div
        className="flex flex-row items-center rounded-2xl mx-4"
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.border,
          backgroundColor: theme.bg,
        }}
      >
        <Search
          className="w-4 h-4 m-1"
          style={{ color: theme.textSecondary }}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente..."
          spellCheck={false}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="px-2 rounded-l-xl w-64 outline-none"
          style={{
            backgroundColor: focused ? theme.accentBg : "transparent",
            color: theme.textPrimary,
          }}
        />
        <button
          type="submit"
          className="px-2 rounded-r-2xl"
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            borderLeftWidth: 1,
            borderLeftStyle: "solid",
            borderLeftColor: theme.border,
            backgroundColor: btnHover ? theme.accentBg : "transparent",
            color: theme.textPrimary,
          }}
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
