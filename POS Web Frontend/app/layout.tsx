import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { StripeProvider } from "@/components/stripe-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "POS Web Store",
  description: "Point of Sale Web Store",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ReduxProvider>
            <StripeProvider>{children}</StripeProvider>
          </ReduxProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
