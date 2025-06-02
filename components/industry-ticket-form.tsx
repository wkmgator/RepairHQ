"use client"

import { Form, FormItem, FormControl, FormMessage, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { RepairIndustry, getIndustryConfig, type IndustryConfig } from "@/lib/industry-config"
import { useRouter } from "next/navigation"
import { nanoid } from "nanoid"
import { createTicketWithDevice } from "@/app/tickets/actions"
import type { ServiceTemplate } from "@/lib/supabase-types"
import { ServiceTemplateManager } from "@/components/service-template-manager"
import { SignaturePad } from "@/components/signature-pad"
import { Loader2, FileSignature } from "lucide-react"
import { z } from "zod"
import { useForm, zodResolver } from "react-hook-form"
import { useState, useEffect } from "react"

const baseTicketSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  device_category: z.string().min(1, "Device category is required"),
  device_name: z.string().min(1, "Device name/model is required"),
  device_serial_number: z.string().optional(),
  device_imei: z.string().optional(),
  device_vin: z.string().optional(),
  device_specific_attributes: z.record(z.any()).optional(),
  issue_description: z.string().min(10, "Issue description must be at least 10 characters"),
  estimated_cost: z.coerce.number().min(0).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  notes: z.string().optional(),
  ticket_custom_fields: z.record(z.any()).optional(),
  service_template_id: z.string().optional(),
  signature_data_url: z.string().optional(),
})

type FormValues = z.infer<typeof baseTicketSchema>

interface IndustryTicketFormProps {
  industry: RepairIndustry
  customerId: string | null
  onSuccess?: (ticketId: string) => void
}

export function IndustryTicketForm({ industry, customerId, onSuccess }: IndustryTicketFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [currentIndustryConfig, setCurrentIndustryConfig] = useState<IndustryConfig | undefined>(
    getIndustryConfig(industry),
  )
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(undefined)

  const form = useForm<FormValues>({
    resolver: zodResolver(baseTicketSchema),
    defaultValues: {
      customer_id: customerId || "",
      device_category: currentIndustryConfig?.deviceTypes?.[0] || "",
      device_name: "",
      device_serial_number: "",
      device_imei: "",
      device_vin: "",
      device_specific_attributes: {},
      issue_description: "",
      estimated_cost: 0,
      priority: "medium",
      notes: "",
      ticket_custom_fields: {},
      service_template_id: "",
      signature_data_url: undefined,
    },
  })

  useEffect(() => {
    const newConfig = getIndustryConfig(industry)
    setCurrentIndustryConfig(newConfig)
    setSignatureDataUrl(undefined)
    form.reset({
      customer_id: customerId || "",
      device_category: newConfig?.deviceTypes?.[0] || "",
      device_name: "",
      device_serial_number: "",
      device_imei: "",
      device_vin: "",
      device_specific_attributes:
        newConfig?.deviceAttributesSchema?.reduce(
          (acc, curr) => {
            acc[curr.name] = curr.type === "boolean" ? false : ""
            return acc
          },
          {} as Record<string, any>,
        ) || {},
      issue_description: "",
      estimated_cost: 0,
      priority: "medium",
      notes: "",
      ticket_custom_fields:
        newConfig?.ticketCustomFieldsSchema?.reduce(
          (acc, curr) => {
            acc[curr.name] = curr.type === "boolean" ? false : ""
            return acc
          },
          {} as Record<string, any>,
        ) || {},
      service_template_id: "",
      signature_data_url: undefined,
    })
  }, [industry, customerId, form])

  const handleApplyTemplate = (template: ServiceTemplate) => {
    form.setValue("service_template_id", template.id)
    if (template.default_description) form.setValue("issue_description", template.default_description)
    if (template.estimated_cost !== null && template.estimated_cost !== undefined) {
      form.setValue("estimated_cost", template.estimated_cost)
    }
    toast({ title: "Template Applied", description: `${template.name} details have been pre-filled.` })
    setActiveTab("service")
  }

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    form.setValue("signature_data_url", dataUrl)
    toast({ title: "Signature Captured", description: "Signature has been saved." })
  }

  const handleSignatureClear = () => {
    setSignatureDataUrl(undefined)
    form.setValue("signature_data_url", undefined)
  }

  const onSubmit = async (data: FormValues) => {
    if (!data.customer_id) {
      toast({ title: "Error", description: "Customer is required.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const ticketNumber = `TK-${nanoid(8).toUpperCase()}`
      const result = await createTicketWithDevice({
        ...data,
        ticket_number: ticketNumber,
        industry_vertical: industry,
        signature_data_url: signatureDataUrl,
      })

      if (result.success && result.ticketId) {
        toast({
          title: "Ticket Created",
          description: `Ticket ${ticketNumber} has been created successfully.`,
        })
        if (onSuccess) {
          onSuccess(result.ticketId)
        } else {
          router.push(`/tickets/${result.ticketId}`)
        }
      } else {
        throw new Error(result.error || "Failed to create ticket.")
      }
    } catch (error: any) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderFormField = (
    fieldSchema:
      | NonNullable<IndustryConfig["deviceAttributesSchema"]>[0]
      | NonNullable<IndustryConfig["ticketCustomFieldsSchema"]>[0],
    formSection: "device_specific_attributes" | "ticket_custom_fields",
  ) => {
    const fieldName = `${formSection}.${fieldSchema.name}` as const
    return (
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName as any}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <Label htmlFor={fieldName}>{fieldSchema.label}</Label>
            {fieldSchema.type === "text" && (
              <Input id={fieldName} {...field} placeholder={`Enter ${fieldSchema.label.toLowerCase()}`} />
            )}
            {fieldSchema.type === "number" && <Input id={fieldName} type="number" {...field} placeholder="0" />}
            {fieldSchema.type === "textarea" && (
              <Textarea id={fieldName} {...field} placeholder={`Details for ${fieldSchema.label.toLowerCase()}`} />
            )}
            {fieldSchema.type === "boolean" && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id={fieldName} checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor={fieldName} className="font-normal">
                  {fieldSchema.label}
                </Label>
              </div>
            )}
            {fieldSchema.type === "select" && (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id={fieldName}>
                    <SelectValue placeholder={`Select ${fieldSchema.label.toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldSchema.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (!currentIndustryConfig) return <p>Loading industry configuration...</p>

  const disclosureTextForIndustry =
    currentIndustryConfig.id === RepairIndustry.AUTO_BODY_REPAIR
      ? "For auto body repairs, you authorize us to operate your vehicle for testing, inspection, or delivery. You acknowledge that estimates are subject to change upon disassembly and discovery of hidden damages. We will notify you of any supplemental charges."
      : undefined

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>New {currentIndustryConfig.name} Ticket</CardTitle>
            <CardDescription>Customer ID: {customerId || "Not selected"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Device Details</TabsTrigger>
                <TabsTrigger value="service">Service Info</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="signature" className="flex items-center">
                  <FileSignature className="mr-2 h-4 w-4" /> Signature
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="device_category"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Device Category</Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentIndustryConfig.deviceTypes?.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="device_name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Device Name/Model</Label>
                      <FormControl>
                        <Input {...field} placeholder="e.g., iPhone 14, Honda Civic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {currentIndustryConfig.requiresSerialNumber && (
                  <FormField
                    control={form.control}
                    name="device_serial_number"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Serial Number</Label>
                        <FormControl>
                          <Input {...field} placeholder="Device Serial Number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentIndustryConfig.requiresIMEI && (
                  <FormField
                    control={form.control}
                    name="device_imei"
                    render={({ field }) => (
                      <FormItem>
                        <Label>IMEI</Label>
                        <FormControl>
                          <Input {...field} placeholder="Device IMEI" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentIndustryConfig.id === RepairIndustry.AUTO_REPAIR ||
                currentIndustryConfig.id === RepairIndustry.AUTO_BODY_REPAIR ? (
                  <FormField
                    control={form.control}
                    name="device_vin"
                    render={({ field }) => (
                      <FormItem>
                        <Label>VIN</Label>
                        <FormControl>
                          <Input {...field} placeholder="Vehicle VIN" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}
                <h4 className="text-md font-semibold pt-2">Specific Device Attributes:</h4>
                {currentIndustryConfig.deviceAttributesSchema?.map((attr) =>
                  renderFormField(attr, "device_specific_attributes"),
                )}
              </TabsContent>

              <TabsContent value="service" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="issue_description"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Issue Description</Label>
                      <FormControl>
                        <Textarea {...field} placeholder="Detailed description of the problem" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimated_cost"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Estimated Cost ($)</Label>
                      <FormControl>
                        <Input type="number" {...field} placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Priority</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Internal Notes</Label>
                      <FormControl>
                        <Textarea {...field} placeholder="Any internal notes for this ticket" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h4 className="text-md font-semibold pt-2">Additional Service Details:</h4>
                {currentIndustryConfig.ticketCustomFieldsSchema?.map((fieldInfo) =>
                  renderFormField(fieldInfo, "ticket_custom_fields"),
                )}
              </TabsContent>

              <TabsContent value="templates" className="pt-4">
                <ServiceTemplateManager industry={industry} onApplyTemplate={handleApplyTemplate} />
              </TabsContent>

              <TabsContent value="signature" className="pt-4">
                <SignaturePad
                  onSave={handleSignatureSave}
                  onClear={handleSignatureClear}
                  disclosureText={disclosureTextForIndustry}
                  disabled={isLoading}
                />
                {signatureDataUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Signature Preview:</p>
                    <img
                      src={signatureDataUrl || "/placeholder.svg"}
                      alt="Customer Signature"
                      className="border rounded-md max-w-xs"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
