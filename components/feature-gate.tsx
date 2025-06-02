"use client"

import { type ReactNode, useState, useEffect } from "react"
import { useUsageTracking } from "@/hooks/use-usage-tracking"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureGateProps {
  featureName: string
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureGate({ featureName, children, fallback }: FeatureGateProps) {
  const { checkFeatureAvailability, trackFeatureUsage } = useUsageTracking()
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAvailability = async () => {
      setIsLoading(true)
      const available = await checkFeatureAvailability(featureName)
      setIsAvailable(available)
      setIsLoading(false)
    }

    checkAvailability()
  }, [featureName, checkFeatureAvailability])

  useEffect(() => {
    if (isAvailable) {
      // Track feature usage when the component mounts and the feature is available
      trackFeatureUsage(featureName)
    }
  }, [isAvailable, featureName, trackFeatureUsage])

  if (isLoading) {
    return <div className="animate-pulse h-24 bg-muted rounded-md"></div>
  }

  if (isAvailable === false) {
    return (
      fallback || (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feature Not Available</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>The {featureName.replace(/_/g, " ")} feature is not available in your current plan.</p>
            <div className="mt-2">
              <Link href="/settings/billing">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
