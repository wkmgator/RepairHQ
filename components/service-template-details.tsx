"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Clock,
  DollarSign,
  PenToolIcon as Tool,
  AlertTriangle,
  FileText,
  CheckCircle,
  Package,
  ListChecks,
  ArrowLeft,
  Wrench,
  ShoppingCart,
  ChevronRight,
} from "lucide-react"
import type { ServiceTemplate, ServiceStep, TemplatePart, ChecklistItem } from "@/lib/service-template-types"

interface ServiceTemplateDetailsProps {
  template: ServiceTemplate
  onBack: () => void
  onApply: (template: ServiceTemplate) => void
}

export function ServiceTemplateDetails({ template, onBack, onApply }: ServiceTemplateDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold flex-1">{template.name}</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-3 mb-2">
            <Badge variant="outline" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {template.estimatedTime} min
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" />${template.estimatedCost.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Tool className="mr-1 h-3 w-3" />
              {template.steps.length} steps
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Package className="mr-1 h-3 w-3" />
              {template.requiredParts.length} parts
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <ListChecks className="mr-1 h-3 w-3" />
              {template.checklistItems.length} checks
            </Badge>
          </div>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Service Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Labor:</span>
                    <span className="font-medium">${template.laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Parts:</span>
                    <span className="font-medium">${template.partsCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Time:</span>
                    <span className="font-medium">{template.estimatedTime} min</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded">
                    <span>Total:</span>
                    <span className="font-medium">${template.estimatedCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Recommended Additional Services</h3>
                <div className="flex flex-wrap gap-2">
                  {template.recommendedServices.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Service Steps Overview</h3>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                  {template.steps.map((step) => (
                    <li key={step.id}>
                      {step.title} ({step.estimatedTime} min)
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="steps">
              <Accordion type="single" collapsible className="w-full">
                {template.steps.map((step, index) => (
                  <StepAccordionItem key={step.id} step={step} index={index} />
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="parts">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Required Parts</h3>
                  <div className="space-y-2">
                    {template.requiredParts
                      .filter((part) => part.isRequired)
                      .map((part) => (
                        <PartItem key={part.id} part={part} />
                      ))}
                  </div>
                </div>

                {template.requiredParts.some((part) => !part.isRequired) && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Optional Parts</h3>
                    <div className="space-y-2">
                      {template.requiredParts
                        .filter((part) => !part.isRequired)
                        .map((part) => (
                          <PartItem key={part.id} part={part} />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="checklist">
              <div className="space-y-4">
                {["inspection", "verification", "measurement", "customer_approval"].map((type) => {
                  const items = template.checklistItems.filter((item) => item.type === type)
                  if (items.length === 0) return null

                  return (
                    <div key={type}>
                      <h3 className="text-sm font-medium mb-2 capitalize">{type.replace("_", " ")} Items</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <ChecklistItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => onApply(template)}>
            Apply Template to Ticket
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface StepAccordionItemProps {
  step: ServiceStep
  index: number
}

function StepAccordionItem({ step, index }: StepAccordionItemProps) {
  return (
    <AccordionItem value={step.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center text-left">
          <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
            {index + 1}
          </div>
          <div>
            <span className="font-medium">{step.title}</span>
            <span className="text-xs text-muted-foreground ml-2">({step.estimatedTime} min)</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-8">
        <div className="space-y-3 text-sm">
          <p>{step.description}</p>

          {step.technicalNotes && (
            <div className="flex items-start">
              <Wrench className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
              <p className="text-blue-700 dark:text-blue-300">{step.technicalNotes}</p>
            </div>
          )}

          {step.warningNotes && (
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
              <p className="text-amber-700 dark:text-amber-300">{step.warningNotes}</p>
            </div>
          )}

          {step.requiredTools && step.requiredTools.length > 0 && (
            <div className="flex items-start">
              <Tool className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Tools: </span>
                {step.requiredTools.join(", ")}
              </p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

interface PartItemProps {
  part: TemplatePart
}

function PartItem({ part }: PartItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center">
        <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
        <div>
          <p className="font-medium text-sm">{part.name}</p>
          <p className="text-xs text-muted-foreground">
            Qty: {part.quantity}
            {part.partNumber && ` • Part #: ${part.partNumber}`}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${part.estimatedCost.toFixed(2)}</p>
        {part.alternatives && part.alternatives.length > 0 && (
          <p className="text-xs text-muted-foreground">Alt: {part.alternatives.join(", ")}</p>
        )}
      </div>
    </div>
  )
}

interface ChecklistItemCardProps {
  item: ChecklistItem
}

function ChecklistItemCard({ item }: ChecklistItemCardProps) {
  const iconMap = {
    inspection: FileText,
    verification: CheckCircle,
    measurement: Tool,
    customer_approval: DollarSign,
  }

  const Icon = iconMap[item.type as keyof typeof iconMap]

  return (
    <div className="flex items-center p-3 border rounded-md">
      <Icon className="h-4 w-4 mr-2 text-gray-500" />
      <div>
        <p className="font-medium text-sm">{item.title}</p>
        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
      </div>
    </div>
  )
}
