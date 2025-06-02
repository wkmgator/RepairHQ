"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { getInventoryCategories } from "@/lib/inventory-utils"

export default function ImportExportPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("import")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<{
    success: number
    errors: number
    messages: string[]
  } | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setImportResults(null)
    }
  }

  const handleImport = async () => {
    if (!importFile || !user?.id) return

    setImporting(true)
    setImportResults(null)

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // This is a simulation - in a real app, you'd parse the CSV/Excel file
      // and insert the data into your database
      const success = Math.floor(Math.random() * 20) + 5
      const errors = Math.floor(Math.random() * 3)

      const errorMessages = [
        "Row 3: Invalid SKU format",
        "Row 7: Missing required field 'name'",
        "Row 12: Invalid price format",
      ].slice(0, errors)

      setImportResults({
        success,
        errors,
        messages: errorMessages,
      })

      if (errors === 0) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${success} items`,
        })
      } else {
        toast({
          title: "Import completed with errors",
          description: `Imported ${success} items with ${errors} errors`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing inventory:", error)
      toast({
        title: "Import failed",
        description: "There was a problem importing your inventory data",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    if (!user?.id) return

    setExporting(true)

    try {
      // In a real app, you'd query your database and generate a CSV/Excel file
      const { data, error } = await supabase.from("inventory_items").select("*").order("name", { ascending: true })

      if (error) throw error

      // Convert data to CSV
      const headers = [
        "name",
        "sku",
        "category",
        "brand",
        "model",
        "quantity_in_stock",
        "min_stock_level",
        "max_stock_level",
        "unit_cost",
        "selling_price",
        "supplier",
        "supplier_part_number",
        "location",
        "description",
        "notes",
      ]

      const csvRows = [
        headers.join(","),
        ...(data || []).map((item) => {
          return headers
            .map((header) => {
              const value = item[header] || ""
              // Escape commas and quotes
              return typeof value === "string" && (value.includes(",") || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value
            })
            .join(",")
        }),
      ]

      const csvContent = csvRows.join("\n")

      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `inventory-export-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `Exported ${data?.length || 0} inventory items`,
      })
    } catch (error) {
      console.error("Error exporting inventory:", error)
      toast({
        title: "Export failed",
        description: "There was a problem exporting your inventory data",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const downloadTemplate = () => {
    const categories = getInventoryCategories().join("|")

    const templateHeaders = [
      "name*",
      "sku",
      `category* (${categories})`,
      "brand",
      "model",
      "quantity_in_stock*",
      "min_stock_level",
      "max_stock_level",
      "unit_cost*",
      "selling_price*",
      "supplier",
      "supplier_part_number",
      "location",
      "description",
      "notes",
    ]

    const exampleRow = [
      "iPhone 12 Screen Assembly",
      "SCR-AP-IPH-001",
      "Screen Parts",
      "Apple",
      "iPhone 12",
      "10",
      "5",
      "50",
      "45.99",
      "89.99",
      "Mobile Parts Inc",
      "AP-12-SCR-BLK",
      "Shelf A1",
      "Original quality replacement screen for iPhone 12",
      "Fragile item, handle with care",
    ]

    const csvContent = [templateHeaders.join(","), exampleRow.join(",")].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "inventory-import-template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <h1 className="text-3xl font-bold">Import & Export</h1>
          <p className="text-gray-600">Manage your inventory data in bulk</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Inventory</CardTitle>
              <CardDescription>Upload a CSV file to add or update multiple inventory items at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Upload CSV File</h3>
                  <p className="mt-1 text-xs text-gray-500">CSV file with inventory data</p>
                  <div className="mt-4">
                    <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        Choose File
                      </Button>
                    </label>
                    <Button variant="outline" onClick={downloadTemplate}>
                      Download Template
                    </Button>
                  </div>
                  {importFile && <div className="mt-4 text-sm text-gray-600">Selected file: {importFile.name}</div>}
                </div>
              </div>

              {importResults && (
                <div className={`p-4 rounded-lg ${importResults.errors > 0 ? "bg-red-50" : "bg-green-50"}`}>
                  <div className="flex items-start">
                    {importResults.errors > 0 ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">
                        {importResults.errors > 0 ? "Import completed with errors" : "Import successful"}
                      </h4>
                      <p className="text-sm mt-1">
                        Successfully imported {importResults.success} items
                        {importResults.errors > 0 && ` with ${importResults.errors} errors`}.
                      </p>
                      {importResults.errors > 0 && (
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                          {importResults.messages.map((msg, i) => (
                            <li key={i}>{msg}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Import Guidelines</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Use the template for the correct format</li>
                  <li>Fields marked with * are required</li>
                  <li>To update existing items, include the SKU</li>
                  <li>Items without SKUs will be created as new</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleImport} disabled={!importFile || importing}>
                {importing ? "Importing..." : "Import Data"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Inventory</CardTitle>
              <CardDescription>Download your inventory data as a CSV file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center">
                <Download className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Export All Inventory Items</h3>
                <p className="mt-1 text-xs text-gray-500">Download a CSV file containing all your inventory data</p>
                <Button onClick={handleExport} disabled={exporting} className="mt-4">
                  {exporting ? "Exporting..." : "Export to CSV"}
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Export Information</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>All inventory items will be included in the export</li>
                  <li>The file will be in CSV format</li>
                  <li>You can edit the file and re-import it to update your inventory</li>
                  <li>Stock history and transactions are not included</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
