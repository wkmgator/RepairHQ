"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { type RepairIndustry, getIndustryConfig, type IndustryConfig } from "@/lib/industry-config"
import type { ServiceTemplate } from "@/lib/service-template-types"
import { ServiceTemplateManager } from "@/components/service-template-manager"
import { useRouter } from "next/navigation"
import { nanoid } from "nanoid"
import { FileText, Car, Clipboard } from "lucide-react"

interface AutomotiveTicketFormProps {
  industry: RepairIndustry
  customerId?: string
  onSuccess?: (ticketId: string) => void
}

export function AutomotiveTicketForm({ industry, customerId, onSuccess }: AutomotiveTicketFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("vehicle")
  const [industryConfig, setIndustryConfig] = useState<IndustryConfig>(getIndustryConfig(industry))
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    customer_id: customerId || "",
    ticket_number: `TK-${nanoid(8).toUpperCase()}`,
    vehicle_type: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    license_plate: "",
    mileage: "",
    issue_description: "",
    estimated_cost: "",
    priority: "medium",
    notes: "",
    // Template-related fields
    service_template_id: "",
    service_name: "",
    service_steps: [] as any[],
    parts_needed: [] as any[],
    checklist_items: [] as any[],
  })

  // Custom fields state
  const [customFields, setCustomFields] = useState<Record<string, any>>({})

  useEffect(() => {
    // Update industry config when industry changes
    setIndustryConfig(getIndustryConfig(industry))

    // Reset form with appropriate defaults for this industry
    const config = getIndustryConfig(industry)

    // Initialize custom fields
    const initialCustomFields: Record<string, any> = {}
    config.customFields.forEach((field) => {
      initialCustomFields[field.name] = field.type === "checkbox" ? false : ""
    })

    setCustomFields(initialCustomFields)

    // Set vehicle type default if available
    if (config.deviceTypes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        vehicle_type: config.deviceTypes[0],
      }))
    }
  }, [industry])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomFieldChange = (field: string, value: any) => {
    setCustomFields((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApplyTemplate = (template: ServiceTemplate) => {
    setSelectedTemplate(template)

    // Update form data with template information
    setFormData((prev) => ({
      ...prev,
      service_template_id: template.id,
      service_name: template.name,
      estimated_cost: template.estimatedCost.toString(),
      service_steps: template.steps,
      parts_needed: template.requiredParts,
      checklist_items: template.checklistItems,
    }))

    // Switch to the service tab
    setActiveTab("service")

    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to this ticket.`,
    })
  }

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ["vehicle_type", "make", "model", "year", "issue_description"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    // Check required custom fields
    const requiredCustomFields = industryConfig.customFields
      .filter((field) => field.required)
      .map((field) => field.name)

    const missingCustomFields = requiredCustomFields.filter((field) => !customFields[field])

    if (missingFields.length > 0 || missingCustomFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, this would save to your database
      // const response = await createTicket({
      //   ...formData,
      //   custom_fields: customFields,
      //   industry: industry
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Ticket Created",
        description: `Ticket ${formData.ticket_number} has been created successfully.`,
      })

      if (onSuccess) {
        onSuccess(formData.ticket_number)
      } else {
        // Navigate to the ticket page
        router.push(`/tickets/${formData.ticket_number}`)
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New {industryConfig.name} Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicle" className="flex items-center">
                <Car className="mr-2 h-4 w-4" />
                Vehicle Details
              </TabsTrigger>
              <TabsTrigger value="service" className="flex items-center">
                <Clipboard className="mr-2 h-4 w-4" />
                Service Details
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) => handleInputChange("vehicle_type", value)}
                  >
                    <SelectTrigger id="vehicle_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryConfig.deviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    placeholder="e.g., Toyota"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="e.g., Camry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="e.g., 2022"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vin">VIN (Optional)</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    placeholder="Vehicle Identification Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_plate">License Plate (Optional)</Label>
                  <Input
                    id="license_plate"
                    value={formData.license_plate}
                    onChange={(e) => handleInputChange("license_plate", e.target.value)}
                    placeholder="License Plate Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                    placeholder="Current Mileage"
                  />
                </div>

                {/* Custom fields specific to this industry */}
                {industryConfig.customFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    {field.type === "checkbox" ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field.name}
                          checked={!!customFields[field.name]}
                          onCheckedChange={(checked) => handleCustomFieldChange(field.name, !!checked)}
                        />
                        <Label htmlFor={field.name}>{field.label}</Label>
                      </div>
                    ) : field.type === "select" ? (
                      <>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Select
                          value={customFields[field.name] || ""}
                          onValueChange={(value) => handleCustomFieldChange(field.name, value)}
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        <Input
                          id={field.name}
                          type={field.type}
                          value={customFields[field.name] || ""}
                          onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="service" className="space-y-4 pt-4">
              {selectedTemplate && (
                <Card className="bg-muted/40 mb-4">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Applied Template</h3>
                        <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("templates")}>
                        Change Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="issue_description">Issue Description</Label>
                <Textarea
                  id="issue_description"
                  value={formData.issue_description}
                  onChange={(e) => handleInputChange("issue_description", e.target.value)}
                  placeholder="Describe the issue in detail"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => handleInputChange("estimated_cost", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information or special requests"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="templates" className="pt-4">
              <ServiceTemplateManager industry={industry} onApplyTemplate={handleApplyTemplate} />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between">
            {activeTab !== "templates" && (
              <Button variant="default" className="w-full" size="lg" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating Ticket..." : "Create Repair Ticket"}
              </Button>
            )}
            {activeTab === "templates" && (
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("service")}>
                Back to Service Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
