"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { VinLookup } from "@/components/vin-lookup"
import type { VehicleInfo } from "@/lib/vin-decoder"
import {
  generateAutoBodyRepairQuote,
  type AutoBodyDamageInput,
  type AutoBodyRepairQuote,
} from "@/lib/ai-chatbot-service"
import { createAutoBodyTicket, type AutoBodyTicketFormData } from "@/lib/actions/auto-body-ticket-actions"
import {
  Loader2,
  Save,
  CarIcon,
  ShieldCheckIcon,
  UserIcon,
  Brain,
  DollarSign,
  AlertTriangle,
  Palette,
  Hammer,
  ClockIcon,
  UserPlus,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NewCustomerModal } from "./new-customer-modal"
import { getSupabaseClient } from "@/lib/supabase"
import type { Customer } from "@/lib/supabase-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

// Constants for form fields
const commonDamagedParts = [
  "Front Bumper",
  "Rear Bumper",
  "Hood",
  "Trunk Lid",
  "Driver Door",
  "Passenger Door",
  "Front Fender (Left)",
  "Front Fender (Right)",
  "Rear Quarter Panel (Left)",
  "Rear Quarter Panel (Right)",
  "Roof Panel",
  "Windshield",
  "Headlight (Left)",
  "Headlight (Right)",
  "Taillight (Left)",
  "Taillight (Right)",
  "Grille",
  "Side Mirror (Left)",
  "Side Mirror (Right)",
  "Wheel/Rim",
]

const damageSeverities = [
  { value: "minor", label: "Minor (scratches, small dents)" },
  { value: "moderate", label: "Moderate (larger dents, minor part damage)" },
  { value: "severe", label: "Severe (significant part damage, potential structural)" },
]

// Zod schema for validation
const formSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  vin: z.string().length(17, "VIN must be 17 characters").optional().or(z.literal("")),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleYear: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 2),
  vehicleColor: z.string().optional(),
  licensePlate: z.string().optional(),
  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(),
  damageDescription: z.string().min(10, "Please provide a detailed damage description."),
  damagedParts: z.array(z.string()).min(1, "Select at least one damaged part or specify 'Other'."),
  damageSeverity: z.enum(["minor", "moderate", "severe"]),
  paintRequired: z.boolean(),
  notes: z.string().optional(),
})

type AutoBodyTicketFormValues = z.infer<typeof formSchema>

export function AutoBodyTicketForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)
  const [currentAiQuote, setCurrentAiQuote] = useState<AutoBodyRepairQuote | null>(null)
  const [aiQuoteError, setAiQuoteError] = useState<string | null>(null)
  const [lastAiQuoteInput, setLastAiQuoteInput] = useState<AutoBodyDamageInput | null>(null)

  // For "Other Damaged Part"
  const [showOtherPartInput, setShowOtherPartInput] = useState(false)
  const [otherPartName, setOtherPartName] = useState("")

  // For Customer Search/Selection
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([])
  const [isCustomerSearchLoading, setIsCustomerSearchLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false)
  const supabase = getSupabaseClient()

  const form = useForm<AutoBodyTicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleYear: new Date().getFullYear(),
      damageSeverity: "moderate",
      paintRequired: true,
      damagedParts: [],
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid: isFormValid },
    trigger, // To manually trigger validation
  } = form

  // Debounced customer search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (customerSearchTerm.length < 2) {
        setCustomerSearchResults([])
        return
      }
      setIsCustomerSearchLoading(true)
      const searchTerm = `%${customerSearchTerm}%`
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .or(
          `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`,
        )
        .limit(10)

      if (error) {
        console.error("Error searching customers:", error)
        toast({ title: "Error", description: "Could not search customers.", variant: "destructive" })
      } else {
        setCustomerSearchResults(data || [])
      }
      setIsCustomerSearchLoading(false)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [customerSearchTerm, supabase, toast])

  const handleVehicleFound = (vehicleInfo: VehicleInfo) => {
    setValue("vin", vehicleInfo.vin, { shouldValidate: true })
    setValue("vehicleMake", vehicleInfo.make || vehicleInfo.manufacturer || "", { shouldValidate: true })
    setValue("vehicleModel", vehicleInfo.model || "", { shouldValidate: true })
    setValue("vehicleYear", Number.parseInt(vehicleInfo.year, 10) || new Date().getFullYear(), { shouldValidate: true })
  }

  const getCombinedDamagedParts = () => {
    const currentFormValues = getValues()
    const combinedParts = [...(currentFormValues.damagedParts || [])]
    if (showOtherPartInput && otherPartName.trim() !== "") {
      combinedParts.push(otherPartName.trim())
    }
    return combinedParts
  }

  const handleGenerateAiQuote = async () => {
    const currentFormValues = getValues()
    const combinedDamagedParts = getCombinedDamagedParts()

    if (combinedDamagedParts.length === 0) {
      setValue("damagedParts", [], { shouldValidate: true }) // Clear and trigger validation
      trigger("damagedParts") // Manually trigger validation for damagedParts
      toast({
        title: "Missing Information",
        description: "Please select or specify at least one damaged part.",
        variant: "destructive",
      })
      return
    }

    const { vehicleMake, vehicleModel, vehicleYear, damageDescription, damageSeverity, paintRequired } =
      currentFormValues

    if (!vehicleMake || !vehicleModel || !vehicleYear || !damageDescription) {
      setAiQuoteError("Please fill in all vehicle and damage details before generating a quote.")
      toast({
        title: "Missing Information",
        description: "Vehicle and damage details are required for AI quote.",
        variant: "destructive",
      })
      return
    }

    const aiInput: AutoBodyDamageInput = {
      vehicleMake,
      vehicleModel,
      vehicleYear,
      damageDescription,
      damagedParts: combinedDamagedParts,
      damageSeverity: damageSeverity as "minor" | "moderate" | "severe",
      paintRequired: !!paintRequired,
    }

    setIsGeneratingQuote(true)
    setAiQuoteError(null)
    setCurrentAiQuote(null)
    setLastAiQuoteInput(aiInput)

    try {
      const result = await generateAutoBodyRepairQuote(aiInput)
      if (result.confidence < 0.3 && result.notes?.includes("Error generating estimate")) {
        setAiQuoteError(result.notes || "Failed to generate a reliable quote.")
        toast({ title: "AI Quote Generation Issue", description: result.notes, variant: "destructive" })
      } else {
        setCurrentAiQuote(result)
        toast({
          title: "AI Preliminary Quote Generated",
          description: "Review the estimate below. This will be saved with the ticket.",
        })
      }
    } catch (err) {
      console.error("AI Quote generation error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred."
      setAiQuoteError(`Failed to generate quote: ${errorMessage}`)
      toast({ title: "Error", description: `AI Quote generation failed: ${errorMessage}`, variant: "destructive" })
    } finally {
      setIsGeneratingQuote(false)
    }
  }

  const onSubmit = async (data: AutoBodyTicketFormValues) => {
    setIsSubmitting(true)
    const combinedDamagedParts = getCombinedDamagedParts()

    if (combinedDamagedParts.length === 0) {
      setValue("damagedParts", [], { shouldValidate: true })
      trigger("damagedParts")
      toast({
        title: "Validation Error",
        description: "At least one damaged part must be selected or specified in 'Other'.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const ticketPayload: AutoBodyTicketFormData = {
      ...data,
      damagedParts: combinedDamagedParts, // Use combined parts
      aiQuoteInput: lastAiQuoteInput ? { ...lastAiQuoteInput, damagedParts: combinedDamagedParts } : undefined,
      aiGeneratedQuote: currentAiQuote || undefined,
    }

    const result = await createAutoBodyTicket(ticketPayload)
    setIsSubmitting(false)

    if (result.success) {
      toast({ title: "Ticket Created", description: `Auto body ticket #${result.ticketId} created successfully.` })
      router.push(`/tickets/${result.ticketId}`)
    } else {
      toast({ title: "Error", description: result.error || "Failed to create ticket.", variant: "destructive" })
    }
  }

  const handleCustomerCreated = (customer: Customer) => {
    setSelectedCustomer(customer)
    setValue("customerId", customer.id, { shouldValidate: true })
    setCustomerSearchTerm(`${customer.first_name} ${customer.last_name}`)
    setCustomerSearchResults([])
    setIsCustomerPopoverOpen(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Customer Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserIcon className="mr-2 h-5 w-5" /> Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer</Label>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Popover open={isCustomerPopoverOpen} onOpenChange={setIsCustomerPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCustomerPopoverOpen}
                      className="w-full justify-between"
                    >
                      {selectedCustomer
                        ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                        : "Select Customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search customer..."
                        value={customerSearchTerm}
                        onValueChange={setCustomerSearchTerm}
                        isLoading={isCustomerSearchLoading}
                      />
                      <CommandList>
                        <CommandEmpty>{isCustomerSearchLoading ? "Searching..." : "No customer found."}</CommandEmpty>
                        <CommandGroup>
                          {customerSearchResults.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={`${customer.first_name} ${customer.last_name} ${customer.email || ""} ${customer.phone || ""}`}
                              onSelect={() => {
                                setSelectedCustomer(customer)
                                field.onChange(customer.id)
                                setCustomerSearchTerm(`${customer.first_name} ${customer.last_name}`)
                                setIsCustomerPopoverOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div>
                                <p>{`${customer.first_name} ${customer.last_name}`}</p>
                                <p className="text-xs text-muted-foreground">{customer.email || customer.phone}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandGroup className="border-t pt-1">
                          <NewCustomerModal onCustomerCreated={handleCustomerCreated}>
                            <CommandItem
                              onSelect={() => {
                                /* Modal handles open state */
                              }}
                              className="cursor-pointer"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add New Customer
                            </CommandItem>
                          </NewCustomerModal>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.customerId && <p className="text-sm text-red-500">{errors.customerId.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information Section (Identical to previous, no changes needed here) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CarIcon className="mr-2 h-5 w-5" /> Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VinLookup onVehicleFound={handleVehicleFound} showDetails={false} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Controller
                name="vin"
                control={control}
                render={({ field }) => <Input {...field} id="vin" placeholder="17-character VIN" />}
              />
              {errors.vin && <p className="text-sm text-red-500">{errors.vin.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleMake">Make</Label>
              <Controller
                name="vehicleMake"
                control={control}
                render={({ field }) => <Input {...field} id="vehicleMake" placeholder="e.g., Toyota" />}
              />
              {errors.vehicleMake && <p className="text-sm text-red-500">{errors.vehicleMake.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleModel">Model</Label>
              <Controller
                name="vehicleModel"
                control={control}
                render={({ field }) => <Input {...field} id="vehicleModel" placeholder="e.g., Camry" />}
              />
              {errors.vehicleModel && <p className="text-sm text-red-500">{errors.vehicleModel.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleYear">Year</Label>
              <Controller
                name="vehicleYear"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="vehicleYear"
                    type="number"
                    placeholder="e.g., 2021"
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 0)}
                  />
                )}
              />
              {errors.vehicleYear && <p className="text-sm text-red-500">{errors.vehicleYear.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleColor">Color</Label>
              <Controller
                name="vehicleColor"
                control={control}
                render={({ field }) => <Input {...field} id="vehicleColor" placeholder="e.g., Red" />}
              />
            </div>
            <div>
              <Label htmlFor="licensePlate">License Plate</Label>
              <Controller
                name="licensePlate"
                control={control}
                render={({ field }) => <Input {...field} id="licensePlate" placeholder="e.g., ABC-123" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Damage Details & AI Quote Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hammer className="mr-2 h-5 w-5" /> Damage Details & AI Quote
          </CardTitle>
          <CardDescription>
            Describe the damage to the vehicle. You can then generate an AI preliminary quote.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="damageDescription">Damage Description</Label>
            <Controller
              name="damageDescription"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="damageDescription" placeholder="Describe the damage in detail..." rows={3} />
              )}
            />
            {errors.damageDescription && <p className="text-sm text-red-500">{errors.damageDescription.message}</p>}
          </div>

          <div>
            <Label>Damaged Parts (select all applicable)</Label>
            <Controller
              name="damagedParts"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                  {commonDamagedParts.map((part) => (
                    <div key={part} className="flex items-center space-x-2">
                      <Switch
                        id={`part-${part.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={field.value?.includes(part)}
                        onCheckedChange={(checked) => {
                          const currentParts = field.value || []
                          const newParts = checked ? [...currentParts, part] : currentParts.filter((p) => p !== part)
                          field.onChange(newParts)
                          trigger("damagedParts") // Trigger validation when parts change
                        }}
                      />
                      <Label
                        htmlFor={`part-${part.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm font-normal"
                      >
                        {part}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {/* "Other Damaged Part" Input */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showOtherPartInput"
                  checked={showOtherPartInput}
                  onCheckedChange={(checked) => {
                    setShowOtherPartInput(checked)
                    if (!checked) setOtherPartName("") // Clear if hiding
                    trigger("damagedParts") // Trigger validation
                  }}
                />
                <Label htmlFor="showOtherPartInput">Other Damaged Part?</Label>
              </div>
              {showOtherPartInput && (
                <Input
                  id="otherPartName"
                  placeholder="Specify other damaged part"
                  value={otherPartName}
                  onChange={(e) => {
                    setOtherPartName(e.target.value)
                    trigger("damagedParts") // Trigger validation
                  }}
                />
              )}
            </div>
            {errors.damagedParts && <p className="text-sm text-red-500">{errors.damagedParts.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="damageSeverity">Damage Severity</Label>
              <Controller
                name="damageSeverity"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="damageSeverity">
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {damageSeverities.map((sev) => (
                        <SelectItem key={sev.value} value={sev.value}>
                          {sev.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.damageSeverity && <p className="text-sm text-red-500">{errors.damageSeverity.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-7">
              <Controller
                name="paintRequired"
                control={control}
                render={({ field }) => (
                  <Switch id="paintRequired" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="paintRequired">Paint Required?</Label>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGenerateAiQuote}
            disabled={isGeneratingQuote}
            className="w-full md:w-auto"
          >
            {isGeneratingQuote ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            {isGeneratingQuote ? "Generating AI Quote..." : "Generate AI Preliminary Quote"}
          </Button>

          {aiQuoteError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center mt-4">
              <AlertTriangle className="h-4 w-4 mr-2" /> {aiQuoteError}
            </div>
          )}
          {currentAiQuote /* AI Quote Display - Identical to previous, no changes */ && (
            <div className="mt-6 p-4 border rounded-lg bg-secondary/50">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600" /> AI Preliminary Quote Details
              </h3>
              <div className="space-y-3">
                <div className="bg-background p-3 rounded-md shadow-sm">
                  <p className="text-xl font-bold text-center">
                    Total Estimated Cost: ${currentAiQuote.totalEstimatedCost.min} - $
                    {currentAiQuote.totalEstimatedCost.max}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Confidence: {(currentAiQuote.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <Card className="bg-background/70">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center">
                        <Hammer className="mr-1.5 h-4 w-4" />
                        Estimated Labor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-0.5">
                      {currentAiQuote.estimatedLaborHours.bodyRepair && (
                        <p>Body Repair: {currentAiQuote.estimatedLaborHours.bodyRepair.toFixed(1)} hrs</p>
                      )}
                      {currentAiQuote.estimatedLaborHours.paintPrep && (
                        <p>Paint Prep: {currentAiQuote.estimatedLaborHours.paintPrep.toFixed(1)} hrs</p>
                      )}
                      {currentAiQuote.estimatedLaborHours.painting && (
                        <p>Painting: {currentAiQuote.estimatedLaborHours.painting.toFixed(1)} hrs</p>
                      )}
                      {currentAiQuote.estimatedLaborHours.assembly && (
                        <p>Assembly: {currentAiQuote.estimatedLaborHours.assembly.toFixed(1)} hrs</p>
                      )}
                      <p className="font-medium">
                        Total Labor: {currentAiQuote.estimatedLaborHours.total.toFixed(1)} hrs
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/70">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center">
                        <ClockIcon className="mr-1.5 h-4 w-4" />
                        Estimated Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p>
                        Repair Time: {currentAiQuote.estimatedRepairTimeDays.min} -{" "}
                        {currentAiQuote.estimatedRepairTimeDays.max} days
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {currentAiQuote.estimatedParts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Estimated Parts:</h4>
                    <ul className="list-disc list-inside text-xs space-y-1 pl-4">
                      {" "}
                      {/* Increased space-y slightly */}
                      {currentAiQuote.estimatedParts.map((part, i) => (
                        <li key={i}>
                          {part.name} (Qty: {part.quantity})
                          {part.costPerUnit !== null && part.totalCost !== null ? (
                            ` - Est. $${(part.totalCost).toFixed(2)}`
                          ) : (
                            <span className="text-amber-700 dark:text-amber-500"> - Cost TBD</span>
                          )}
                          {part.oemGenuine && (
                            <Badge variant="outline" className="ml-1 text-xs px-1 py-0">
                              OEM
                            </Badge>
                          )}
                          {part.notes && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 italic ml-2">
                              ↳ Note: {part.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(currentAiQuote.paintMaterialCost || currentAiQuote.sundriesCost) && (
                  <Card className="bg-background/70">
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center">
                        <Palette className="mr-1.5 h-4 w-4" />
                        Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-sm space-y-0.5">
                      {currentAiQuote.paintMaterialCost && (
                        <p>Paint Materials: ~${currentAiQuote.paintMaterialCost.toFixed(2)}</p>
                      )}
                      {currentAiQuote.sundriesCost && <p>Sundries: ~${currentAiQuote.sundriesCost.toFixed(2)}</p>}
                    </CardContent>
                  </Card>
                )}
                {currentAiQuote.assumptions && currentAiQuote.assumptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Assumptions:</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 pl-4">
                      {currentAiQuote.assumptions.map((assumption, i) => (
                        <li key={i}>{assumption}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentAiQuote.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    <strong>Note:</strong> {currentAiQuote.notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Information Section (Identical to previous, no changes) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheckIcon className="mr-2 h-5 w-5" /> Insurance Information (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="insuranceCompany">Insurance Company</Label>
            <Controller
              name="insuranceCompany"
              control={control}
              render={({ field }) => <Input {...field} id="insuranceCompany" />}
            />
          </div>
          <div>
            <Label htmlFor="policyNumber">Policy #</Label>
            <Controller
              name="policyNumber"
              control={control}
              render={({ field }) => <Input {...field} id="policyNumber" />}
            />
          </div>
          <div>
            <Label htmlFor="claimNumber">Claim #</Label>
            <Controller
              name="claimNumber"
              control={control}
              render={({ field }) => <Input {...field} id="claimNumber" />}
            />
          </div>
          <div>
            <Label htmlFor="dateOfLoss">Date of Loss</Label>
            <Controller
              name="dateOfLoss"
              control={control}
              render={({ field }) => <Input {...field} id="dateOfLoss" type="date" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes Section (Identical to previous, no changes) */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <Textarea {...field} placeholder="Any internal notes or additional details..." />}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isFormValid}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSubmitting ? "Saving Ticket..." : "Create Auto Body Ticket"}
        </Button>
      </div>
    </form>
  )
}
