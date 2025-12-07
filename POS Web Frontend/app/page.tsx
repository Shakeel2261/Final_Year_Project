import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { categories, products } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap, Heart } from "lucide-react";

export default function HomePage() {
  const trending = products.filter((p) => p.trending);
  const featuredCategories = categories.slice(0, 5);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700">
                  Premium Mobile Accessories
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Accessories that
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  power your mobile life
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Discover premium cases, chargers, cables, audio gear and
                more—carefully curated to keep you connected and protected.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Shop All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 hover:bg-white/80 transition-all duration-300 hover:scale-105"
                >
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                Premium Quality
              </h3>
              <p className="text-slate-600">
                All products are carefully selected for durability and
                performance
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                Fast Shipping
              </h3>
              <p className="text-slate-600">
                Quick delivery to your doorstep with secure packaging
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                Customer Love
              </h3>
              <p className="text-slate-600">
                Join thousands of satisfied customers worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Featured Categories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our most popular categories and find exactly what you need
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((c) => (
              <Link key={c.id} href={`/products?category=${c.slug}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-3 bg-white/80 backdrop-blur-sm border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {c.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white/30">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Trending Now
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the most popular products our customers love
            </p>
          </div>

          <ProductGrid products={trending} />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 hover:bg-white/80 transition-all duration-300 hover:scale-105"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
