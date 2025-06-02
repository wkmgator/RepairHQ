"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Package,
  Scan,
  Plus,
  AlertTriangle,
  Truck,
  Search,
  Edit,
  Trash2,
  Download,
  QrCode,
  Barcode,
  ShoppingCart,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  payment_terms: string
  lead_time_days: number
  rating: number
  is_active: boolean
}

interface PurchaseOrder {
  id: string
  po_number: string
  supplier_id: string
  supplier?: Supplier
  status: string
  order_date: string
  expected_delivery: string
  total_amount: number
  notes: string
  items: PurchaseOrderItem[]
}

interface PurchaseOrderItem {
  id: string
  inventory_item_id: string
  quantity: number
  unit_cost: number
  total_cost: number
  item?: any
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  barcode?: string
  category: string
  quantity_in_stock: number
  min_stock_level: number
  max_stock_level: number
  unit_cost: number
  selling_price: number
  supplier_id?: string
  location: string
  warranty_period_months?: number
  compatibility?: string[]
}

export default function AdvancedInventoryManagement() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inventory")
  const [items, setItems] = useState<InventoryItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [showNewPO, setShowNewPO] = useState(false)
  const [newPO, setNewPO] = useState({
    supplier_id: "defaultSupplierId", // Updated default value
    expected_delivery: "",
    notes: "",
    items: [] as any[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch inventory items
      const { data: inventoryData } = await supabase
        .from("inventory_items")
        .select("*")
        .order("name", { ascending: true })

      // Fetch suppliers
      const { data: suppliersData } = await supabase
        .from("suppliers")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true })

      // Fetch purchase orders
      const { data: poData } = await supabase
        .from("purchase_orders")
        .select(`
          *,
          supplier:suppliers(*),
          items:purchase_order_items(*)
        `)
        .order("created_at", { ascending: false })

      setItems(inventoryData || [])
      setSuppliers(suppliersData || [])
      setPurchaseOrders(poData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBarcode = (sku: string) => {
    // In a real app, this would generate an actual barcode
    return `BC${sku.replace(/[^A-Z0-9]/g, "").substring(0, 10)}`
  }

  const handleBarcodeScanned = (barcode: string) => {
    const item = items.find((i) => i.barcode === barcode || i.sku === barcode)
    if (item) {
      alert(`Found item: ${item.name} (Stock: ${item.quantity_in_stock})`)
    } else {
      alert("Item not found in inventory")
    }
    setShowBarcodeScanner(false)
  }

  const createPurchaseOrder = async () => {
    try {
      const poNumber = `PO-${Date.now()}`
      const totalAmount = newPO.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0)

      const { data: poData, error: poError } = await supabase
        .from("purchase_orders")
        .insert({
          po_number: poNumber,
          supplier_id: newPO.supplier_id,
          status: "pending",
          order_date: new Date().toISOString().split("T")[0],
          expected_delivery: newPO.expected_delivery,
          total_amount: totalAmount,
          notes: newPO.notes,
        })
        .select()
        .single()

      if (poError) throw poError

      // Insert PO items
      const poItems = newPO.items.map((item) => ({
        po_id: poData.id,
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total_cost: item.quantity * item.unit_cost,
      }))

      const { error: itemsError } = await supabase.from("purchase_order_items").insert(poItems)

      if (itemsError) throw itemsError

      alert("Purchase order created successfully!")
      setShowNewPO(false)
      setNewPO({ supplier_id: "defaultSupplierId", expected_delivery: "", notes: "", items: [] }) // Updated default value
      fetchData()
    } catch (error) {
      console.error("Error creating purchase order:", error)
      alert("Error creating purchase order")
    }
  }

  const addItemToPO = () => {
    setNewPO({
      ...newPO,
      items: [
        ...newPO.items,
        {
          inventory_item_id: "",
          quantity: 1,
          unit_cost: 0,
        },
      ],
    })
  }

  const updatePOItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newPO.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewPO({ ...newPO, items: updatedItems })
  }

  const removePOItem = (index: number) => {
    const updatedItems = newPO.items.filter((_, i) => i !== index)
    setNewPO({ ...newPO, items: updatedItems })
  }

  const getLowStockItems = () => {
    return items.filter((item) => item.quantity_in_stock <= item.min_stock_level)
  }

  const getOutOfStockItems = () => {
    return items.filter((item) => item.quantity_in_stock === 0)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSupplier = !selectedSupplier || item.supplier_id === selectedSupplier

    return matchesSearch && matchesSupplier
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Inventory Management</h1>
          <p className="text-gray-600">Complete inventory control with barcode scanning and supplier management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
            <Scan className="w-4 h-4 mr-2" />
            Scan Barcode
          </Button>
          <Button onClick={() => setShowNewPO(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{getLowStockItems().length}</div>
            <p className="text-xs text-muted-foreground">Items below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getOutOfStockItems().length}</div>
            <p className="text-xs text-muted-foreground">Items with zero quantity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Verified suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="compatibility">Parts Compatibility</TabsTrigger>
          <TabsTrigger value="warranty">Warranty Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items by name, SKU, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Suppliers</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Item</th>
                      <th className="text-left py-3 px-4 font-medium">SKU/Barcode</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Stock</th>
                      <th className="text-left py-3 px-4 font-medium">Cost</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.location}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-sm">
                            <div>{item.sku}</div>
                            {item.barcode && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Barcode className="w-3 h-3 mr-1" />
                                {item.barcode}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.quantity_in_stock}</span>
                            <span className="text-sm text-gray-500">/ {item.min_stock_level}</span>
                            {item.quantity_in_stock <= item.min_stock_level && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatCurrency(item.unit_cost)}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              item.quantity_in_stock === 0
                                ? "bg-red-100 text-red-800"
                                : item.quantity_in_stock <= item.min_stock_level
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {item.quantity_in_stock === 0
                              ? "Out of Stock"
                              : item.quantity_in_stock <= item.min_stock_level
                                ? "Low Stock"
                                : "In Stock"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Supplier Management</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <CardDescription>{supplier.contact_person}</CardDescription>
                        </div>
                        <Badge variant="outline">{supplier.rating}/5.0</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {supplier.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {supplier.phone}
                        </div>
                        <div>
                          <span className="font-medium">Lead Time:</span> {supplier.lead_time_days} days
                        </div>
                        <div>
                          <span className="font-medium">Payment Terms:</span> {supplier.payment_terms}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">PO Number</th>
                      <th className="text-left py-3 px-4 font-medium">Supplier</th>
                      <th className="text-left py-3 px-4 font-medium">Order Date</th>
                      <th className="text-left py-3 px-4 font-medium">Expected Delivery</th>
                      <th className="text-left py-3 px-4 font-medium">Total Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono">{po.po_number}</td>
                        <td className="py-3 px-4">{po.supplier?.name}</td>
                        <td className="py-3 px-4">{new Date(po.order_date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(po.expected_delivery).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{formatCurrency(po.total_amount)}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              po.status === "received"
                                ? "bg-green-100 text-green-800"
                                : po.status === "sent"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compatibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parts Compatibility Database</CardTitle>
              <CardDescription>Manage device compatibility for inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Parts Compatibility</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track which parts are compatible with specific device models and brands.
                </p>
                <div className="mt-6">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Compatibility Rule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warranty Tracking System</CardTitle>
              <CardDescription>Monitor warranty periods and coverage for parts and repairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Warranty Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track warranty periods, coverage details, and expiration dates for all parts and services.
                </p>
                <div className="mt-6">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Warranty Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Barcode Scanner Modal */}
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Barcode Scanner</DialogTitle>
            <DialogDescription>Scan a barcode to quickly find inventory items</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Scan className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Position barcode in camera view</p>
              <p className="text-xs text-gray-500">Camera access required</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Or enter barcode manually" />
              <Button onClick={() => handleBarcodeScanned("BC123456789")}>Search</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Purchase Order Modal */}
      <Dialog open={showNewPO} onOpenChange={setShowNewPO}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Generate a new purchase order for inventory restocking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Supplier</label>
                <Select value={newPO.supplier_id} onValueChange={(value) => setNewPO({ ...newPO, supplier_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Expected Delivery</label>
                <Input
                  type="date"
                  value={newPO.expected_delivery}
                  onChange={(e) => setNewPO({ ...newPO, expected_delivery: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newPO.notes}
                onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                placeholder="Additional notes or special instructions"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Items</h3>
                <Button onClick={addItemToPO} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-2">
                {newPO.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <Select
                      value={item.inventory_item_id}
                      onValueChange={(value) => updatePOItem(index, "inventory_item_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((invItem) => (
                          <SelectItem key={invItem.id} value={invItem.id}>
                            {invItem.name} ({invItem.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updatePOItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Unit Cost"
                      value={item.unit_cost}
                      onChange={(e) => updatePOItem(index, "unit_cost", Number.parseFloat(e.target.value) || 0)}
                    />
                    <div className="text-sm font-medium">{formatCurrency(item.quantity * item.unit_cost)}</div>
                    <Button variant="ghost" size="sm" onClick={() => removePOItem(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {newPO.items.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(newPO.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPO(false)}>
                Cancel
              </Button>
              <Button onClick={createPurchaseOrder} disabled={!newPO.supplier_id || newPO.items.length === 0}>
                Create Purchase Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
