"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { getInventoryCategories, getPopularBrands } from "@/lib/inventory-utils"
import { toast } from "@/hooks/use-toast"
import type { InventoryItem } from "@/lib/supabase-types"

export default function EditInventoryItemPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: "",
    description: "",
    sku: "",
    category: "",
    brand: "",
    model: "",
    unit_cost: 0,
    selling_price: 0,
    quantity_in_stock: 0,
    min_stock_level: 5,
    max_stock_level: 100,
    location: "",
    supplier: "",
    supplier_part_number: "",
    notes: "",
  })

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase.from("inventory_items").select("*").eq("id", params.id).single()

        if (error) throw error
        setFormData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error loading inventory item:", error)
        toast({
          title: "Error loading item",
          description: "Could not load the inventory item. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItem()
    }
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !params.id) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("inventory_items")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (error) throw error

      toast({
        title: "Item updated",
        description: "The inventory item has been updated successfully.",
      })

      router.push(`/inventory/${params.id}`)
    } catch (error) {
      console.error("Error updating inventory item:", error)
      toast({
        title: "Error updating item",
        description: "There was a problem updating the inventory item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/inventory/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Item
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Inventory Item</h1>
          <p className="text-gray-600">Update details for {formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential item details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getInventoryCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" value={formData.sku || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={formData.brand || ""} onValueChange={(value) => handleSelectChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPopularBrands().map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model || ""} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
              <CardDescription>Cost, pricing, and inventory levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit_cost">Cost Price *</Label>
                  <Input
                    id="unit_cost"
                    name="unit_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_cost || 0}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="selling_price">Selling Price *</Label>
                  <Input
                    id="selling_price"
                    name="selling_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.selling_price || 0}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity_in_stock">Current Stock *</Label>
                  <Input
                    id="quantity_in_stock"
                    name="quantity_in_stock"
                    type="number"
                    min="0"
                    value={formData.quantity_in_stock || 0}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_stock_level">Min Stock Level</Label>
                  <Input
                    id="min_stock_level"
                    name="min_stock_level"
                    type="number"
                    min="0"
                    value={formData.min_stock_level || 0}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="max_stock_level">Max Stock Level</Label>
                  <Input
                    id="max_stock_level"
                    name="max_stock_level"
                    type="number"
                    min="0"
                    value={formData.max_stock_level || 0}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Storage Location</Label>
                <Input id="location" name="location" value={formData.location || ""} onChange={handleChange} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Profit Margin</h4>
                <div className="text-sm text-gray-600">
                  {formData.unit_cost && formData.selling_price ? (
                    <>
                      <div>Profit: ${(formData.selling_price - formData.unit_cost).toFixed(2)}</div>
                      <div>
                        Margin:{" "}
                        {(((formData.selling_price - formData.unit_cost) / formData.selling_price) * 100).toFixed(1)}%
                      </div>
                    </>
                  ) : (
                    "Enter cost and selling price to see margin"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
            <CardDescription>Supplier details and part numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" name="supplier" value={formData.supplier || ""} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="supplier_part_number">Supplier Part Number</Label>
                <Input
                  id="supplier_part_number"
                  name="supplier_part_number"
                  value={formData.supplier_part_number || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href={`/inventory/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
