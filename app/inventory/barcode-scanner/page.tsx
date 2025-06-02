"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { BarcodeGenerator } from "@/components/barcode-generator"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer, Edit, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { BarcodeType } from "@/lib/barcode-utils"

export default function InventoryBarcodeScanner() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("scan")
  const [scannedItem, setScannedItem] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBarcodeDetected = async (result: string) => {
    setIsLoading(true)
    try {
      // First try to find by barcode
      let { data, error } = await supabase.from("inventory_items").select("*").eq("barcode", result).maybeSingle()

      // If not found by barcode, try by SKU
      if (!data && !error) {
        const { data: skuData, error: skuError } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("sku", result)
          .maybeSingle()

        if (skuError) throw skuError
        data = skuData
      }

      if (error) throw error

      if (data) {
        setScannedItem(data)
        toast({
          title: "Item Found",
          description: `Found: ${data.name}`,
        })
      } else {
        toast({
          title: "Item Not Found",
          description: "No inventory item found with this barcode or SKU.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching for barcode:", error)
      toast({
        title: "Error",
        description: "There was an error searching for the item.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintBarcode = () => {
    // Implementation for printing barcode
    window.print()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/inventory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan Barcode</TabsTrigger>
          <TabsTrigger value="generate">Generate Barcode</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan Inventory Barcode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BarcodeScanner onDetected={handleBarcodeDetected} placeholder="Enter barcode or SKU manually..." />

              {isLoading && (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {scannedItem && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Item Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{scannedItem.name}</h3>
                        <div className="text-sm text-gray-500">
                          <div>SKU: {scannedItem.sku}</div>
                          {scannedItem.barcode && <div>Barcode: {scannedItem.barcode}</div>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Category</div>
                          <div>{scannedItem.category}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">In Stock</div>
                          <div>{scannedItem.quantity_in_stock} units</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Cost</div>
                          <div>${scannedItem.unit_cost?.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Price</div>
                          <div>${scannedItem.selling_price?.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button variant="outline" onClick={() => router.push(`/inventory/${scannedItem.id}`)}>
                          <Package className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" onClick={() => router.push(`/inventory/${scannedItem.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Item
                        </Button>
                        <Button variant="outline" onClick={handlePrintBarcode}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Barcode
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Inventory Barcodes</CardTitle>
            </CardHeader>
            <CardContent>
              <BarcodeGenerator
                initialType={BarcodeType.CODE128}
                onGenerate={(barcode) => {
                  toast({
                    title: "Barcode Generated",
                    description: `New barcode: ${barcode}`,
                  })
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
