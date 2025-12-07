import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-store";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

type Props = { params: { slug: string } };

export default function ProductDetailsPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();
  const outOfStock = product.stock <= 0;

  // Client-only add to cart via inline client component
  function AddToCart() {
    "use client";
    const { add } = useCart();
    return (
      <Button
        size="lg"
        disabled={outOfStock}
        onClick={() => add(product.id, 1)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-white/50 py-4">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>
            <span>/</span>
            <a
              href="/products"
              className="hover:text-blue-600 transition-colors"
            >
              Products
            </a>
            <span>/</span>
            <span className="text-slate-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
              />

              {/* Featured/Trending Badge */}
              {(product.featured || product.trending) && (
                <div className="absolute top-6 left-6">
                  <Badge
                    variant={product.featured ? "default" : "secondary"}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg text-sm px-4 py-2"
                  >
                    {product.featured ? "Featured" : "Trending"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-white/80 backdrop-blur-sm border-2 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
              >
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-white/80 backdrop-blur-sm border-2 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(product.price)}
                </span>
                <Badge
                  variant={outOfStock ? "destructive" : "secondary"}
                  className={
                    outOfStock
                      ? "bg-red-100 text-red-700 border-red-200 px-4 py-2"
                      : "bg-green-100 text-green-700 border-green-200 px-4 py-2"
                  }
                >
                  {outOfStock ? "Out of stock" : "In stock"}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-slate-600">(4.8) • 127 reviews</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Premium Quality
                    </h3>
                    <p className="text-sm text-slate-600">Built to last</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Free Shipping
                    </h3>
                    <p className="text-sm text-slate-600">On all orders</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <RotateCcw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">Easy Returns</h3>
                    <p className="text-sm text-slate-600">30-day policy</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Customer Support
                    </h3>
                    <p className="text-sm text-slate-600">24/7 available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCart />

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
