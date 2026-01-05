"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createPaymentIntent,
  clearPayment,
} from "@/lib/store/slices/paymentSlice";
import { createOrder } from "@/lib/store/slices/ordersSlice";
import { useAppSelector as useAuthSelector } from "@/lib/store/hooks";
import { StripeProvider } from "@/components/stripe-provider";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Alert, AlertDescription } from "@/components/ui/alert";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, clear } = useCart();
  const {
    paymentIntent,
    loading: paymentLoading,
    error: paymentError,
    status,
  } = useAppSelector((state) => state.payment);
  const { loading: orderLoading } = useAppSelector((state) => state.orders);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = Math.round(subtotal * 1.08 * 100); // Total in cents including tax

  useEffect(() => {
    // Create payment intent when component mounts
    if (items.length > 0 && !paymentIntent) {
      dispatch(createPaymentIntent({ amount: totalAmount, currency: "usd" }));
    }
  }, [dispatch, items.length, paymentIntent, totalAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent: confirmedPayment } =
        await stripe.confirmPayment({
          elements,
          clientSecret: paymentIntent.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
          redirect: "if_required",
        });

      if (error) {
        setIsProcessing(false);
        return;
      }

      if (confirmedPayment?.status === "succeeded") {
        // Create order in backend
        const orderItems = items.map((item) => ({
          productId: item.product._id || item.productId,
          quantity: item.quantity,
          finalPrice: item.product.price || 0,
        }));

        await dispatch(
          createOrder({
            items: orderItems,
            totalAmount: subtotal * 1.08,
            status: "completed",
          })
        ).unwrap();

        // Clear cart and payment
        clear();
        dispatch(clearPayment());

        // Redirect to success page
        router.push("/checkout/success");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  const isLoading =
    paymentLoading || orderLoading || isProcessing || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="checkout-form">
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
              First Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.firstName}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, firstName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.lastName}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, lastName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter your last name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                required
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
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
              Street Address *
            </label>
            <input
              type="text"
              required
              value={customerInfo.street}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, street: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter your street address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">City *</label>
              <input
                type="text"
                required
                value={customerInfo.city}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">State *</label>
              <input
                type="text"
                required
                value={customerInfo.state}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, state: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={customerInfo.zip}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, zip: e.target.value })
                }
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

        {paymentError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}

        {paymentIntent ? (
          <div className="space-y-4">
            <PaymentElement />
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </form>
  );
}

function CheckoutSubmitButton() {
  const { loading: paymentLoading, status } = useAppSelector(
    (state) => state.payment
  );
  const { loading: orderLoading } = useAppSelector((state) => state.orders);
  const isProcessing = paymentLoading || orderLoading || status === "processing";

  return (
    <Button
      type="submit"
      form="checkout-form"
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 h-5 w-5" />
          Place Order
        </>
      )}
    </Button>
  );
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && items.length > 0) {
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, items.length, router]);

  // Show login prompt if not authenticated
  if (!isAuthenticated && items.length > 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <section className="mx-auto max-w-2xl px-4 py-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 text-center">
            <Lock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Login Required
            </h2>
            <p className="text-slate-600 mb-6">
              Please login to proceed with checkout and payment.
            </p>
            <Link href="/login?redirect=/checkout">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Go to Login
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

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
          <StripeProvider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                <CheckoutForm />
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
                    <CheckoutSubmitButton />

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
          </StripeProvider>
        )}
      </section>

      <Footer />
    </main>
  );
}
