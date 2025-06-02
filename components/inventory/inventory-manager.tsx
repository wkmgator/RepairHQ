"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/supabase-client"
import { Plus, Search, Package, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  cost: number
  category: string
  supplier: string
  low_stock_threshold: number
  created_at: string
}

export default function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const lowStockItems = items.filter((item) => item.quantity <= item.low_stock_threshold)

  if (loading) {
    return <div className="p-6">Loading inventory...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage your parts and supplies</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-500">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold">
                ${items.reduce((sum, item) => sum + item.quantity * item.cost, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold">{new Set(items.map((item) => item.category)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <Badge variant="destructive">{item.quantity} left</Badge>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-sm text-red-600">+{lowStockItems.length - 3} more items</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                </div>
                <Badge variant={item.quantity <= item.low_stock_threshold ? "destructive" : "secondary"}>
                  {item.quantity} in stock
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="text-sm">${item.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-semibold">${item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Supplier:</span>
                  <span className="text-sm">{item.supplier}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Reorder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or add new inventory items</p>
        </div>
      )}
    </div>
  )
}
