"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, AlertTriangle, ShoppingCart, Send } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/inventory-utils"
import type { InventoryItem } from "@/lib/supabase-types"
import { toast } from "@/hooks/use-toast"

export default function LowStockPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [generatingOrder, setGeneratingOrder] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const fetchLowStockItems = async () => {
      try {
        // Get all items where quantity is below min_stock_level
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .or(`quantity_in_stock.lt.min_stock_level,quantity_in_stock.eq.0`)
          .order("name", { ascending: true })

        if (error) throw error
        setItems(data || [])
        setLoading(false)
      } catch (error) {
        console.error("Error loading low stock items:", error)
        setLoading(false)
      }
    }

    fetchLowStockItems()
  }, [user?.id])

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity_in_stock <= 0) return "out_of_stock"
    if (item.quantity_in_stock <= item.min_stock_level) return "low_stock"
    return "in_stock"
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))].sort()

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const selectAll = () => {
    const newSelected: Record<string, boolean> = {}
    filteredItems.forEach((item) => {
      newSelected[item.id] = true
    })
    setSelectedItems(newSelected)
  }

  const deselectAll = () => {
    setSelectedItems({})
  }

  const generatePurchaseOrder = () => {
    setGeneratingOrder(true)

    // Simulate generating a purchase order
    setTimeout(() => {
      toast({
        title: "Purchase order generated",
        description: `Created purchase order for ${Object.keys(selectedItems).length} items`,
      })
      setGeneratingOrder(false)
      setSelectedItems({})
    }, 1500)
  }

  const sendSupplierEmails = () => {
    toast({
      title: "Supplier emails queued",
      description: "Emails will be sent to suppliers for the selected items",
    })
  }

  const selectedCount = Object.values(selectedItems).filter(Boolean).length

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/inventory">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Low Stock Items</h1>
            <p className="text-gray-600">Items that need to be reordered</p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <>
              <Button variant="outline" onClick={sendSupplierEmails}>
                <Send className="w-4 h-4 mr-2" />
                Email Suppliers
              </Button>
              <Button onClick={generatePurchaseOrder} disabled={generatingOrder}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {generatingOrder ? "Generating..." : "Generate Purchase Order"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search low stock items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  {categories.slice(0, 3).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No low stock items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "All your inventory items have sufficient stock levels."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <div className="text-sm text-gray-500">
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} need attention
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  {selectedCount > 0 && (
                    <Button variant="outline" size="sm" onClick={deselectAll}>
                      Deselect All
                    </Button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium w-10">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">SKU</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Current Stock</th>
                      <th className="text-left py-3 px-4 font-medium">Min Level</th>
                      <th className="text-left py-3 px-4 font-medium">Reorder Qty</th>
                      <th className="text-left py-3 px-4 font-medium">Cost</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const stockStatus = getStockStatus(item)
                      const reorderQty = Math.max(
                        (item.max_stock_level || 100) - (item.quantity_in_stock || 0),
                        (item.min_stock_level || 5) * 2,
                      )

                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={!!selectedItems[item.id]}
                              onChange={() => toggleSelectItem(item.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/inventory/${item.id}`} className="font-medium text-blue-600 hover:underline">
                              {item.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="py-3 px-4">{item.quantity_in_stock || 0}</td>
                          <td className="py-3 px-4">{item.min_stock_level || 0}</td>
                          <td className="py-3 px-4 font-medium">{reorderQty}</td>
                          <td className="py-3 px-4">{formatCurrency(item.unit_cost * reorderQty || 0)}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStockStatusColor(stockStatus)}>
                              {stockStatus === "out_of_stock" ? "OUT OF STOCK" : "LOW STOCK"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{item.supplier || "—"}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
