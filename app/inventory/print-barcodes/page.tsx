"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function PrintBarcodes() {
  const { toast } = useToast()
  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copies, setCopies] = useState<{ [key: string]: number }>({})
  const [labelSize, setLabelSize] = useState("medium")
  const [showBarcodeValue, setShowBarcodeValue] = useState(true)
  const [showItemName, setShowItemName] = useState(true)
  const [showPrice, setShowPrice] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("inventory_items").select("*").order("name")

        if (error) throw error

        setItems(data || [])
        setFilteredItems(data || [])

        // Extract unique categories
        const uniqueCategories = [...new Set(data?.map((item) => item.category) || [])]
        setCategories(uniqueCategories.filter(Boolean).sort())

        // Initialize copies state
        const initialCopies: { [key: string]: number } = {}
        data?.forEach((item) => {
          initialCopies[item.id] = 1
        })
        setCopies(initialCopies)
      } catch (error) {
        console.error("Error fetching inventory items:", error)
        toast({
          title: "Error",
          description: "Failed to load inventory items",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [toast])

  useEffect(() => {
    // Filter items based on search query and category
    let filtered = items

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          (item.barcode && item.barcode.toLowerCase().includes(query)),
      )
    }

    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [searchQuery, categoryFilter, items])

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const updateCopies = (itemId: string, value: number) => {
    setCopies({
      ...copies,
      [itemId]: Math.max(1, value), // Ensure at least 1 copy
    })
  }

  const printBarcodes = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to print barcodes.",
        variant: "destructive",
      })
      return
    }

    // Generate barcode images
    const selectedItemsData = filteredItems.filter((item) => selectedItems.includes(item.id))

    // Open a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to print barcodes.",
        variant: "destructive",
      })
      return
    }

    // Write the HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Barcodes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .barcode-container {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: flex-start;
            }
            .barcode-label {
              border: 1px dashed #ccc;
              padding: 10px;
              text-align: center;
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .barcode-label.small {
              width: 150px;
            }
            .barcode-label.medium {
              width: 200px;
            }
            .barcode-label.large {
              width: 300px;
            }
            .item-name {
              font-weight: bold;
              font-size: 12px;
              margin-top: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-price {
              font-size: 14px;
              margin-top: 3px;
            }
            .barcode-value {
              font-family: monospace;
              font-size: 10px;
              margin-top: 3px;
            }
            @media print {
              @page {
                margin: 0.5cm;
              }
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()">Print Barcodes</button>
            <button onclick="window.close()">Close</button>
          </div>
          <div class="barcode-container">
    `)

    // Add barcode elements
    selectedItemsData.forEach((item) => {
      const numCopies = copies[item.id] || 1
      const barcodeValue = item.barcode || item.sku

      for (let i = 0; i < numCopies; i++) {
        printWindow.document.write(`
          <div class="barcode-label ${labelSize}">
            <canvas id="barcode-${item.id}-${i}"></canvas>
            ${showItemName ? `<div class="item-name">${item.name}</div>` : ""}
            ${showPrice ? `<div class="item-price">$${item.selling_price?.toFixed(2) || "0.00"}</div>` : ""}
            ${showBarcodeValue ? `<div class="barcode-value">${barcodeValue}</div>` : ""}
          </div>
        `)
      }
    })

    printWindow.document.write(`
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = function() {
    `)

    // Add script to generate barcodes
    selectedItemsData.forEach((item) => {
      const numCopies = copies[item.id] || 1
      const barcodeValue = item.barcode || item.sku

      for (let i = 0; i < numCopies; i++) {
        printWindow.document.write(`
          try {
            JsBarcode("#barcode-${item.id}-${i}", "${barcodeValue}", {
              format: "CODE128",
              width: ${labelSize === "small" ? 1 : labelSize === "medium" ? 1.5 : 2},
              height: ${labelSize === "small" ? 40 : labelSize === "medium" ? 50 : 60},
              displayValue: false,
              margin: 0
            });
          } catch(e) {
            console.error("Error generating barcode for ${item.name}:", e);
          }
        `)
      }
    })

    printWindow.document.write(`
            }
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/inventory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Print Inventory Barcodes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcode Print Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="labelSize">Label Size</Label>
              <Select value={labelSize} onValueChange={setLabelSize}>
                <SelectTrigger id="labelSize">
                  <SelectValue placeholder="Select label size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1.5" x 0.75")</SelectItem>
                  <SelectItem value="medium">Medium (2" x 1")</SelectItem>
                  <SelectItem value="large">Large (3" x 1.5")</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Display Options</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showBarcodeValue"
                    checked={showBarcodeValue}
                    onCheckedChange={(checked) => setShowBarcodeValue(!!checked)}
                  />
                  <Label htmlFor="showBarcodeValue">Show Barcode Value</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showItemName"
                    checked={showItemName}
                    onCheckedChange={(checked) => setShowItemName(!!checked)}
                  />
                  <Label htmlFor="showItemName">Show Item Name</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="showPrice" checked={showPrice} onCheckedChange={(checked) => setShowPrice(!!checked)} />
                  <Label htmlFor="showPrice">Show Price</Label>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={printBarcodes}>
                <Printer className="h-4 w-4 mr-2" />
                Print Selected Barcodes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Select Items for Printing</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleSelectAll}>
              {selectedItems.length === filteredItems.length ? "Deselect All" : "Select All"}
            </Button>
            <Button variant="outline" size="sm" disabled={selectedItems.length === 0} onClick={printBarcodes}>
              <Printer className="h-4 w-4 mr-2" />
              Print ({selectedItems.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-left">
                    <div className="flex items-center">
                      <Checkbox
                        checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </div>
                  </th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-left">SKU/Barcode</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Copies</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No items found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-muted/50">
                      <td className="p-2">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          aria-label={`Select ${item.name}`}
                        />
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="p-2">
                        <div className="font-mono text-sm">{item.barcode || item.sku}</div>
                      </td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">${item.selling_price?.toFixed(2) || "0.00"}</td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          value={copies[item.id] || 1}
                          onChange={(e) => updateCopies(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
