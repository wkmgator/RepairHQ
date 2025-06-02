"use client"

import { useState, useEffect } from "react"
import { useUsageTracking } from "@/hooks/use-usage-tracking"
import { AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export function UsageWarningIndicator() {
  const { usageReport, loading } = useUsageTracking()
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (usageReport && !loading) {
      setShowIndicator(usageReport.warnings.length > 0)
    }
  }, [usageReport, loading])

  if (!showIndicator) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/settings/usage" className="relative">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Usage warning: {usageReport?.warnings.length} limit(s) approaching</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
