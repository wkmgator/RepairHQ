"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Tag, Ticket, Barcode } from "lucide-react"
import Link from "next/link"
import { WarrantyStickerGenerator } from "@/components/warranty-sticker-generator"
import { TicketLabelGenerator } from "@/components/ticket-label-generator"
import { BarcodeGenerator } from "@/components/barcode-generator"
import { BarcodeType } from "@/lib/barcode-utils"

export default function PrintLabelsPage() {
  const [activeTab, setActiveTab] = useState("ticket")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/print-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Print Center
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Print Labels & Stickers</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ticket" className="flex items-center">
            <Ticket className="h-4 w-4 mr-2" />
            Ticket Labels
          </TabsTrigger>
          <TabsTrigger value="warranty" className="flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Warranty Stickers
          </TabsTrigger>
          <TabsTrigger value="barcode" className="flex items-center">
            <Barcode className="h-4 w-4 mr-2" />
            Custom Barcodes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ticket" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Ticket Label Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate and print customer ticket labels for repair jobs. These labels can be attached to devices or
                  repair bags.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span>3" x 2" (76mm x 51mm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Recommended Paper:</span>
                    <span>Adhesive Label Paper</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Compatible Printers:</span>
                    <span>Dymo, Zebra, Standard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TicketLabelGenerator />
          </div>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Warranty Sticker Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate and print warranty stickers for completed repairs. These stickers serve as proof of warranty
                  for your customers.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Size:</span>
                    <span>3.5" x 2" (89mm x 51mm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Recommended Paper:</span>
                    <span>Tamper-Evident Label Paper</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Compatible Printers:</span>
                    <span>Dymo, Zebra, Standard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <WarrantyStickerGenerator />
          </div>
        </TabsContent>

        <TabsContent value="barcode" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Barcode className="h-5 w-5 mr-2" />
                  Custom Barcode Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate and print custom barcodes for inventory, assets, or any other purpose. Multiple barcode
                  formats are supported.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Supported Formats:</span>
                    <span>CODE128, EAN-13, UPC-A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Recommended Paper:</span>
                    <span>Standard or Label Paper</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bulk Printing:</span>
                    <span>
                      <Link href="/inventory/print-barcodes" className="text-primary hover:underline">
                        Inventory Barcodes
                      </Link>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <BarcodeGenerator initialType={BarcodeType.CODE128} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
