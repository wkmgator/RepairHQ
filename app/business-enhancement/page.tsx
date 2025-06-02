"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreamlinedOperations } from "@/components/streamlined-operations"
import { RevenueOptimization } from "@/components/revenue-optimization"
import { CustomerExperiencePortal } from "@/components/customer-experience-portal"
import { FranchiseManagement } from "@/components/franchise-management"

export default function BusinessEnhancementPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Business Enhancement Suite</h1>
        <p className="text-xl text-gray-600">
          Advanced tools to streamline operations, increase revenue, improve customer experience, and scale efficiently
        </p>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operations">Streamlined Operations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Optimization</TabsTrigger>
          <TabsTrigger value="customer">Customer Experience</TabsTrigger>
          <TabsTrigger value="franchise">Franchise Management</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <StreamlinedOperations />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueOptimization />
        </TabsContent>

        <TabsContent value="customer">
          <CustomerExperiencePortal />
        </TabsContent>

        <TabsContent value="franchise">
          <FranchiseManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
