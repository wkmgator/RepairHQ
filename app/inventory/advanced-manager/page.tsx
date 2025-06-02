"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Package, TrendingUp, Download, Copy, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  cost: number
  category: string
  reorder_threshold: number
  vertical: string
  store_id: string
  supplier: string
  created_at: string
}

export default function AdvancedInventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [storeFilter, setStoreFilter] = useState("all")
  const [verticalFilter, setVerticalFilter] = useState("all")
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: "",
    sku: "",
    stock: 0,
    price: 0,
    category: "",
    cost: 0,
    reorder_threshold: 3,
    vertical: "electronics",
    store_id: "main",
    supplier: "",
  })

  useEffect(() => {
    refreshInventory()
  }, [storeFilter, verticalFilter])

  const refreshInventory = async () => {
    setLoading(true)
    try {
      let query = supabase.from("inventory").select("*")

      if (storeFilter !== "all") {
        query = query.eq("store_id", storeFilter)
      }
      if (verticalFilter !== "all") {
        query = query.eq("vertical", verticalFilter)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      setInventory(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveItem = async () => {
    if (!form.name || !form.sku) {
      toast({
        title: "Error",
        description: "Name and SKU are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("inventory").insert([form])
      if (error) throw error

      toast({
        title: "Success",
        description: "Item added successfully",
      })
      resetForm()
      refreshInventory()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save item",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase.from("inventory").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      refreshInventory()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const duplicateItem = (item: InventoryItem) => {
    setForm({
      name: `${item.name} (Copy)`,
      sku: `${item.sku}-copy`,
      stock: item.stock,
      price: item.price,
      category: item.category,
      cost: item.cost,
      reorder_threshold: item.reorder_threshold,
      vertical: item.vertical,
      store_id: item.store_id,
      supplier: item.supplier,
    })
  }

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      stock: 0,
      price: 0,
      category: "",
      cost: 0,
      reorder_threshold: 3,
      vertical: "electronics",
      store_id: "main",
      supplier: "",
    })
  }

  const exportCSV = () => {
    const headers = ["Name", "SKU", "Stock", "Price", "Cost", "Category", "Vertical", "Store", "Supplier"]
    const rows = inventory.map((item) => [
      item.name,
      item.sku,
      item.stock,
      item.price,
      item.cost,
      item.category,
      item.vertical,
      item.store_id,
      item.supplier,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const reorderItems = inventory.filter((item) => item.stock <= item.reorder_threshold)
  const lowMarginItems = inventory.filter((item) => {
    const margin = item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0
    return margin < 20
  })

  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.cost, 0)
  const totalRetailValue = inventory.reduce((sum, item) => sum + item.stock * item.price, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📦 Advanced Inventory Manager</h1>
          <p className="text-muted-foreground">Manage inventory with multi-store and vertical filtering</p>
        </div>
        <Button onClick={exportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retail Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRetailValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reorderItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="add-item">Add Item</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="add-item" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Inventory Item</CardTitle>
              <CardDescription>Enter the details for a new inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Item Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                <Input
                  type="number"
                  placeholder="Stock Quantity"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Selling Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                />
                <Input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <Select value={form.vertical} onValueChange={(value) => setForm({ ...form, vertical: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="farming">Farming</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.store_id} onValueChange={(value) => setForm({ ...form, store_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Store</SelectItem>
                    <SelectItem value="east">East Location</SelectItem>
                    <SelectItem value="west">West Location</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Supplier"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveItem}>Add Item</Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                <SelectItem value="main">Main Store</SelectItem>
                <SelectItem value="east">East Location</SelectItem>
                <SelectItem value="west">West Location</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verticalFilter} onValueChange={setVerticalFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Vertical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verticals</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="farming">Farming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">SKU</th>
                        <th className="text-left p-2">Stock</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Cost</th>
                        <th className="text-left p-2">Store</th>
                        <th className="text-left p-2">Vertical</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.sku}</td>
                          <td className="p-2">
                            <Badge variant={item.stock <= item.reorder_threshold ? "destructive" : "default"}>
                              {item.stock}
                            </Badge>
                          </td>
                          <td className="p-2">${item.price}</td>
                          <td className="p-2">${item.cost}</td>
                          <td className="p-2">{item.store_id}</td>
                          <td className="p-2">
                            <Badge variant="outline">{item.vertical}</Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => duplicateItem(item)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Reorder Alerts
                </CardTitle>
                <CardDescription>Items below reorder threshold</CardDescription>
              </CardHeader>
              <CardContent>
                {reorderItems.length === 0 ? (
                  <p className="text-muted-foreground">No items need reordering</p>
                ) : (
                  <ul className="space-y-2">
                    {reorderItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <Badge variant="destructive">{item.stock} left</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  Low Margin Items
                </CardTitle>
                <CardDescription>Items with less than 20% margin</CardDescription>
              </CardHeader>
              <CardContent>
                {lowMarginItems.length === 0 ? (
                  <p className="text-muted-foreground">All items have healthy margins</p>
                ) : (
                  <ul className="space-y-2">
                    {lowMarginItems.map((item) => {
                      const margin = item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0
                      return (
                        <li key={item.id} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <Badge variant="outline">{margin.toFixed(1)}%</Badge>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
