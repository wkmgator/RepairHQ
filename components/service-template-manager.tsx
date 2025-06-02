"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ServiceTemplate } from "@/lib/service-template-types"
import { type RepairIndustry, getIndustryConfig } from "@/lib/industry-config"
import { ServiceTemplateSelector } from "@/components/service-template-selector"
import { ServiceTemplateDetails } from "@/components/service-template-details"
import { useToast } from "@/components/ui/use-toast"
import { FileText } from "lucide-react"

interface ServiceTemplateManagerProps {
  industry: RepairIndustry
  onApplyTemplate: (template: ServiceTemplate) => void
}

export function ServiceTemplateManager({ industry, onApplyTemplate }: ServiceTemplateManagerProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"browse" | "details">("browse")
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null)

  const industryConfig = getIndustryConfig(industry)

  const handleSelectTemplate = (template: ServiceTemplate) => {
    setSelectedTemplate(template)
    setActiveTab("details")
  }

  const handleBack = () => {
    setActiveTab("browse")
  }

  const handleApplyTemplate = (template: ServiceTemplate) => {
    onApplyTemplate(template)
    toast({
      title: "Template Applied",
      description: `${template.name} has been applied to the ticket.`,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Service Templates
        </CardTitle>
        <CardDescription>Pre-configured service templates for {industryConfig.name}</CardDescription>
      </CardHeader>
      <CardContent>
        {activeTab === "browse" && <ServiceTemplateSelector industry={industry} onSelect={handleSelectTemplate} />}

        {activeTab === "details" && selectedTemplate && (
          <ServiceTemplateDetails template={selectedTemplate} onBack={handleBack} onApply={handleApplyTemplate} />
        )}
      </CardContent>
    </Card>
  )
}
