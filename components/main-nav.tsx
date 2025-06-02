"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Wrench } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/customers",
      label: "Customers",
      active: pathname === "/customers" || pathname.startsWith("/customers/"),
    },
    {
      href: "/inventory",
      label: "Inventory",
      active: pathname === "/inventory" || pathname.startsWith("/inventory/"),
    },
    {
      href: "/work-orders",
      label: "Work Orders",
      active: pathname === "/work-orders" || pathname.startsWith("/work-orders/"),
    },
    {
      href: "/invoices",
      label: "Invoices",
      active: pathname === "/invoices" || pathname.startsWith("/invoices/"),
    },
    {
      href: "/reports",
      label: "Reports",
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
  ]

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl text-foreground">RepairHQ</span>
      </Link>
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
