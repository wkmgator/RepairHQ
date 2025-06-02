"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Barcode, Scan } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { generateSKU, getInventoryCategories, getPopularBrands } from "@/lib/inventory-utils"
import { BarcodeGenerator } from "@/components/barcode-generator"
import { BarcodeScannerModal } from "@/components/barcode-scanner-modal"
import { generateInventoryBarcode } from "@/lib/barcode-utils"

// Define the form schema
const inventoryItemSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }).optional().or(z.literal("")), // Made optional for auto-generation
  barcode: z.string().optional(),
  item_category: z.string().min(1, { message: "Please select a category" }), // Renamed from category
  item_type: z.string().optional(), // New field
  brand: z.string().optional(),
  model: z.string().optional(),
  description: z.string().optional(),
  specific_attributes: z.record(z.string().or(z.number()).or(z.boolean())).optional(), // For JSONB
  custom_fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(), // For JSONB
  quantity_in_stock: z.coerce.number().int().min(0),
  min_stock_level: z.coerce.number().int().min(0),
  max_stock_level: z.coerce.number().int().min(0).optional(),
  unit_cost: z.coerce.number().min(0),
  selling_price: z.coerce.number().min(0),
  supplier_id: z.string().optional(),
  supplier_part_number: z.string().optional(),
  location: z.string().optional(),
  warranty_period_months: z.coerce.number().int().min(0).optional(),
  compatibility: z.string().optional(),
  notes: z.string().optional(),
})

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>

interface InventoryItemFormProps {
  initialData?: any
  onSuccess?: (data: any) => void
  isLoading?: boolean
}

export function InventoryItemForm({ initialData, onSuccess, isLoading = false }: InventoryItemFormProps) {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      barcode: "", // Will be auto-generated if SKU exists
      item_category: "Uncategorized", // Renamed
      item_type: "",
      brand: "",
      model: "",
      description: "",
      specific_attributes: {},
      custom_fields: {},
      quantity_in_stock: 0,
      min_stock_level: 0,
      max_stock_level: 0,
      unit_cost: 0,
      selling_price: 0,
      supplier_id: "",
      supplier_part_number: "",
      location: "",
      warranty_period_months: 0,
      compatibility: "",
      notes: "",
    },
  })

  // Load suppliers on component mount
  useEffect(() => {
    async function loadSuppliers() {
      const { data } = await supabase.from("suppliers").select("id, name").order("name")
      setSuppliers(data || [])
    }

    loadSuppliers()
  }, [])

  // Generate SKU when name and category change
  const generateSkuFromForm = () => {
    const name = form.getValues("name")
    const itemCategory = form.getValues("item_category")
    const brand = form.getValues("brand") || ""
    if (name && itemCategory) {
      const sku = generateSKU(itemCategory, brand, name)
      form.setValue("sku", sku)
    }
  }

  // Generate barcode when SKU changes
  const generateBarcodeFromSku = () => {
    const sku = form.getValues("sku")
    const itemCategory = form.getValues("item_category")

    if (sku && itemCategory) {
      const barcode = generateInventoryBarcode(itemCategory, sku)
      form.setValue("barcode", barcode)
    }
  }

  // Handle barcode scanner result
  const handleBarcodeScanned = (barcode: string) => {
    form.setValue("barcode", barcode)
    toast({
      title: "Barcode Scanned",
      description: `Barcode ${barcode} has been added to the item.`,
    })
  }

  // Handle form submission
  const onSubmit = async (data: InventoryItemFormValues) => {
    try {
      setIsSaving(true)

      // Prepare data for Supabase
      const inventoryData = {
        ...data,
        specific_attributes: data.specific_attributes || {},
        custom_fields: data.custom_fields || {},
        updated_at: new Date().toISOString(),
      }

      let result

      if (initialData?.id) {
        // Update existing item
        const { data: updatedData, error } = await supabase
          .from("inventory_items")
          .update(inventoryData)
          .eq("id", initialData.id)
          .select()
          .single()

        if (error) throw error
        result = updatedData

        toast({
          title: "Inventory Item Updated",
          description: "The inventory item has been updated successfully.",
        })
      } else {
        // Create new item
        const { data: newData, error } = await supabase
          .from("inventory_items")
          .insert({
            ...inventoryData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        result = newData

        toast({
          title: "Inventory Item Created",
          description: "The inventory item has been created successfully.",
        })
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error("Error saving inventory item:", error)
      toast({
        title: "Error",
        description: "There was an error saving the inventory item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Item Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
          <TabsTrigger value="barcodes">Barcodes & Identifiers</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter item name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="item_category" // Renamed
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getInventoryCategories().map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getPopularBrands().map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="item_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Screen, Battery, Engine Part" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter model number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter item description" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
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
                    name="supplier_part_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Part Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter supplier part number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter storage location (e.g., Shelf A-3)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specific_attributes.voltage" // Example specific attribute
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voltage (Specific Attribute)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 110V or 220V"
                            onChange={(e) => field.onChange(e.target.value || undefined)}
                          />
                        </FormControl>
                        <FormDescription>Relevant for electronics or appliances.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specific_attributes.material" // Example specific attribute
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material (Specific Attribute)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Stainless Steel, Gold"
                            onChange={(e) => field.onChange(e.target.value || undefined)}
                          />
                        </FormControl>
                        <FormDescription>Relevant for jewelry, parts, etc.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="custom_fields.internal_code" // Example custom field
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Code (Custom Field)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your internal tracking code"
                            onChange={(e) => field.onChange(e.target.value || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="unit_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
                          </FormControl>
                          <FormDescription>Cost price per unit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selling_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
                          </FormControl>
                          <FormDescription>Retail price per unit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity_in_stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_stock_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Stock</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" placeholder="0" />
                          </FormControl>
                          <FormDescription>Low stock alert threshold</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="max_stock_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Stock</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" placeholder="0" />
                          </FormControl>
                          <FormDescription>Optimal maximum stock</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="warranty_period_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Period (Months)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" placeholder="0" />
                        </FormControl>
                        <FormDescription>Warranty period in months (0 for no warranty)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="barcodes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Item Identifiers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input {...field} placeholder="Enter SKU" />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={generateSkuFromForm}>
                              Generate
                            </Button>
                          </div>
                          <FormDescription>Stock Keeping Unit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input {...field} placeholder="Enter barcode" />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={() => setShowBarcodeScanner(true)}>
                              <Scan className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="outline" onClick={generateBarcodeFromSku}>
                              <Barcode className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>UPC, EAN, or custom barcode</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="compatibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compatibility</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter compatible devices or models" rows={3} />
                        </FormControl>
                        <FormDescription>List compatible devices, separated by commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Barcode Generator</h3>
                    <BarcodeGenerator
                      initialValue={form.getValues("barcode") || form.getValues("sku")}
                      onGenerate={(barcode) => form.setValue("barcode", barcode)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {initialData?.id ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>

      <BarcodeScannerModal
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
        onDetected={handleBarcodeScanned}
        title="Scan Barcode for Inventory Item"
      />
    </div>
  )
}
