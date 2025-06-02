"use client"

import { useState, useEffect } from "react"
import { useUsageTracking } from "@/hooks/use-usage-tracking"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Users, Package, FileText, Store, Activity, Database, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function UsageDashboard() {
  const { usageReport, loading, error } = useUsageTracking()
  const { userProfile } = useAuth()
  const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null)

  const { getRecommendedPlan } = useUsageTracking()

  useEffect(() => {
    const checkRecommendedPlan = async () => {
      if (usageReport?.isOverLimit) {
        const plan = await getRecommendedPlan()
        setRecommendedPlan(plan)
      }
    }

    checkRecommendedPlan()
  }, [usageReport])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load usage data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (!usageReport) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No usage data available.</AlertDescription>
      </Alert>
    )
  }

  const { metrics, limits, percentages, warnings, isOverLimit } = usageReport

  const formatLimit = (limit: number | null): string => {
    if (limit === null) return "Unlimited"
    return limit.toLocaleString()
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usage Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your usage and plan limits for {userProfile?.business_name || "your business"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">Current Plan:</div>
          <div className="font-medium">{userProfile?.plan?.charAt(0).toUpperCase() + userProfile?.plan?.slice(1)}</div>
        </div>
      </div>

      {isOverLimit && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Plan Limit Exceeded</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>You have exceeded one or more limits of your current plan.</p>
            {recommendedPlan && recommendedPlan !== userProfile?.plan && (
              <p>
                We recommend upgrading to the{" "}
                <strong>{recommendedPlan.charAt(0).toUpperCase() + recommendedPlan.slice(1)}</strong> plan.
              </p>
            )}
            <div className="mt-2">
              <Link href="/settings/billing">
                <Button variant="outline">Upgrade Plan</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && !isOverLimit && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Approaching Plan Limits</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Usage</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Customers Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.customers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxCustomers)} (
                  {limits.maxCustomers !== null
                    ? `${Math.min(percentages.customers || 0, 100).toFixed(1)}%`
                    : "No Limit"}
                  )
                </div>
                {limits.maxCustomers !== null && (
                  <Progress
                    value={Math.min(percentages.customers || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.customers || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Work Orders Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.workOrders.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxWorkOrders)} (
                  {limits.maxWorkOrders !== null
                    ? `${Math.min(percentages.workOrders || 0, 100).toFixed(1)}%`
                    : "No Limit"}
                  )
                </div>
                {limits.maxWorkOrders !== null && (
                  <Progress
                    value={Math.min(percentages.workOrders || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.workOrders || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Inventory Items Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.inventoryItems.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxInventoryItems)} (
                  {limits.maxInventoryItems !== null
                    ? `${Math.min(percentages.inventoryItems || 0, 100).toFixed(1)}%`
                    : "No Limit"}
                  )
                </div>
                {limits.maxInventoryItems !== null && (
                  <Progress
                    value={Math.min(percentages.inventoryItems || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.inventoryItems || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Employees Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.employees.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxEmployees)} (
                  {limits.maxEmployees !== null
                    ? `${Math.min(percentages.employees || 0, 100).toFixed(1)}%`
                    : "No Limit"}
                  )
                </div>
                {limits.maxEmployees !== null && (
                  <Progress
                    value={Math.min(percentages.employees || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.employees || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Stores Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.stores.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxStores)} (
                  {limits.maxStores !== null ? `${Math.min(percentages.stores || 0, 100).toFixed(1)}%` : "No Limit"})
                </div>
                {limits.maxStores !== null && (
                  <Progress
                    value={Math.min(percentages.stores || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.stores || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* API Calls Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.apiCalls.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxApiCalls)} (
                  {limits.maxApiCalls !== null ? `${Math.min(percentages.apiCalls || 0, 100).toFixed(1)}%` : "No Limit"}
                  )
                </div>
                {limits.maxApiCalls !== null && (
                  <Progress
                    value={Math.min(percentages.apiCalls || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.apiCalls || 0)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Storage Card */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.storageUsed.toFixed(2)} MB</div>
                <div className="text-xs text-muted-foreground">
                  of {formatLimit(limits.maxStorage)} MB (
                  {limits.maxStorage !== null ? `${Math.min(percentages.storage || 0, 100).toFixed(1)}%` : "No Limit"})
                </div>
                {limits.maxStorage !== null && (
                  <Progress
                    value={Math.min(percentages.storage || 0, 100)}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(percentages.storage || 0)}
                  />
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Storage includes all files, images, and documents stored in your account.
                </p>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>Features available in your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {limits.allowedFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/settings/billing">
                <Button variant="outline">Manage Plan</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Detailed usage metrics would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage Trends</CardTitle>
              <CardDescription>Track your usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Usage chart would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          {/* Feature usage metrics would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>Track which features you use most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.featureUsage).length > 0 ? (
                  Object.entries(metrics.featureUsage).map(([feature, count]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{feature.replace("feature_", "").replace(/_/g, " ")}</span>
                      </div>
                      <div className="font-medium">{count} uses</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">No feature usage data available yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
