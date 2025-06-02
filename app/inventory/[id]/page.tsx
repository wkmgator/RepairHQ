"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { formatCurrency, getStockStatus, getStockStatusColor } from "@/lib/inventory-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Printer,
  BarChart2,
  History,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { InventoryItem } from "@/lib/supabase-types"
import { StockAdjustmentModal } from "@/components/stock-adjustment-modal"
import { InventoryHistoryTable } from "@/components/inventory-history-table"
import { QRCode } from "@/components/qr-code"

export default function InventoryItemPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [stockHistory, setStockHistory] = useState([])
  const [relatedItems, setRelatedItems] = useState([])

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*, specific_attributes, custom_fields")
          .eq("id", params.id)
          .single()

        if (error) throw error
        setItem(data)

        // Fetch stock history
        const { data: historyData, error: historyError } = await supabase
          .from("inventory_transactions")
          .select("*")
          .eq("item_id", params.id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (historyError) throw historyError
        setStockHistory(historyData || [])

        // Fetch related items (same category)
        if (data.item_category) {
          // Changed from category to item_category
          const { data: relatedData, error: relatedError } = await supabase
            .from("inventory_items")
            .select("*")
            .eq("item_category", data.item_category) // Changed
            .neq("id", params.id)
            .limit(5)

          if (relatedError) throw relatedError
          setRelatedItems(relatedData || [])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading inventory item:", error)
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItem()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Item not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The inventory item you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link href="/inventory">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Inventory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus({
    quantity: item.quantity_in_stock || 0,
    minStockLevel: item.min_stock_level || 0,
  })

  const stockStatusColor = getStockStatusColor(stockStatus)
  const profitMargin =
    item.selling_price && item.unit_cost ? ((item.selling_price - item.unit_cost) / item.selling_price) * 100 : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/inventory">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-mono">{item.sku}</span>
              {item.item_category && <Badge variant="outline">{item.item_category}</Badge>} {/* Changed */}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Link href={`/inventory/${item.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Comprehensive information about this inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-sm text-gray-900">{item.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">SKU</dt>
                      <dd className="text-sm font-mono text-gray-900">{item.sku}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900">{item.item_category}</dd> {/* Changed */}
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Item Type</dt>
                      <dd className="text-sm text-gray-900">{item.item_type || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Brand</dt>
                      <dd className="text-sm text-gray-900">{item.brand || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Model</dt>
                      <dd className="text-sm text-gray-900">{item.model || "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pricing & Stock</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Cost Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(item.unit_cost || 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Selling Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(item.selling_price || 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Profit Margin</dt>
                      <dd className="text-sm text-gray-900">{profitMargin.toFixed(1)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                      <dd className="text-sm text-gray-900">
                        <Badge className={stockStatusColor}>{item.quantity_in_stock || 0} in stock</Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Min Stock Level</dt>
                      <dd className="text-sm text-gray-900">{item.min_stock_level || 0}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {item.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <Separator className="my-2" />
                  <p className="text-sm text-gray-900">{item.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Supplier Information</h3>
                <Separator className="my-2" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                    <dd className="text-sm text-gray-900">{item.supplier || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Supplier Part #</dt>
                    <dd className="text-sm text-gray-900">{item.supplier_part_number || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{item.location || "—"}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardContent className="space-y-6 pt-0">
              {" "}
              {/* Added pt-0 to avoid double padding */}
              {item.specific_attributes && Object.keys(item.specific_attributes).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specific Attributes</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    {Object.entries(item.specific_attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</dt>
                        <dd className="text-sm text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {item.custom_fields && Object.keys(item.custom_fields).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Custom Fields</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    {Object.entries(item.custom_fields).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</dt>
                        <dd className="text-sm text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setAdjustModalOpen(true)}>
                Adjust Stock
              </Button>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(item.updated_at).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>

          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-2" />
                Stock History
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart2 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stock History</CardTitle>
                  <CardDescription>Record of all stock movements for this item</CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryHistoryTable history={stockHistory} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Item Analytics</CardTitle>
                  <CardDescription>Usage patterns and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">30-Day Sales</h4>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">12 units</p>
                      <p className="text-xs text-gray-500">+8% from previous period</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Revenue Generated</h4>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(item.selling_price * 12 || 0)}</p>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Avg. Days in Stock</h4>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-2xl font-bold mt-2">18 days</p>
                      <p className="text-xs text-gray-500">-5 days from average</p>
                    </div>
                  </div>
                  <div className="h-64 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                    <p className="text-gray-500">Sales trend chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-6 mb-4">
                  <Package className="h-10 w-10 text-gray-600" />
                </div>
                <div className="text-5xl font-bold">{item.quantity_in_stock || 0}</div>
                <Badge className={`${stockStatusColor} mt-2`}>{stockStatus.replace("_", " ").toUpperCase()}</Badge>
                <div className="mt-4 text-sm text-gray-500">
                  {stockStatus === "in_stock" && "Stock levels are healthy."}
                  {stockStatus === "low_stock" && (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Below minimum stock level ({item.min_stock_level})
                    </div>
                  )}
                  {stockStatus === "out_of_stock" && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Item is out of stock!
                    </div>
                  )}
                </div>
                <Button className="w-full mt-4" onClick={() => setAdjustModalOpen(true)}>
                  Adjust Stock
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Identification</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <QRCode value={`${item.id}|${item.sku}|${item.name}`} size={150} />
              <p className="text-xs text-center mt-2 text-gray-500">Scan to quickly access this item</p>
            </CardContent>
          </Card>

          {relatedItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {relatedItems.map((relItem) => (
                    <li key={relItem.id} className="text-sm">
                      <Link href={`/inventory/${relItem.id}`} className="text-blue-600 hover:underline">
                        {relItem.name}
                      </Link>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-500">{formatCurrency(relItem.selling_price || 0)}</span>
                        <Badge variant="outline" className="text-xs">
                          {relItem.quantity_in_stock || 0} in stock
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StockAdjustmentModal
        open={adjustModalOpen}
        onOpenChange={setAdjustModalOpen}
        item={item}
        onAdjustmentComplete={(updatedItem) => {
          setItem(updatedItem)
          // Refresh history
          const fetchHistory = async () => {
            const { data } = await supabase
              .from("inventory_transactions")
              .select("*")
              .eq("item_id", item.id)
              .order("created_at", { ascending: false })
              .limit(50)

            setStockHistory(data || [])
          }
          fetchHistory()
        }}
      />
    </div>
  )
}
