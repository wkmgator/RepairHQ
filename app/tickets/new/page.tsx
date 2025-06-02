"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Search, Plus, Smartphone, Info } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase-types"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function NewTicketForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Database["public"]["Tables"]["customers"]["Row"][]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Database["public"]["Tables"]["customers"]["Row"] | null>(
    null,
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<Database["public"]["Tables"]["customers"]["Row"][]>([])
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  const [posCustomerName, setPosCustomerName] = useState<string | null>(null)
  const [posVertical, setPosVertical] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    device_type: "",
    device_brand: "",
    device_model: "",
    device_color: "",
    serial_number: "",
    imei: "",
    issue_description: "",
    diagnosis: "",
    priority: "medium",
    estimated_cost: "",
    notes: "",
  })

  useEffect(() => {
    const customerIdFromQuery = searchParams.get("customerId")
    const customerNameFromQuery = searchParams.get("customerName")
    const verticalFromQuery = searchParams.get("vertical")

    if (customerNameFromQuery) {
      setPosCustomerName(customerNameFromQuery)
    }
    if (verticalFromQuery) {
      setPosVertical(verticalFromQuery)
      if (verticalFromQuery === "electronics" && !formData.device_type) {
        setFormData((prev) => ({ ...prev, device_type: "smartphone" }))
      }
    }

    async function loadInitialCustomerData() {
      setIsLoading(true) // Start loading
      try {
        if (customerIdFromQuery) {
          const { data: customer, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", customerIdFromQuery)
            .single()

          if (error) throw error
          if (customer) {
            setSelectedCustomer(customer)
            setSearchQuery(`${customer.first_name} ${customer.last_name}`)
            if (!customerNameFromQuery) {
              // If name wasn't in query, set it from fetched customer
              setPosCustomerName(`${customer.first_name} ${customer.last_name}`)
            }
          } else {
            toast({
              title: "Customer Not Found",
              description: `Customer with ID ${customerIdFromQuery} not found. Please search or create.`,
              variant: "warning",
            })
            // Fallback to name search if ID fails but name is present
            if (customerNameFromQuery) {
              await searchCustomerByName(customerNameFromQuery)
            }
          }
        } else if (customerNameFromQuery) {
          // If no customerId, but customerName is present, try to find by name
          await searchCustomerByName(customerNameFromQuery)
        } else {
          // Load all customers if no specific customer info from query
          const { data, error } = await supabase.from("customers").select("*").order("first_name", { ascending: true })
          if (error) throw error
          setCustomers(data || [])
        }
      } catch (error) {
        console.error("Error loading initial customer data:", error)
        toast({ title: "Error", description: "Failed to load customer data.", variant: "destructive" })
      } finally {
        setIsLoading(false) // End loading
      }
    }

    async function searchCustomerByName(name: string) {
      const { data, error } = await supabase.from("customers").select("*").order("first_name", { ascending: true })
      if (error) throw error
      setCustomers(data || []) // Set all customers for general searchability

      const foundCustomer = data?.find(
        (c) =>
          `${c.first_name} ${c.last_name}`.toLowerCase() === name.toLowerCase() ||
          c.email?.toLowerCase() === name.toLowerCase(),
      )
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer)
        setSearchQuery(`${foundCustomer.first_name} ${foundCustomer.last_name}`)
      } else {
        setSearchQuery(name) // Pre-fill search query with the name from POS
        toast({
          title: "Customer Hint",
          description: `Customer "${name}" not found. You can search or create a new one.`,
          variant: "default",
        })
      }
    }

    loadInitialCustomerData()
  }, [searchParams, supabase, toast, formData.device_type])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers([])
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(query) ||
          (customer.email && customer.email.toLowerCase().includes(query)) ||
          (customer.phone && customer.phone.includes(query)),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const handleSelectCustomer = (customer: Database["public"]["Tables"]["customers"]["Row"]) => {
    setSelectedCustomer(customer)
    setSearchQuery(`${customer.first_name} ${customer.last_name}`)
    setFilteredCustomers([])
    setShowCustomerSearch(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateTicketNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `TK${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) {
      toast({ title: "Validation Error", description: "Please select a customer", variant: "destructive" })
      return
    }
    if (!formData.device_type || !formData.issue_description) {
      toast({
        title: "Validation Error",
        description: "Device Type and Issue Description are required.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const ticketData = {
        user_id: user.id,
        customer_id: selectedCustomer.id,
        ticket_number: generateTicketNumber(),
        device_type: formData.device_type,
        device_brand: formData.device_brand,
        device_model: formData.device_model,
        device_color: formData.device_color,
        serial_number: formData.serial_number,
        imei: formData.imei,
        issue_description: formData.issue_description,
        diagnosis: formData.diagnosis,
        status: "pending" as const,
        priority: formData.priority as "low" | "medium" | "high" | "urgent",
        estimated_cost: formData.estimated_cost ? Number.parseFloat(formData.estimated_cost) : null,
        notes: formData.notes,
        store_id: selectedCustomer.store_id,
      }

      const { data, error } = await supabase.from("tickets").insert(ticketData).select().single()
      if (error) throw error
      if (!data) throw new Error("Failed to create ticket, no data returned.")

      await supabase.from("ticket_status_history").insert({
        ticket_id: data.id,
        new_status: "pending",
        changed_by_user_id: user.id,
      })

      toast({ title: "Success", description: "Ticket created successfully!" })
      router.push(`/tickets/${data.id}`)
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

  const createRedirectUrl = () => {
    const params = new URLSearchParams()
    params.append("redirect", "/tickets/new")
    if (posCustomerName) params.append("name", posCustomerName) // Pre-fill name on customer form

    // Params to pass *back* to /tickets/new after customer creation
    const ticketParams = new URLSearchParams()
    if (posVertical) ticketParams.append("vertical", posVertical)
    // Do not pass customerId or customerName back to tickets/new if creating a new one,
    // as the new customer's ID will be used.

    return `/customers/new?${params.toString()}&ticketContext=${encodeURIComponent(ticketParams.toString())}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tickets">
            {" "}
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tickets{" "}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Ticket</h1>
      </div>

      {(posCustomerName || posVertical) && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-700">Information from POS</AlertTitle>
          <AlertDescription className="text-blue-600">
            {posCustomerName && (
              <div>
                Customer context: <strong>{posCustomerName}</strong>. Please search or create if new.
              </div>
            )}
            {posVertical && (
              <div>
                Repair Vertical: <strong>{posVertical.charAt(0).toUpperCase() + posVertical.slice(1)}</strong>.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Search for an existing customer or create a new one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !selectedCustomer ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                Loading customer...
              </div>
            ) : !selectedCustomer ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-search">Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customer-search"
                      placeholder="Search by name, email, or phone"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowCustomerSearch(true)
                      }}
                      className="pl-8"
                    />
                  </div>
                  {showCustomerSearch && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full max-w-md rounded-md border bg-background shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="cursor-pointer border-b p-3 hover:bg-muted/50"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email} &bull; {customer.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showCustomerSearch && searchQuery && filteredCustomers.length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No customers found matching "{searchQuery}".</p>
                  )}
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`/customers/new?redirect=/tickets/new${posCustomerName ? `&name=${encodeURIComponent(posCustomerName)}` : ""}`}
                  >
                    <User className="mr-2 h-4 w-4" /> Create New Customer
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border bg-muted p-4">
                  <div className="mb-1 font-semibold text-lg">
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
                  <div className="text-sm text-muted-foreground">{selectedCustomer.phone}</div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCustomer(null)
                    setSearchQuery("")
                  }}
                >
                  {" "}
                  Change Customer{" "}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {" "}
                  <Smartphone className="h-5 w-5 mr-2" /> Device & Issue Details{" "}
                </CardTitle>
                {posVertical && (
                  <CardDescription>
                    Vertical: {posVertical.charAt(0).toUpperCase() + posVertical.slice(1)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="device_type">Device Type *</Label>
                    <Select value={formData.device_type} onValueChange={(value) => handleChange("device_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>{" "}
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem> <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="gaming_console">Gaming Console</SelectItem>{" "}
                        <SelectItem value="smartwatch">Smartwatch</SelectItem>
                        <SelectItem value="drone">Drone</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="auto_vehicle">Automotive Vehicle</SelectItem>{" "}
                        <SelectItem value="medical_device">Medical Device</SelectItem>
                        <SelectItem value="industrial_equipment">Industrial Equipment</SelectItem>{" "}
                        <SelectItem value="pool_equipment">Pool Equipment</SelectItem>
                        <SelectItem value="agri_equipment">Agriculture Equipment</SelectItem>{" "}
                        <SelectItem value="home_appliance">Home Appliance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="device_brand">Brand</Label>{" "}
                    <Input
                      id="device_brand"
                      value={formData.device_brand}
                      onChange={(e) => handleChange("device_brand", e.target.value)}
                      placeholder="e.g., Apple, Samsung, Dell"
                    />{" "}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="device_model">Model</Label>{" "}
                    <Input
                      id="device_model"
                      value={formData.device_model}
                      onChange={(e) => handleChange("device_model", e.target.value)}
                      placeholder="e.g., iPhone 13 Pro, Galaxy S21"
                    />{" "}
                  </div>
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="device_color">Color</Label>{" "}
                    <Input
                      id="device_color"
                      value={formData.device_color}
                      onChange={(e) => handleChange("device_color", e.target.value)}
                      placeholder="e.g., Space Gray, White"
                    />{" "}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="serial_number">Serial Number</Label>{" "}
                    <Input
                      id="serial_number"
                      value={formData.serial_number}
                      onChange={(e) => handleChange("serial_number", e.target.value)}
                      placeholder="Device serial number"
                    />{" "}
                  </div>
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="imei">IMEI (if applicable)</Label>{" "}
                    <Input
                      id="imei"
                      value={formData.imei}
                      onChange={(e) => handleChange("imei", e.target.value)}
                      placeholder="IMEI number"
                    />{" "}
                  </div>
                </div>
                <div className="space-y-2">
                  {" "}
                  <Label htmlFor="issue_description">Issue Description *</Label>{" "}
                  <Textarea
                    id="issue_description"
                    value={formData.issue_description}
                    onChange={(e) => handleChange("issue_description", e.target.value)}
                    placeholder="Describe the problem in detail..."
                    rows={4}
                    required
                  />{" "}
                </div>
                <div className="space-y-2">
                  {" "}
                  <Label htmlFor="diagnosis">Initial Diagnosis</Label>{" "}
                  <Textarea
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => handleChange("diagnosis", e.target.value)}
                    placeholder="Initial assessment or diagnosis..."
                    rows={3}
                  />{" "}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {" "}
                        <SelectItem value="low">Low</SelectItem> <SelectItem value="medium">Medium</SelectItem>{" "}
                        <SelectItem value="high">High</SelectItem> <SelectItem value="urgent">Urgent</SelectItem>{" "}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>{" "}
                    <Input
                      id="estimated_cost"
                      type="number"
                      step="0.01"
                      value={formData.estimated_cost}
                      onChange={(e) => handleChange("estimated_cost", e.target.value)}
                      placeholder="0.00"
                    />{" "}
                  </div>
                </div>
                <div className="space-y-2">
                  {" "}
                  <Label htmlFor="notes">Internal Notes</Label>{" "}
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any internal notes or special instructions..."
                    rows={3}
                  />{" "}
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link href="/tickets">
                    {" "}
                    <Button variant="outline" type="button">
                      {" "}
                      Cancel{" "}
                    </Button>{" "}
                  </Link>
                  <Button type="submit" disabled={isLoading || !selectedCustomer}>
                    {" "}
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}{" "}
                    {isLoading ? "Creating..." : "Create Ticket"}{" "}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewTicketPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading ticket form...</div>}>
      <NewTicketForm />
    </Suspense>
  )
}
