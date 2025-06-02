"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VinScanner } from "./vin-scanner"
import { VinHistory } from "./vin-history"
import type { VehicleInfo } from "@/lib/vin-decoder"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Form schema
const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name is required" }),
  customerEmail: z.string().email({ message: "Invalid email address" }),
  customerPhone: z.string().min(10, { message: "Valid phone number is required" }),
  vin: z.string().optional(),
  year: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  engine: z.string().optional(),
  mileage: z.string().optional(),
  serviceType: z.string().min(1, { message: "Service type is required" }),
  description: z.string().min(10, { message: "Please provide a detailed description" }),
  priority: z.string().default("medium"),
})

type FormValues = z.infer<typeof formSchema>

export function AutomotiveTicketFormWithVin() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("lookup")

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      vin: "",
      year: "",
      make: "",
      model: "",
      trim: "",
      engine: "",
      mileage: "",
      serviceType: "",
      description: "",
      priority: "medium",
    },
  })

  // Handle vehicle selection from VIN lookup
  const handleVehicleFound = (vehicleInfo: VehicleInfo) => {
    form.setValue("vin", vehicleInfo.vin)
    form.setValue("year", vehicleInfo.year)
    form.setValue("make", vehicleInfo.make)
    form.setValue("model", vehicleInfo.model)
    form.setValue("trim", vehicleInfo.trim)
    form.setValue("engine", vehicleInfo.engine)

    // Switch to the vehicle tab after lookup
    setActiveTab("vehicle")
  }

  // Form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real implementation, you would save to your database
      // For this example, we'll use Supabase
      const { error } = await supabase.from("tickets").insert({
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        trim: data.trim,
        engine: data.engine,
        mileage: data.mileage,
        service_type: data.serviceType,
        description: data.description,
        priority: data.priority,
        status: "new",
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      // Redirect to tickets page
      router.push("/tickets")
      router.refresh()
    } catch (error) {
      console.error("Error creating ticket:", error)
      // In a real app, you would show an error message
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Automotive Service Ticket</CardTitle>
          <CardDescription>Create a new service ticket for automotive repair</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="lookup">VIN Lookup</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
              <TabsTrigger value="service">Service Details</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="lookup">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <VinScanner onVehicleFound={handleVehicleFound} />
                      </div>
                      <div>
                        <VinHistory onVehicleSelect={handleVehicleFound} limit={5} />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setActiveTab("vehicle")}>
                        Continue to Vehicle Info
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vehicle">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="vin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>VIN</FormLabel>
                              <FormControl>
                                <Input placeholder="Vehicle Identification Number" {...field} />
                              </FormControl>
                              <FormDescription>17-character vehicle identification number</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="2023" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="make"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Make</FormLabel>
                                <FormControl>
                                  <Input placeholder="Toyota" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                  <Input placeholder="Camry" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="trim"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trim</FormLabel>
                                <FormControl>
                                  <Input placeholder="XLE" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="engine"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Engine</FormLabel>
                            <FormControl>
                              <Input placeholder="2.5L I4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mileage</FormLabel>
                            <FormControl>
                              <Input placeholder="45,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("lookup")}>
                        Back to VIN Lookup
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("service")}>
                        Continue to Service Details
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="service">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="oil_change">Oil Change</SelectItem>
                              <SelectItem value="brake_service">Brake Service</SelectItem>
                              <SelectItem value="tire_service">Tire Service</SelectItem>
                              <SelectItem value="engine_repair">Engine Repair</SelectItem>
                              <SelectItem value="transmission">Transmission Service</SelectItem>
                              <SelectItem value="electrical">Electrical System</SelectItem>
                              <SelectItem value="ac_service">A/C Service</SelectItem>
                              <SelectItem value="diagnostic">Diagnostic</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the service needed or issues with the vehicle"
                              className="min-h-32"
                              {...field}
                            />
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
                          <FormLabel>Priority</FormLabel>
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

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("vehicle")}>
                        Back to Vehicle Info
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Ticket...
                          </>
                        ) : (
                          "Create Ticket"
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
