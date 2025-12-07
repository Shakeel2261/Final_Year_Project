"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { SearchBar } from "./search-bar";
import { ShoppingCart, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-store";

export function Navbar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const { count } = useCart();

  const activeCategory = params.get("category") || "";

  const onCategoryClick = (slug?: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("category", slug);
    else next.delete("category");
    router.push(`/products?${next.toString()}`);
  };

  return (
    <header className="w-full bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Mobile Accessories
            </span>
          </Link>

          {/* <nav className="hidden lg:flex items-center gap-1">
            <Button
              variant={
                activeCategory === "" && pathname?.startsWith("/products")
                  ? "default"
                  : "ghost"
              }
              size="sm"
              onClick={() => onCategoryClick(undefined)}
              className="rounded-full px-4 py-2 transition-all duration-200 hover:scale-105"
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={activeCategory === c.slug ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryClick(c.slug)}
                className="rounded-full px-4 py-2 transition-all duration-200 hover:scale-105 hover:bg-slate-100"
              >
                {c.name}
              </Button>
            ))}
          </nav> */}
        </div>

        <div className="flex-1 hidden md:flex justify-center max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="lg:hidden text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Browse
          </Link>

          <Link href="/cart" className="relative group" aria-label="Cart">
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-110">
              <ShoppingCart className="h-5 w-5 text-slate-700" />
            </div>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <SearchBar />
      </div>
    </header>
  );
}
