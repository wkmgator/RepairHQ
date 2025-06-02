"use client"

import { useState, useEffect } from "react"
import { usageTrackingService, type UsageReport } from "@/lib/usage-tracking-service"
import { useAuth } from "@/lib/auth-context"

export function useUsageTracking() {
  const { user } = useAuth()
  const [usageReport, setUsageReport] = useState<UsageReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUsageReport() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const report = await usageTrackingService.getUserUsageReport(user.id)
        setUsageReport(report)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch usage report"))
      } finally {
        setLoading(false)
      }
    }

    fetchUsageReport()
  }, [user])

  const trackFeatureUsage = async (featureName: string) => {
    if (!user) return
    await usageTrackingService.recordFeatureUsage(user.id, featureName)
  }

  const checkFeatureAvailability = async (featureName: string): Promise<boolean> => {
    if (!user) return false
    return await usageTrackingService.isFeatureAvailable(user.id, featureName)
  }

  const getRecommendedPlan = async (): Promise<string | null> => {
    if (!user) return null
    return await usageTrackingService.getRecommendedPlan(user.id)
  }

  return {
    usageReport,
    loading,
    error,
    trackFeatureUsage,
    checkFeatureAvailability,
    getRecommendedPlan,
  }
}
