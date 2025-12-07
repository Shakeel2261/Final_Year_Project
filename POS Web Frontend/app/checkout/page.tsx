"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-store";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CreditCard,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
              <p className="text-slate-600 mt-1">
                Complete your order with confidence
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
                <CreditCard className="h-16 w-16 text-slate-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-700">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Add some items to your cart before proceeding to checkout.
                </p>
              </div>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Customer Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Payment Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder="123"
                      />
                    </div>
                  </div>
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
                  {items.map((i) => (
                    <div
                      key={i.productId}
                      className="flex items-center justify-between py-2 border-b border-slate-200"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-800">
                          {i.product.name}
                        </span>
                        <div className="text-xs text-slate-600">
                          Qty: {i.quantity}
                        </div>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(i.product.price * i.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tax</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(subtotal * 0.08)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-slate-200">
                      <span className="text-lg font-semibold text-slate-800">
                        Total
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(subtotal * 1.08)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Place Order (Demo)
                  </Button>

                  <Link href="/products" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-2 hover:bg-slate-50 transition-all duration-200"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Your payment information is encrypted and secure.
                  </p>
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
