import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiLocationDashboardComplete } from "@/components/multi-location-dashboard-complete"
import { TerritoryManagement } from "@/components/territory-management"
import { FranchiseOnboardingWorkflow } from "@/components/franchise-onboarding-workflow"

export const metadata: Metadata = {
  title: "Multi-Location Management | RepairHQ",
  description: "Comprehensive multi-location and franchise management system",
}

export default function MultiLocationPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Multi-Location Management</h1>
        <p className="text-muted-foreground">
          Centralized management for all your business locations and franchise operations
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="franchise">Franchise</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <MultiLocationDashboardComplete />
        </TabsContent>

        <TabsContent value="territories" className="mt-6">
          <TerritoryManagement />
        </TabsContent>

        <TabsContent value="franchise" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Franchise Management</h3>
            <p className="text-muted-foreground">
              Comprehensive franchise management features are integrated into the main dashboard. Switch to the
              Dashboard tab to access franchise-specific tools.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <FranchiseOnboardingWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  )
}
