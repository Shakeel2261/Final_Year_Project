<<<<<<< HEAD
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

=======
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex min-h-dvh flex-col">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
}
