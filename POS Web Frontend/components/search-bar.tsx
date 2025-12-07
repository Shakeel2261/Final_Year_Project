"use client";
import { useSearchParams, useRouter } from "next/navigation";
import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    router.push(`/products?${next.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 w-full max-w-md"
    >
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          id="search"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white border-slate-200 rounded-full shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200 placeholder:text-slate-400"
        />
      </div>
      <Button
        type="submit"
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
      >
        Search
      </Button>
    </form>
  );
}
