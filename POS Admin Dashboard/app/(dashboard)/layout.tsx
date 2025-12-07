import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
  )
}
