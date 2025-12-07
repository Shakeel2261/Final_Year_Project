"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { products as allProducts, categories } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { ProductList } from "@/components/product-list";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, X, Grid, List } from "lucide-react";

export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const category = params.get("category") || "";
  const q = (params.get("q") || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesQ = q ? p.name.toLowerCase().includes(q) : true;
      return matchesCategory && matchesQ;
    });
  }, [category, q]);

  const clearFilters = () => {
    const next = new URLSearchParams(params.toString());
    next.delete("category");
    next.delete("q");
    router.push(`/products?${next.toString()}`);
  };

  const activeCategoryName = category
    ? categories.find((c) => c.slug === category)?.name
    : "All";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {q
                  ? `Search Results for "${q}"`
                  : activeCategoryName + " Products"}
              </h1>
              <p className="text-slate-600">
                {filtered.length}{" "}
                {filtered.length === 1 ? "product" : "products"} found
              </p>
            </div>

            {(category || q) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="bg-white/80 backdrop-blur-sm border-2 hover:bg-white transition-all duration-200 hover:scale-105"
              >
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-700">
                    Filter by Category:
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={category === "" ? "default" : "outline"}
                    onClick={() => {
                      const next = new URLSearchParams(params.toString());
                      next.delete("category");
                      router.push(`/products?${next.toString()}`);
                    }}
                    className={
                      category === ""
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                        : "bg-white/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                    }
                  >
                    All
                  </Button>
                  {categories.map((c) => (
                    <Button
                      key={c.id}
                      size="sm"
                      variant={category === c.slug ? "default" : "outline"}
                      onClick={() => {
                        const next = new URLSearchParams(params.toString());
                        next.set("category", c.slug);
                        router.push(`/products?${next.toString()}`);
                      }}
                      className={
                        category === c.slug
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                          : "bg-white/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                      }
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">View:</span>
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                      : "bg-white/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                      : "bg-white/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Display */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          {filtered.length > 0 ? (
            <>
              {/* View Mode Toggle Info */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    Showing {filtered.length}{" "}
                    {filtered.length === 1 ? "product" : "products"} in{" "}
                    {viewMode} view
                  </span>
                </div>
              </div>

              {/* Products Display */}
              {viewMode === "grid" ? (
                <ProductGrid products={filtered} />
              ) : (
                <ProductList products={filtered} />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto">
                  <Filter className="h-12 w-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">
                  No products found
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all products to
                  find what you're looking for.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  View All Products
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
