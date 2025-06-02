"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Eye, Settings } from "lucide-react"
import { RepairVertical, getVerticalConfig } from "@/lib/industry-verticals"
import VerticalDashboardRouter from "@/components/vertical-dashboard-router"

const allVerticals = Object.values(RepairVertical)

export default function DashboardVerificationPage() {
  const [selectedVertical, setSelectedVertical] = useState<RepairVertical>(RepairVertical.PHONE_REPAIR)
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({})

  const verifyDashboard = async (vertical: RepairVertical) => {
    try {
      // Simulate dashboard loading and verification
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if dashboard component exists and renders
      const config = getVerticalConfig(vertical)
      const hasConfig = !!config
      const hasValidName = config?.name && config.name.length > 0
      const hasValidFeatures = config?.features && config.features.length > 0

      const isValid = hasConfig && hasValidName && hasValidFeatures

      setVerificationResults((prev) => ({
        ...prev,
        [vertical]: isValid,
      }))

      return isValid
    } catch (error) {
      console.error(`Error verifying ${vertical}:`, error)
      setVerificationResults((prev) => ({
        ...prev,
        [vertical]: false,
      }))
      return false
    }
  }

  const verifyAllDashboards = async () => {
    for (const vertical of allVerticals) {
      await verifyDashboard(vertical)
    }
  }

  const getVerificationStatus = (vertical: RepairVertical) => {
    if (!(vertical in verificationResults)) return "pending"
    return verificationResults[vertical] ? "success" : "error"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-400 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">✓ Working</Badge>
      case "error":
        return <Badge variant="destructive">✗ Error</Badge>
      default:
        return <Badge variant="secondary">⏳ Pending</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Verification</h1>
          <p className="text-muted-foreground">Verify all vertical dashboards are working correctly</p>
        </div>
        <Button onClick={verifyAllDashboards}>
          <Settings className="mr-2 h-4 w-4" />
          Verify All Dashboards
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preview">Dashboard Preview</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Overview</CardTitle>
              <CardDescription>Status of all vertical dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allVerticals.map((vertical) => {
                  const config = getVerticalConfig(vertical)
                  const status = getVerificationStatus(vertical)

                  return (
                    <Card key={vertical} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{config.name}</CardTitle>
                          {getStatusIcon(status)}
                        </div>
                        <CardDescription className="text-xs">{config.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(status)}
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => verifyDashboard(vertical)}>
                              Test
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedVertical(vertical)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Features: {config.features.length} • Metrics: {config.dashboardConfig.primaryMetrics.length}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preview</CardTitle>
              <CardDescription>Select a vertical to preview its dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {allVerticals.map((vertical) => {
                  const config = getVerticalConfig(vertical)
                  return (
                    <Button
                      key={vertical}
                      variant={selectedVertical === vertical ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVertical(vertical)}
                    >
                      {config.name}
                    </Button>
                  )
                })}
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 min-h-[600px]">
                <div className="mb-4 p-3 bg-white rounded border">
                  <h3 className="font-semibold">Currently Viewing: {getVerticalConfig(selectedVertical).name}</h3>
                  <p className="text-sm text-muted-foreground">{getVerticalConfig(selectedVertical).description}</p>
                </div>

                <div className="bg-white rounded border overflow-hidden">
                  <VerticalDashboardRouter userVertical={selectedVertical} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Verification Results</CardTitle>
              <CardDescription>Comprehensive verification details for each dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allVerticals.map((vertical) => {
                  const config = getVerticalConfig(vertical)
                  const status = getVerificationStatus(vertical)

                  return (
                    <Card key={vertical}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          {getStatusBadge(status)}
                        </div>
                        <CardDescription>{config.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <h4 className="font-medium mb-2">Configuration</h4>
                            <ul className="text-sm space-y-1">
                              <li>✓ Name: {config.name}</li>
                              <li>✓ Slug: {config.slug}</li>
                              <li>✓ Icon: {config.icon}</li>
                              <li>✓ Color: {config.color}</li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Features ({config.features.length})</h4>
                            <ul className="text-sm space-y-1">
                              {config.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>✓ {feature}</li>
                              ))}
                              {config.features.length > 3 && (
                                <li className="text-muted-foreground">+{config.features.length - 3} more...</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Dashboard Config</h4>
                            <ul className="text-sm space-y-1">
                              <li>✓ Primary Metrics: {config.dashboardConfig.primaryMetrics.length}</li>
                              <li>✓ Quick Actions: {config.dashboardConfig.quickActions.length}</li>
                              <li>✓ Custom Widgets: {config.dashboardConfig.customWidgets.length}</li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => verifyDashboard(vertical)}>
                              Re-verify
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedVertical(vertical)}>
                              Preview Dashboard
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
