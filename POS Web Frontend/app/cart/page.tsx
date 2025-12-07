"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-store";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, update, remove, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Your Shopping Cart
              </h1>
              <p className="text-slate-600 mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="space-y-6">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="h-16 w-16 text-slate-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-700">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Start
                  shopping to fill it up!
                </p>
              </div>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Cart Items
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200">
                        <TableHead className="min-w-[280px] text-slate-700">
                          Product
                        </TableHead>
                        <TableHead className="text-slate-700">Price</TableHead>
                        <TableHead className="text-slate-700">
                          Quantity
                        </TableHead>
                        <TableHead className="text-slate-700">
                          Subtotal
                        </TableHead>
                        <TableHead className="w-24 text-slate-700">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((i) => (
                        <TableRow
                          key={i.productId}
                          className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-200"
                        >
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="relative h-20 w-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden shadow-sm">
                                <Image
                                  src={i.product.imageUrl || "/placeholder.svg"}
                                  alt={i.product.name}
                                  fill
                                  sizes="80px"
                                  className="object-contain"
                                />
                              </div>
                              <div className="space-y-1">
                                <Link
                                  className="font-medium text-slate-800 hover:text-blue-600 transition-colors duration-200"
                                  href={`/products/${i.product.slug}`}
                                >
                                  {i.product.name}
                                </Link>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      i.product.stock > 0
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  ></div>
                                  <span className="text-xs text-slate-600">
                                    {i.product.stock > 0
                                      ? "In stock"
                                      : "Out of stock"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(i.product.price)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(i.quantity)}
                              onValueChange={(val) =>
                                update(i.productId, Number(val))
                              }
                            >
                              <SelectTrigger className="w-20 bg-white border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200">
                                <SelectValue placeholder={i.quantity} />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({
                                  length: Math.max(10, i.product.stock || 1),
                                })
                                  .slice(0, Math.max(1, i.product.stock || 1))
                                  .map((_, idx) => {
                                    const v = idx + 1;
                                    return (
                                      <SelectItem key={v} value={String(v)}>
                                        {v}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-lg text-slate-800">
                              {formatCurrency(i.product.price * i.quantity)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(i.productId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(subtotal * 0.08)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4">
                    <span className="text-lg font-semibold text-slate-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(subtotal * 1.08)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href="/products" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-2 hover:bg-slate-50 transition-all duration-200"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
