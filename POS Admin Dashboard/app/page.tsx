<<<<<<< HEAD
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/overview");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-dvh grid place-items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            POS Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage products, orders, customers, transactions, reports, and ledgers.
        </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="px-8">
              Sign Up
            </Button>
        </Link>
        </div>
      </div>
    </main>
  );
=======
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-balance">POS Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Go to the dashboard to manage products, orders, customers, transactions, reports, and ledgers.
        </p>
        <Link
          href="/overview"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  )
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
}
