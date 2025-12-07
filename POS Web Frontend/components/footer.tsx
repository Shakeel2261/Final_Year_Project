import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">Mobile Accessories</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your trusted partner for premium mobile accessories. Quality
              products that enhance your mobile experience.
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full p-2 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full p-2 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full p-2 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                All Products
              </Link>
              <Link
                href="/products?category=cases"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Phone Cases
              </Link>
              <Link
                href="/products?category=chargers"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Chargers
              </Link>
              <Link
                href="/products?category=headphones"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Headphones
              </Link>
              <Link
                href="/products?category=power-banks"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Power Banks
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/cart"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Shopping Cart
              </Link>
              <Link
                href="/checkout"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Checkout
              </Link>
              <Link
                href="#"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Shipping Info
              </Link>
              <Link
                href="#"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="#"
                className="block text-slate-300 hover:text-white transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">support@mobileaccessories.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">123 Tech Street, Digital City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-slate-300 text-sm">
                Get the latest deals and new product announcements.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 flex-1 md:w-64"
              />
              <Button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Mobile Accessories Shop. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500" /> using Next.js
              + shadcn/ui
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
