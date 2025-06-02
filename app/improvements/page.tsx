"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedInventoryTracking } from "@/components/advanced-inventory-tracking"
import { CustomerLoyaltyProgram } from "@/components/customer-loyalty-program"
import { AutomatedWorkflowEngine } from "@/components/automated-workflow-engine"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { MultiLocationManagement } from "@/components/multi-location-management"
import { MobileAppIntegration } from "@/components/mobile-app-integration"
import { AIPoweredDiagnostics } from "@/components/ai-powered-diagnostics"

export default function ImprovementsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Improvements</h2>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="ai">AI Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <AdvancedInventoryTracking />
        </TabsContent>

        <TabsContent value="loyalty">
          <CustomerLoyaltyProgram />
        </TabsContent>

        <TabsContent value="workflow">
          <AutomatedWorkflowEngine />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="locations">
          <MultiLocationManagement />
        </TabsContent>

        <TabsContent value="mobile">
          <MobileAppIntegration />
        </TabsContent>

        <TabsContent value="ai">
          <AIPoweredDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
