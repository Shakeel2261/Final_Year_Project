"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatCurrency, truncate } from "@/lib/format";
import { useCart } from "./cart-store";
import { ShoppingCart, Eye, Heart } from "lucide-react";

export function ProductList({ products }: { products: Product[] }) {
  const { add } = useCart();

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const outOfStock = product.stock <= 0;

        return (
          <Card
            key={product.id}
            className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="relative w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Featured/Trending Badge */}
                {(product.featured || product.trending) && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={product.featured ? "default" : "secondary"}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-md text-xs px-2 py-1"
                    >
                      {product.featured ? "Featured" : "Trending"}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <CardTitle className="text-xl leading-tight text-balance group-hover:text-blue-600 transition-colors duration-200">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </CardTitle>

                    <p className="text-slate-600 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        {formatCurrency(product.price)}
                      </span>
                      <Badge
                        variant={outOfStock ? "destructive" : "secondary"}
                        className={
                          outOfStock
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        }
                      >
                        {outOfStock ? "Out of stock" : "In stock"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full p-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full p-2 bg-white/80 backdrop-blur-sm border-2 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => add(product.id, 1)}
                      disabled={outOfStock}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
