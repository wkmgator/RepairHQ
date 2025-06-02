"use client" // This layout now needs to be a client component for state

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation" // To close sidebar on navigation
// getTranslations and getDirection are server-side, so metadata generation needs to be handled differently
// For simplicity in this refactor, we'll remove server-side metadata generation from this client component.
// You'd typically move metadata to a parent server component or handle it via `generateMetadata` in page.tsx files.

// export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
// const t = await getTranslations({ locale, namespace: "Metadata" })
// return {
//   title: `${t("dashboard")} | RepairHQ`,
//   description: t("dashboardDescription"),
// }
// }

export default function DashboardLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar()
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = "" // Cleanup on unmount
    }
  }, [isMobileSidebarOpen])

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 dark:bg-muted/10">
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
          className="lg:flex" // Default classes for large screens
        />
        <div className="flex flex-1 flex-col lg:ml-64">
          {" "}
          {/* Adjust ml for fixed sidebar width */}
          <Header
            user={{
              name: "John Doe",
              email: "john@example.com",
            }}
            onToggleSidebar={toggleMobileSidebar}
            isSidebarOpen={isMobileSidebarOpen}
          />
          <main className="flex-1 p-4 pt-6 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
