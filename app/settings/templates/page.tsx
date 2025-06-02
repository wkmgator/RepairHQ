"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RepairIndustry, getIndustryConfig } from "@/lib/industry-config"
import { ServiceTemplateManager } from "@/components/service-template-manager"
import { PlusCircle } from "lucide-react"

export default function ServiceTemplatesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<RepairIndustry>(RepairIndustry.AUTO_REPAIR)

  // Get all automotive industries
  const automotiveIndustries = [
    RepairIndustry.AUTO_REPAIR,
    RepairIndustry.MOTORCYCLE_REPAIR,
    RepairIndustry.TIRE_SERVICE,
    RepairIndustry.OIL_CHANGE,
  ]

  const handleApplyTemplate = (template: any) => {
    // In a real implementation, this would do something with the template
    console.log("Template applied:", template)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Service Templates</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Tabs
        defaultValue={selectedIndustry}
        onValueChange={(value) => setSelectedIndustry(value as RepairIndustry)}
        className="space-y-4"
      >
        <TabsList className="mb-4">
          {automotiveIndustries.map((industry) => (
            <TabsTrigger key={industry} value={industry}>
              {getIndustryConfig(industry).name}
            </TabsTrigger>
          ))}
        </TabsList>

        {automotiveIndustries.map((industry) => (
          <TabsContent key={industry} value={industry} className="mt-0">
            <ServiceTemplateManager industry={industry} onApplyTemplate={handleApplyTemplate} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
