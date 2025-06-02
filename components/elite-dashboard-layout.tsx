"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"
import { OfflineStatusIndicator } from "@/components/offline-status-indicator"
import { UsageWarningIndicator } from "@/components/usage-warning-indicator"
import { ChatWidgetEmbed } from "@/components/chat-widget-embed"

interface EliteDashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    image?: string
  }
}

export function EliteDashboardLayout({ children, user }: EliteDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-background via-background to-muted/20")}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-cosmic-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isMobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        className="hidden lg:flex glass border-r border-border/50"
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        {/* Status Indicators */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          <OfflineStatusIndicator />
          <UsageWarningIndicator />
        </div>

        {/* Page Content */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? window.location.pathname : ""}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidgetEmbed />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
