"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  BookMinus,
  Menu,
  Store,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nav = [
  { href: "/overview", label: "Overview", icon: BarChart3 },
  { href: "/counter-sales", label: "Counter Sales", icon: Store },
  { href: "/products", label: "Catalog", icon: Package },
  { href: "/stock-reports", label: "Stock Reports", icon: TrendingUp },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/transactions", label: "Transactions", icon: CreditCard },
  { href: "/receivables", label: "Receivables", icon: DollarSign },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ledgers", label: "Ledgers", icon: BookMinus },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`border-r border-sidebar-border bg-sidebar text-sidebar-foreground ${
        open ? "w-64" : "w-16"
      } transition-all duration-200 min-h-dvh`}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {open ? "POS Admin" : "POS"}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="px-2 py-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
