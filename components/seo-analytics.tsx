"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export default function SEOAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      // Track page views
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_path: pathname,
      })

      // Track vertical landing page views
      if (pathname.startsWith("/repair/")) {
        const vertical = pathname.split("/repair/")[1]
        window.gtag("event", "vertical_page_view", {
          vertical_type: vertical,
          page_path: pathname,
        })
      }

      // Track pricing page views
      if (pathname === "/pricing") {
        window.gtag("event", "pricing_page_view", {
          page_path: pathname,
        })
      }
    }
  }, [pathname])

  return null
}
