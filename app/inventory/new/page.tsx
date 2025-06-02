"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateSKU } from "@/lib/inventory-utils"

const categories = [
  "Screen Parts",
  "Battery",
  "Charging Port",
  "Camera",
  "Speaker",
  "Microphone",
  "Tools",
  "Adhesives",
  "Cables",
  "Cases",
  "Other",
]

export default function NewInventoryItemPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category: "",
    brand: "",
    model: "",
    costPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    minStockLevel: 5,
    maxStockLevel: 100,
    location: "",
    supplier: "",
    supplierPartNumber: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleGenerateSKU = () => {
    const sku = generateSKU(formData.category, formData.brand, formData.name)
    setFormData((prev) => ({ ...prev, sku }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.uid) return

    setLoading(true)
    try {
      const itemData = {
        ...formData,
        userId: user.uid,
        storeId: user.storeId || "default",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, "inventory"), itemData)
      router.push(`/inventory/${docRef.id}`)
    } catch (error) {
      console.error("Error creating inventory item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Inventory Item</h1>
          <p className="text-gray-600">Add a new part or supply to your inventory</p>
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
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="iPhone 12 Screen Assembly"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the item..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="AUTO-GENERATED"
                    />
                    <Button type="button" variant="outline" onClick={handleGenerateSKU}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Apple, Samsung, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="iPhone 12, Galaxy S21, etc."
                  />
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
                  <Label htmlFor="costPrice">Cost Price *</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price *</Label>
                  <Input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Current Stock *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="minStockLevel">Min Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    name="minStockLevel"
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={handleChange}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    name="maxStockLevel"
                    type="number"
                    min="0"
                    value={formData.maxStockLevel}
                    onChange={handleChange}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Shelf A1, Bin 5, etc."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Profit Margin</h4>
                <div className="text-sm text-gray-600">
                  {formData.costPrice > 0 && formData.sellingPrice > 0 ? (
                    <>
                      <div>Profit: ${(formData.sellingPrice - formData.costPrice).toFixed(2)}</div>
                      <div>
                        Margin:{" "}
                        {(((formData.sellingPrice - formData.costPrice) / formData.sellingPrice) * 100).toFixed(1)}%
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
                <Input
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <Label htmlFor="supplierPartNumber">Supplier Part Number</Label>
                <Input
                  id="supplierPartNumber"
                  name="supplierPartNumber"
                  value={formData.supplierPartNumber}
                  onChange={handleChange}
                  placeholder="Supplier's part number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this item..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/inventory">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </div>
      </form>
    </div>
  )
}
