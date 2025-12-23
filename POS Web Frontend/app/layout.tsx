<<<<<<< HEAD
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "POS Web Store",
  description: "Point of Sale Web Store",
  generator: "v0.app",
};
=======
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

export default function RootLayout({
  children,
}: Readonly<{
<<<<<<< HEAD
  children: React.ReactNode;
=======
  children: React.ReactNode
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
<<<<<<< HEAD
          <ReduxProvider>{children}</ReduxProvider>
=======
          {children}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
          <Analytics />
        </Suspense>
      </body>
    </html>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
}
