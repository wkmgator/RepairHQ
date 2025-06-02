"use client"

import { useState, useEffect } from "react"
import { useUsageTracking } from "@/hooks/use-usage-tracking"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Plan } from "@/lib/supabase-types"

export function PlanUpgradeRecommendation() {
  const { usageReport, loading: usageLoading } = useUsageTracking()
  const { userProfile } = useAuth()
  const [recommendedPlan, setRecommendedPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRecommendedPlan = async () => {
      if (!usageReport || !userProfile?.plan) return

      try {
        setLoading(true)
        
        // Only proceed if the user is over limit or approaching limits
        if (!usageReport.isOverLimit && usageReport.warnings.length === 0) {
          setLoading(false)
          return
        }

        const { getRecommendedPlan } = useUsageTracking()
        const planName = await getRecommendedPlan()
        
        if (!planName || planName === userProfile.plan) {
          setLoading(false)
          return
        }

        // Get plan details
        const supabase = createClient()
        const { data: planDetails } = await supabase
          .from("plans")
          .select("*")
          .eq("name", planName)
          .single<Plan>()

        if (planDetails) {
          setRecommendedPlan(planDetails)
        }
      } catch (error) {
        console.error("Error getting recommended plan:", error)
      } finally {
        setLoading(false)
      }
    }

    getRecommendedPlan()
  }, [usageReport, userProfile])

  if (loading || usageLoading || !recommendedPlan) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          Recommended Plan Upgrade
        </CardTitle>
        <CardDescription>
          Based on your current usage, we recommend upgrading to a higher plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Current Plan</div>
              <div className="text-lg font-bold">
                {userProfile?.plan?.charAt(0).toUpperCase() + userProfile?.plan?.slice(1)}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Recommended Plan</div>
              <div className="text-lg font-bold text-primary">
                {recommendedPlan.display_name}
              </div>
            </div>
          </div>

          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Why Upgrade?</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {usageReport.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="font-medium">Benefits of upgrading:</div>
            <ul className="list-disc pl-5 space-y-1">
              {recommendedPlan.max_customers && (
                <li>Increase customer limit to {recommendedPlan.max_customers.toLocaleString()}</li>
              )}
              {recommendedPlan.max_inventory_items && (
                <li>Increase inventory limit to {recommendedPlan.max_inventory_items.toLocaleString()} items</li>
              )}
              {recommendedPlan.max_users && (
                <li>\
