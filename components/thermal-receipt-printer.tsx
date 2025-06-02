"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Printer, Settings, CheckCircle, AlertCircle, RefreshCw, Download, Eye, Copy, QrCode, Star } from "lucide-react"
import { StarTSP100Service, STAR_TSP100_CONFIGS } from "@/lib/star-tsp100-service"

interface ReceiptData {
  receiptNumber: string
  timestamp: Date
  storeInfo: {
    name: string
    address: string
    phone: string
    email: string
    website: string
    taxId: string
  }
  customer?: {
    name: string
    phone: string
    email?: string
    loyaltyPoints: number
  }
  items: Array<{
    name: string
    sku: string
    quantity: number
    unitPrice: number
    totalPrice: number
    category: string
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
  cashReceived?: number
  change?: number
  employeeName: string
  loyaltyPointsEarned: number
  promotionalMessage?: string
}

interface PrinterStatus {
  connected: boolean
  model: string
  paperStatus: "ok" | "low" | "empty"
  temperature: "normal" | "hot"
  lastPrint: Date | null
}

export function ThermalReceiptPrinter() {
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({
    connected: true,
    model: "Epson TM-T88VI",
    paperStatus: "ok",
    temperature: "normal",
    lastPrint: new Date(),
  })

  const [starPrinter, setStarPrinter] = useState<StarTSP100Service | null>(null)

  useEffect(() => {
    // Initialize Star TSP100 printer
    const printer = new StarTSP100Service(STAR_TSP100_CONFIGS.TSP143III_USB)
    setStarPrinter(printer)
  }, [])

  const [isTestPrinting, setIsTestPrinting] = useState(false)
  const [receiptPreview, setReceiptPreview] = useState<ReceiptData | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  // Sample receipt data
  const sampleReceipt: ReceiptData = {
    receiptNumber: "RCP-20241226-001",
    timestamp: new Date(),
    storeInfo: {
      name: "RepairHQ - Downtown",
      address: "123 Main Street, Suite 100\nNew York, NY 10001",
      phone: "(555) 123-4567",
      email: "downtown@repairhq.com",
      website: "www.repairhq.com",
      taxId: "TAX-ID: 12-3456789",
    },
    customer: {
      name: "John Smith",
      phone: "(555) 987-6543",
      email: "john@example.com",
      loyaltyPoints: 450,
    },
    items: [
      {
        name: "iPhone 15 Screen Repair",
        sku: "RPR-IP15-SCR",
        quantity: 1,
        unitPrice: 299.99,
        totalPrice: 299.99,
        category: "repair",
      },
      {
        name: "Screen Protector Installation",
        sku: "SRV-SCR-PROT",
        quantity: 1,
        unitPrice: 19.99,
        totalPrice: 19.99,
        category: "service",
      },
      {
        name: "iPhone 15 Pro Case",
        sku: "ACC-IP15P-CASE",
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99,
        category: "accessory",
      },
    ],
    subtotal: 369.97,
    discount: 36.99,
    tax: 29.14,
    total: 362.12,
    paymentMethod: "Credit Card",
    employeeName: "Sarah Johnson",
    loyaltyPointsEarned: 36,
    promotionalMessage: "Thank you for choosing RepairHQ! Follow us @RepairHQ for tips and deals.",
  }

  const printTestReceipt = async () => {
    if (!starPrinter) return

    setIsTestPrinting(true)
    try {
      await starPrinter.printTestPage()
      setPrinterStatus({
        ...printerStatus,
        lastPrint: new Date(),
      })
      alert("Test receipt printed successfully!")
    } catch (error) {
      console.error("Print error:", error)
      alert("Print failed")
    } finally {
      setIsTestPrinting(false)
    }
  }

  const printReceipt = async (receiptData: ReceiptData) => {
    if (!starPrinter) return false

    try {
      await starPrinter.printReceipt(receiptData)
      setPrinterStatus({
        ...printerStatus,
        lastPrint: new Date(),
      })
      return true
    } catch (error) {
      console.error("Print error:", error)
      return false
    }
  }

  const generateESCPOSCommands = (receipt: ReceiptData): string => {
    let commands = ""

    // Initialize printer
    commands += "\x1B\x40" // ESC @ - Initialize
    commands += "\x1B\x61\x01" // ESC a 1 - Center alignment

    // Store header
    commands += "\x1B\x21\x30" // ESC ! 0x30 - Double height/width
    commands += `${receipt.storeInfo.name}\n`
    commands += "\x1B\x21\x00" // ESC ! 0x00 - Normal text
    commands += `${receipt.storeInfo.address}\n`
    commands += `${receipt.storeInfo.phone}\n`
    commands += `${receipt.storeInfo.email}\n\n`

    // Receipt info
    commands += "\x1B\x61\x00" // ESC a 0 - Left alignment
    commands += `Receipt: ${receipt.receiptNumber}\n`
    commands += `Date: ${receipt.timestamp.toLocaleString()}\n`
    commands += `Cashier: ${receipt.employeeName}\n\n`

    // Customer info
    if (receipt.customer) {
      commands += `Customer: ${receipt.customer.name}\n`
      commands += `Phone: ${receipt.customer.phone}\n`
      commands += `Loyalty Points: ${receipt.customer.loyaltyPoints}\n\n`
    }

    // Items
    commands += "--------------------------------\n"
    commands += "ITEMS\n"
    commands += "--------------------------------\n"

    receipt.items.forEach((item) => {
      commands += `${item.name}\n`
      commands += `  ${item.sku}\n`
      commands += `  ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.totalPrice.toFixed(2)}\n\n`
    })

    // Totals
    commands += "--------------------------------\n"
    commands += `Subtotal:        $${receipt.subtotal.toFixed(2)}\n`
    if (receipt.discount > 0) {
      commands += `Discount:       -$${receipt.discount.toFixed(2)}\n`
    }
    commands += `Tax:             $${receipt.tax.toFixed(2)}\n`
    commands += "--------------------------------\n"
    commands += "\x1B\x21\x20" // ESC ! 0x20 - Double width
    commands += `TOTAL:           $${receipt.total.toFixed(2)}\n`
    commands += "\x1B\x21\x00" // ESC ! 0x00 - Normal text
    commands += "--------------------------------\n\n"

    // Payment info
    commands += `Payment Method: ${receipt.paymentMethod}\n`
    if (receipt.cashReceived) {
      commands += `Cash Received:   $${receipt.cashReceived.toFixed(2)}\n`
      commands += `Change:          $${receipt.change?.toFixed(2)}\n`
    }
    commands += "\n"

    // Loyalty points
    if (receipt.loyaltyPointsEarned > 0) {
      commands += `Points Earned: ${receipt.loyaltyPointsEarned}\n\n`
    }

    // Footer
    commands += "\x1B\x61\x01" // ESC a 1 - Center alignment
    commands += "Thank you for your business!\n"
    commands += `${receipt.storeInfo.website}\n`
    if (receipt.promotionalMessage) {
      commands += `\n${receipt.promotionalMessage}\n`
    }
    commands += "\n\n\n"

    // Cut paper
    commands += "\x1D\x56\x42\x00" // GS V B 0 - Full cut

    return commands
  }

  const downloadReceiptPDF = () => {
    // In real implementation, generate PDF
    alert("PDF receipt downloaded!")
  }

  const copyReceiptText = () => {
    if (receiptRef.current) {
      const text = receiptRef.current.innerText
      navigator.clipboard.writeText(text)
      alert("Receipt copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Thermal Receipt Printer</h1>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {printerStatus.connected ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
            </div>

            <Button variant="outline" onClick={() => setReceiptPreview(sampleReceipt)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Receipt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Printer Status & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Printer Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Printer className="h-5 w-5 mr-2" />
                  Printer Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Model:</span>
                  <span className="text-sm">{printerStatus.model}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection:</span>
                  <Badge variant={printerStatus.connected ? "default" : "destructive"}>
                    {printerStatus.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Paper:</span>
                  <Badge
                    variant={
                      printerStatus.paperStatus === "ok"
                        ? "default"
                        : printerStatus.paperStatus === "low"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {printerStatus.paperStatus === "ok" ? "OK" : printerStatus.paperStatus === "low" ? "Low" : "Empty"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Temperature:</span>
                  <Badge variant={printerStatus.temperature === "normal" ? "default" : "secondary"}>
                    {printerStatus.temperature === "normal" ? "Normal" : "Hot"}
                  </Badge>
                </div>

                {printerStatus.lastPrint && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Print:</span>
                    <span className="text-sm">{printerStatus.lastPrint.toLocaleTimeString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Printer Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Printer Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={printTestReceipt}
                  disabled={isTestPrinting || !printerStatus.connected}
                >
                  {isTestPrinting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Test Receipt
                    </>
                  )}
                </Button>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect Printer
                </Button>

                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Printer Settings
                </Button>

                <Button variant="outline" className="w-full">
                  Open Cash Drawer
                </Button>
              </CardContent>
            </Card>

            {/* Print Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Print Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Paper Width</label>
                  <Input defaultValue="80mm" className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Print Density</label>
                  <Input defaultValue="Medium" className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Cut Type</label>
                  <Input defaultValue="Full Cut" className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Auto Print</label>
                  <Input defaultValue="Enabled" className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Receipt Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Receipt Preview
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={copyReceiptText}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadReceiptPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    {receiptPreview && (
                      <Button size="sm" onClick={() => printReceipt(receiptPreview)}>
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {receiptPreview ? (
                  <div
                    ref={receiptRef}
                    className="bg-white p-6 font-mono text-sm border-2 border-dashed border-gray-300 max-w-sm mx-auto"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    {/* Store Header */}
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold">{receiptPreview.storeInfo.name}</div>
                      <div className="whitespace-pre-line">{receiptPreview.storeInfo.address}</div>
                      <div>{receiptPreview.storeInfo.phone}</div>
                      <div>{receiptPreview.storeInfo.email}</div>
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-3"></div>

                    {/* Receipt Info */}
                    <div className="mb-3">
                      <div>Receipt: {receiptPreview.receiptNumber}</div>
                      <div>Date: {receiptPreview.timestamp.toLocaleString()}</div>
                      <div>Cashier: {receiptPreview.employeeName}</div>
                    </div>

                    {/* Customer Info */}
                    {receiptPreview.customer && (
                      <div className="mb-3">
                        <div>Customer: {receiptPreview.customer.name}</div>
                        <div>Phone: {receiptPreview.customer.phone}</div>
                        <div>Loyalty Points: {receiptPreview.customer.loyaltyPoints}</div>
                      </div>
                    )}

                    <div className="border-t border-dashed border-gray-400 my-3"></div>

                    {/* Items */}
                    <div className="mb-3">
                      <div className="font-bold">ITEMS</div>
                      {receiptPreview.items.map((item, index) => (
                        <div key={index} className="mt-2">
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-600"> {item.sku}</div>
                          <div className="flex justify-between">
                            <span>
                              {" "}
                              {item.quantity} x ${item.unitPrice.toFixed(2)}
                            </span>
                            <span>${item.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-3"></div>

                    {/* Totals */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${receiptPreview.subtotal.toFixed(2)}</span>
                      </div>
                      {receiptPreview.discount > 0 && (
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span>-${receiptPreview.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${receiptPreview.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-dashed border-gray-400 my-2"></div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>TOTAL:</span>
                        <span>${receiptPreview.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-3"></div>

                    {/* Payment Info */}
                    <div className="mb-3">
                      <div>Payment: {receiptPreview.paymentMethod}</div>
                      {receiptPreview.cashReceived && (
                        <>
                          <div>Cash Received: ${receiptPreview.cashReceived.toFixed(2)}</div>
                          <div>Change: ${receiptPreview.change?.toFixed(2)}</div>
                        </>
                      )}
                    </div>

                    {/* Loyalty Points */}
                    {receiptPreview.loyaltyPointsEarned > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          Points Earned: {receiptPreview.loyaltyPointsEarned}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-dashed border-gray-400 my-3"></div>

                    {/* Footer */}
                    <div className="text-center">
                      <div className="font-bold">Thank you for your business!</div>
                      <div>{receiptPreview.storeInfo.website}</div>
                      {receiptPreview.promotionalMessage && (
                        <div className="mt-2 text-xs">{receiptPreview.promotionalMessage}</div>
                      )}
                    </div>

                    {/* QR Code placeholder */}
                    <div className="text-center mt-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-gray-400">
                        <QrCode className="h-8 w-8" />
                      </div>
                      <div className="text-xs mt-1">Scan for digital receipt</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Preview Receipt" to see receipt layout</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThermalReceiptPrinter
