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
import type { Product } from "@/lib/store/slices/productsSlice";
import { formatCurrency, truncate } from "@/lib/format";
import { useCart } from "./cart-store";
import { ShoppingCart, Eye, Heart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const availableStock = (product.stockQuantity || 0) - (product.reservedStock || 0);
  const outOfStock = availableStock <= 0;
  
  // Map Redux Product to expected format
  const productName = product.productName || "";
  const productSlug = product.slug || product._id;
  const productImage = product.imageUrl || "/placeholder.svg";
  const productDescription = product.description || "";

  return (
    <Card className="group h-full flex flex-col bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <CardHeader className="space-y-3 p-0">
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <Image
            src={productImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full p-2 shadow-lg"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full p-2 shadow-lg"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Badge */}
          {product.status === "active" && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-md"
              >
                Active
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 pb-0">
          <CardTitle className="text-lg leading-tight text-balance group-hover:text-blue-600 transition-colors duration-200">
            <Link
              href={`/products/${productSlug}`}
              className="hover:underline"
            >
              {productName}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-slate-600 flex-1 p-4 pt-2">
        <p className="leading-relaxed">{truncate(productDescription, 100)}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 p-4 pt-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {formatCurrency(product.price || 0)}
          </span>
          <Badge
            variant={outOfStock ? "destructive" : "secondary"}
            className={
              outOfStock
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-green-100 text-green-700 border-green-200"
            }
          >
            {outOfStock ? "Out of stock" : `In stock (${availableStock})`}
          </Badge>
        </div>

        <Button
          size="sm"
          onClick={() => add(product._id, 1)}
          disabled={outOfStock}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
