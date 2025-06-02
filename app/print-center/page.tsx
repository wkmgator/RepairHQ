"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Printer,
  FileText,
  Tag,
  Barcode,
  Receipt,
  Settings,
  Wifi,
  Usb,
  Car,
  Smartphone,
  Wrench,
  Droplets,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { ThermalReceiptPrinter } from "@/components/thermal-receipt-printer"
import { AdvancedPrintQueue } from "@/components/advanced-print-queue"
import { OilChangeStickerGenerator } from "@/components/oil-change-sticker-generator"

export default function PrintCenterPage() {
  const [activePrinters, setActivePrinters] = useState([
    {
      id: "hp-laserjet-1",
      name: "HP LaserJet Pro M404n",
      type: "LaserJet",
      status: "online",
      connection: "ethernet",
      ip: "192.168.1.100",
      queueLength: 3,
    },
    {
      id: "star-tsp100-1",
      name: "Star TSP143III",
      type: "Thermal",
      status: "online",
      connection: "usb",
      queueLength: 1,
    },
    {
      id: "dymo-labelwriter-1",
      name: "DYMO LabelWriter 450",
      type: "Label",
      status: "offline",
      connection: "usb",
      queueLength: 0,
    },
  ])

  const getStatusIcon = (status: string) => {
    return status === "online" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case "ethernet":
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "usb":
        return <Usb className="h-4 w-4" />
      default:
        return <Printer className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Print Center</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/settings/printer">
              <Settings className="h-4 w-4 mr-2" />
              Printer Settings
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue">Print Queue</TabsTrigger>
          <TabsTrigger value="labels">Labels & Stickers</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="automotive">Automotive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Active Printers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Printer className="h-5 w-5 mr-2" />
                Active Printers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePrinters.map((printer) => (
                  <Card key={printer.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(printer.status)}
                        <span className="font-medium">{printer.name}</span>
                      </div>
                      {getConnectionIcon(printer.connection)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Type: {printer.type}</div>
                      <div>Connection: {printer.connection}</div>
                      {printer.ip && <div>IP: {printer.ip}</div>}
                      <div>Queue: {printer.queueLength} jobs</div>
                    </div>
                    <div className="mt-3">
                      <Badge variant={printer.status === "online" ? "default" : "destructive"}>{printer.status}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" asChild>
              <Link href="/print-center/labels">
                <div className="flex items-center space-x-3">
                  <Tag className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Print Labels</h3>
                    <p className="text-sm text-muted-foreground">Tickets, warranties, barcodes</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" asChild>
              <Link href="/invoices">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-medium">Print Invoices</h3>
                    <p className="text-sm text-muted-foreground">Professional invoices & receipts</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" asChild>
              <Link href="/pos/transactions">
                <div className="flex items-center space-x-3">
                  <Receipt className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-medium">POS Receipts</h3>
                    <p className="text-sm text-muted-foreground">Thermal receipt printing</p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" asChild>
              <Link href="/inventory/print-barcodes">
                <div className="flex items-center space-x-3">
                  <Barcode className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-medium">Inventory Barcodes</h3>
                    <p className="text-sm text-muted-foreground">Bulk barcode printing</p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>

          {/* Industry-Specific Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Industry-Specific Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Car className="h-6 w-6 text-blue-500" />
                    <h3 className="font-medium">Automotive</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• Oil change windshield stickers</div>
                    <div>• Tire service labels</div>
                    <div>• VIN inspection tags</div>
                    <div>• Service reminder stickers</div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Smartphone className="h-6 w-6 text-green-500" />
                    <h3 className="font-medium">Electronics</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• Phone repair warranty stickers</div>
                    <div>• Device identification labels</div>
                    <div>• Screen protector certificates</div>
                    <div>• Repair completion tags</div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Wrench className="h-6 w-6 text-orange-500" />
                    <h3 className="font-medium">Appliance</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• Service completion certificates</div>
                    <div>• Maintenance schedule stickers</div>
                    <div>• Warranty validation labels</div>
                    <div>• Safety inspection tags</div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue">
          <AdvancedPrintQueue />
        </TabsContent>

        <TabsContent value="labels">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Label Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/print-center/labels?type=ticket">
                    <Tag className="h-4 w-4 mr-2" />
                    Repair Ticket Labels
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/print-center/labels?type=warranty">
                    <Star className="h-4 w-4 mr-2" />
                    Warranty Stickers
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/print-center/labels?type=barcode">
                    <Barcode className="h-4 w-4 mr-2" />
                    Custom Barcodes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/inventory/print-barcodes">
                    <Barcode className="h-4 w-4 mr-2" />
                    Inventory Barcodes (Bulk)
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Label Printer Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>DYMO LabelWriter 450</span>
                    <Badge variant="destructive">Offline</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Brother QL-800</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Zebra ZD410</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <ThermalReceiptPrinter />
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Printing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Standard Invoice</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional invoice with company branding and detailed line items.
                  </p>
                  <Button variant="outline" className="w-full">
                    Print Standard Invoice
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Detailed Service Invoice</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive invoice with service details, parts used, and labor breakdown.
                  </p>
                  <Button variant="outline" className="w-full">
                    Print Service Invoice
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Quick Receipt</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Simple receipt format for quick transactions and payments.
                  </p>
                  <Button variant="outline" className="w-full">
                    Print Quick Receipt
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-2">Estimate/Quote</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional estimate with detailed pricing and terms.
                  </p>
                  <Button variant="outline" className="w-full">
                    Print Estimate
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automotive">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 mr-2" />
                  Oil Change Windshield Stickers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OilChangeStickerGenerator />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automotive Label Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Car className="h-4 w-4 mr-2" />
                    Vehicle Service Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wrench className="h-4 w-4 mr-2" />
                    Tire Service Stickers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Tag className="h-4 w-4 mr-2" />
                    VIN Inspection Tags
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Warranty Certificates
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Printer Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>LaserJet Printers</span>
                      <Badge variant="default">✓ Compatible</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Thermal Printers</span>
                      <Badge variant="default">✓ Compatible</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Label Printers</span>
                      <Badge variant="default">✓ Compatible</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inkjet Printers</span>
                      <Badge variant="secondary">Limited</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
