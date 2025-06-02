"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Printer, Download, Smartphone } from "lucide-react"
import { format } from "date-fns"

interface TicketLabel {
  customerName: string
  phoneNumber: string
  ticketNumber: string
  deviceType: string
  deviceModel: string
  deviceColor: string
  devicePassword: string
  issueDescription: string
  dateReceived: string
  estimatedCompletion: string
  includeQR: boolean
  includePassword: boolean
}

interface TicketLabelGeneratorProps {
  initialData?: Partial<TicketLabel>
  onGenerate?: (data: TicketLabel) => void
}

export function TicketLabelGenerator({ initialData, onGenerate }: TicketLabelGeneratorProps) {
  const { toast } = useToast()
  const [labelData, setLabelData] = useState<TicketLabel>({
    customerName: initialData?.customerName || "",
    phoneNumber: initialData?.phoneNumber || "",
    ticketNumber: initialData?.ticketNumber || `TK-${Math.floor(10000 + Math.random() * 90000)}`,
    deviceType: initialData?.deviceType || "Phone",
    deviceModel: initialData?.deviceModel || "",
    deviceColor: initialData?.deviceColor || "",
    devicePassword: initialData?.devicePassword || "",
    issueDescription: initialData?.issueDescription || "",
    dateReceived: initialData?.dateReceived || format(new Date(), "yyyy-MM-dd"),
    estimatedCompletion: initialData?.estimatedCompletion || format(new Date(Date.now() + 86400000 * 3), "yyyy-MM-dd"),
    includeQR: initialData?.includeQR !== undefined ? initialData.includeQR : true,
    includePassword: initialData?.includePassword !== undefined ? initialData.includePassword : true,
  })
  const [previewReady, setPreviewReady] = useState(false)

  const handleInputChange = (field: keyof TicketLabel, value: any) => {
    setLabelData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setPreviewReady(false)
  }

  const generatePreview = () => {
    if (!labelData.customerName || !labelData.deviceModel) {
      toast({
        title: "Missing Information",
        description: "Please provide at least customer name and device model.",
        variant: "destructive",
      })
      return
    }

    setPreviewReady(true)

    if (onGenerate) {
      onGenerate(labelData)
    }

    toast({
      title: "Ticket Label Generated",
      description: "Your ticket label is ready to print.",
    })
  }

  const printLabel = () => {
    if (!previewReady) {
      generatePreview()
      setTimeout(() => printLabelContent(), 100)
      return
    }

    printLabelContent()
  }

  const printLabelContent = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to print ticket labels.",
        variant: "destructive",
      })
      return
    }

    // Format dates for display
    const receivedDateFormatted = format(new Date(labelData.dateReceived), "MMM d, yyyy")
    const estimatedCompletionFormatted = format(new Date(labelData.estimatedCompletion), "MMM d, yyyy")

    // Generate QR code data
    const qrData = JSON.stringify({
      type: "ticket",
      ticket: labelData.ticketNumber,
      customer: labelData.customerName,
      device: `${labelData.deviceType} ${labelData.deviceModel}`,
    })

    // Write the HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Repair Ticket Label</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .ticket-label {
              border: 2px solid #000;
              padding: 15px;
              width: 350px;
              page-break-inside: avoid;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .logo {
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 5px;
            }
            .title {
              font-weight: bold;
              font-size: 16px;
              text-transform: uppercase;
            }
            .ticket-number {
              font-family: monospace;
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            .content {
              font-size: 12px;
            }
            .section {
              margin-bottom: 10px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 3px;
              font-size: 13px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            .label {
              font-weight: bold;
            }
            .value {
              text-align: right;
            }
            .password-section {
              border: 1px dashed #000;
              padding: 5px;
              margin-top: 10px;
              font-size: 11px;
            }
            .qr-placeholder {
              width: 80px;
              height: 80px;
              border: 1px dashed #ccc;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px auto;
            }
            .footer {
              margin-top: 10px;
              font-size: 10px;
              text-align: center;
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
            <button onclick="window.print()">Print Label</button>
            <button onclick="window.close()">Close</button>
          </div>
          <div class="ticket-label">
            <div class="header">
              <div class="logo">RepairHQ</div>
              <div class="title">Repair Ticket</div>
              <div class="ticket-number">${labelData.ticketNumber}</div>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">Customer Information</div>
                <div>${labelData.customerName}</div>
                ${labelData.phoneNumber ? `<div>${labelData.phoneNumber}</div>` : ""}
              </div>
              
              <div class="section">
                <div class="section-title">Device Information</div>
                <div class="row">
                  <span class="label">Type:</span>
                  <span class="value">${labelData.deviceType}</span>
                </div>
                <div class="row">
                  <span class="label">Model:</span>
                  <span class="value">${labelData.deviceModel}</span>
                </div>
                ${
                  labelData.deviceColor
                    ? `<div class="row">
                        <span class="label">Color:</span>
                        <span class="value">${labelData.deviceColor}</span>
                      </div>`
                    : ""
                }
              </div>
              
              <div class="section">
                <div class="section-title">Service Information</div>
                <div class="row">
                  <span class="label">Received:</span>
                  <span class="value">${receivedDateFormatted}</span>
                </div>
                <div class="row">
                  <span class="label">Est. Completion:</span>
                  <span class="value">${estimatedCompletionFormatted}</span>
                </div>
              </div>
              
              ${
                labelData.issueDescription
                  ? `<div class="section">
                      <div class="section-title">Issue Description</div>
                      <div style="font-size: 11px;">${labelData.issueDescription}</div>
                    </div>`
                  : ""
              }
              
              ${
                labelData.includePassword && labelData.devicePassword
                  ? `<div class="password-section">
                      <div style="font-weight: bold;">Device Password:</div>
                      <div style="font-family: monospace;">${labelData.devicePassword}</div>
                    </div>`
                  : ""
              }
              
              ${
                labelData.includeQR
                  ? `<div class="qr-placeholder" id="qrcode">
                      QR Code
                    </div>`
                  : ""
              }
            </div>
            <div class="footer">
              Thank you for choosing RepairHQ!
            </div>
          </div>
          ${
            labelData.includeQR
              ? `<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
                <script>
                  window.onload = function() {
                    var qr = qrcode(0, 'M');
                    qr.addData('${qrData}');
                    qr.make();
                    document.getElementById('qrcode').innerHTML = qr.createImgTag(3);
                  }
                </script>`
              : ""
          }
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const downloadLabel = () => {
    // For downloading, we'd need to convert the HTML to an image
    // This is a simplified version that just alerts the user
    toast({
      title: "Download Not Available",
      description: "Currently, ticket labels can only be printed directly.",
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Repair Ticket Label Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ticketNumber">Ticket Number</Label>
          <Input
            id="ticketNumber"
            value={labelData.ticketNumber}
            onChange={(e) => handleInputChange("ticketNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={labelData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            placeholder="Customer full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={labelData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Customer phone number (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deviceType">Device Type</Label>
            <Select value={labelData.deviceType} onValueChange={(value) => handleInputChange("deviceType", value)}>
              <SelectTrigger id="deviceType">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Watch">Watch</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deviceModel">Device Model</Label>
            <Input
              id="deviceModel"
              value={labelData.deviceModel}
              onChange={(e) => handleInputChange("deviceModel", e.target.value)}
              placeholder="e.g., iPhone 13 Pro"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceColor">Device Color</Label>
          <Input
            id="deviceColor"
            value={labelData.deviceColor}
            onChange={(e) => handleInputChange("deviceColor", e.target.value)}
            placeholder="Device color (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="devicePassword">Device Password</Label>
          <Input
            id="devicePassword"
            value={labelData.devicePassword}
            onChange={(e) => handleInputChange("devicePassword", e.target.value)}
            placeholder="Device password (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDescription">Issue Description</Label>
          <Input
            id="issueDescription"
            value={labelData.issueDescription}
            onChange={(e) => handleInputChange("issueDescription", e.target.value)}
            placeholder="Brief description of the issue"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateReceived">Date Received</Label>
            <Input
              id="dateReceived"
              type="date"
              value={labelData.dateReceived}
              onChange={(e) => handleInputChange("dateReceived", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedCompletion">Est. Completion</Label>
            <Input
              id="estimatedCompletion"
              type="date"
              value={labelData.estimatedCompletion}
              onChange={(e) => handleInputChange("estimatedCompletion", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeQR"
            checked={labelData.includeQR}
            onCheckedChange={(checked) => handleInputChange("includeQR", !!checked)}
          />
          <Label htmlFor="includeQR">Include QR Code</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includePassword"
            checked={labelData.includePassword}
            onCheckedChange={(checked) => handleInputChange("includePassword", !!checked)}
          />
          <Label htmlFor="includePassword">Include Password Section</Label>
        </div>

        <Button onClick={generatePreview} className="w-full">
          Generate Ticket Label
        </Button>
      </CardContent>
      {previewReady && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(labelData.ticketNumber)}>
            <Smartphone className="h-4 w-4 mr-2" />
            Copy Ticket #
          </Button>
          <Button variant="outline" size="sm" onClick={printLabel}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLabel}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
