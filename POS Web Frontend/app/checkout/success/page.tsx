"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if accessed directly without completing checkout
    const timer = setTimeout(() => {
      // Optional: You can add logic here to check if payment was actually successful
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Success Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Order Confirmed!
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Thank you for your purchase! Your order has been successfully
              placed and payment has been processed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  What's Next?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <span className="font-semibold">Order Confirmed</span>
                  </div>
                  <p className="text-sm text-slate-600 ml-10">
                    We've received your order and payment.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <span className="font-semibold">Processing</span>
                  </div>
                  <p className="text-sm text-slate-600 ml-10">
                    We're preparing your order for shipment.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span className="font-semibold">On The Way</span>
                  </div>
                  <p className="text-sm text-slate-600 ml-10">
                    You'll receive tracking information via email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>

            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 hover:bg-slate-50 px-8 py-6 text-lg transition-all duration-300"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will receive an order confirmation email
              shortly with all the details. If you have any questions, please
              contact our support team.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

