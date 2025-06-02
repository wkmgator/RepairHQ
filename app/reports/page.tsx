import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIAnalyticsEngine from "@/components/ai-analytics-engine"
import FinancialReports from "@/components/financial-reports"

export const metadata: Metadata = {
  title: "Reports | RepairHQ",
  description: "Comprehensive business reports and analytics",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and reporting tools</p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <AIAnalyticsEngine />
        </TabsContent>
        <TabsContent value="financial" className="mt-6">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
