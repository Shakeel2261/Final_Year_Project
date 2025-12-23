<<<<<<< HEAD
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "POS Admin Dashboard",
  description: "Point of Sale Admin Dashboard",
  generator: "v0.app",
};
=======
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
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
<<<<<<< HEAD
        <ReduxProvider>{children}</ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
=======
        {children}
        <Analytics />
      </body>
    </html>
  )
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
}
