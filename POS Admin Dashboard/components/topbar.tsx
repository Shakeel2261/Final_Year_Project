"use client"

import { Input } from "@/components/ui/input"

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        <div className="text-sm text-muted-foreground">Mobile Accessories Shop • Admin</div>
        {/* <Input placeholder="Quick search (UI only)" className="w-64 bg-background" /> */}
      </div>
    </header>
  )
}
