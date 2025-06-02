"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Printer, Download, Copy } from "lucide-react"
import { format, addMonths, addDays } from "date-fns"

interface WarrantySticker {
  repairType: string
  warrantyPeriod: number
  warrantyUnit: "days" | "months"
  repairDate: string
  expiryDate: string
  serialNumber: string
  technician: string
  notes: string
  includeQR: boolean
  includeTerms: boolean
}

interface WarrantyStickerGeneratorProps {
  initialData?: Partial<WarrantySticker>
  onGenerate?: (data: WarrantySticker) => void
}

export function WarrantyStickerGenerator({ initialData, onGenerate }: WarrantyStickerGeneratorProps) {
  const { toast } = useToast()
  const [stickerData, setStickerData] = useState<WarrantySticker>({
    repairType: initialData?.repairType || "Screen Repair",
    warrantyPeriod: initialData?.warrantyPeriod || 90,
    warrantyUnit: initialData?.warrantyUnit || "days",
    repairDate: initialData?.repairDate || format(new Date(), "yyyy-MM-dd"),
    expiryDate: initialData?.expiryDate || "",
    serialNumber: initialData?.serialNumber || `WR-${Math.floor(100000 + Math.random() * 900000)}`,
    technician: initialData?.technician || "",
    notes: initialData?.notes || "",
    includeQR: initialData?.includeQR !== undefined ? initialData.includeQR : true,
    includeTerms: initialData?.includeTerms !== undefined ? initialData.includeTerms : true,
  })
  const [previewReady, setPreviewReady] = useState(false)

  // Calculate expiry date when warranty period or repair date changes
  const calculateExpiryDate = () => {
    const repairDate = new Date(stickerData.repairDate)
    let expiryDate: Date

    if (stickerData.warrantyUnit === "days") {
      expiryDate = addDays(repairDate, stickerData.warrantyPeriod)
    } else {
      expiryDate = addMonths(repairDate, stickerData.warrantyPeriod)
    }

    return format(expiryDate, "yyyy-MM-dd")
  }

  const handleInputChange = (field: keyof WarrantySticker, value: any) => {
    setStickerData((prev) => {
      const newData = { ...prev, [field]: value }

      // Recalculate expiry date if relevant fields change
      if (field === "repairDate" || field === "warrantyPeriod" || field === "warrantyUnit") {
        newData.expiryDate = calculateExpiryDate()
      }

      return newData
    })
    setPreviewReady(false)
  }

  const generatePreview = () => {
    // Ensure expiry date is calculated
    if (!stickerData.expiryDate) {
      setStickerData((prev) => ({
        ...prev,
        expiryDate: calculateExpiryDate(),
      }))
    }

    setPreviewReady(true)

    if (onGenerate) {
      onGenerate(stickerData)
    }

    toast({
      title: "Warranty Sticker Generated",
      description: "Your warranty sticker is ready to print.",
    })
  }

  const printSticker = () => {
    if (!previewReady) {
      generatePreview()
      setTimeout(() => printStickerContent(), 100)
      return
    }

    printStickerContent()
  }

  const printStickerContent = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to print warranty stickers.",
        variant: "destructive",
      })
      return
    }

    // Format dates for display
    const repairDateFormatted = format(new Date(stickerData.repairDate), "MMM d, yyyy")
    const expiryDateFormatted = format(new Date(stickerData.expiryDate), "MMM d, yyyy")

    // Generate QR code data
    const qrData = JSON.stringify({
      type: "warranty",
      repair: stickerData.repairType,
      serial: stickerData.serialNumber,
      expires: stickerData.expiryDate,
    })

    // Write the HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Warranty Sticker</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .warranty-sticker {
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
            .content {
              font-size: 12px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .label {
              font-weight: bold;
            }
            .value {
              text-align: right;
            }
            .serial {
              font-family: monospace;
              font-size: 12px;
              margin-top: 10px;
              text-align: center;
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
            .terms {
              font-size: 8px;
              margin-top: 10px;
              border-top: 1px solid #ccc;
              padding-top: 5px;
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
            <button onclick="window.print()">Print Sticker</button>
            <button onclick="window.close()">Close</button>
          </div>
          <div class="warranty-sticker">
            <div class="header">
              <div class="logo">RepairHQ</div>
              <div class="title">Warranty Certificate</div>
            </div>
            <div class="content">
              <div class="row">
                <span class="label">Repair Type:</span>
                <span class="value">${stickerData.repairType}</span>
              </div>
              <div class="row">
                <span class="label">Repair Date:</span>
                <span class="value">${repairDateFormatted}</span>
              </div>
              <div class="row">
                <span class="label">Warranty Period:</span>
                <span class="value">${stickerData.warrantyPeriod} ${stickerData.warrantyUnit}</span>
              </div>
              <div class="row">
                <span class="label">Expiry Date:</span>
                <span class="value">${expiryDateFormatted}</span>
              </div>
              ${
                stickerData.technician
                  ? `<div class="row">
                      <span class="label">Technician:</span>
                      <span class="value">${stickerData.technician}</span>
                    </div>`
                  : ""
              }
              ${
                stickerData.notes
                  ? `<div style="margin-top: 10px; font-size: 10px;">
                      <div class="label">Notes:</div>
                      <div>${stickerData.notes}</div>
                    </div>`
                  : ""
              }
              <div class="serial">S/N: ${stickerData.serialNumber}</div>
              ${
                stickerData.includeQR
                  ? `<div class="qr-placeholder" id="qrcode">
                      QR Code
                    </div>`
                  : ""
              }
              ${
                stickerData.includeTerms
                  ? `<div class="terms">
                      This warranty covers defects in workmanship only. It does not cover accidental damage, water damage, or any damage not related to the original repair. The device must be in the same condition as when it was returned after repair. Any tampering with the device or repair will void this warranty. For warranty service, please return to the store with this certificate.
                    </div>`
                  : ""
              }
            </div>
            <div class="footer">
              Thank you for choosing RepairHQ!
            </div>
          </div>
          ${
            stickerData.includeQR
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

  const downloadSticker = () => {
    // For downloading, we'd need to convert the HTML to an image
    // This is a simplified version that just alerts the user
    toast({
      title: "Download Not Available",
      description: "Currently, warranty stickers can only be printed directly.",
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Warranty Sticker Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repairType">Repair Type</Label>
          <Select value={stickerData.repairType} onValueChange={(value) => handleInputChange("repairType", value)}>
            <SelectTrigger id="repairType">
              <SelectValue placeholder="Select repair type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Screen Repair">Screen Repair</SelectItem>
              <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
              <SelectItem value="Charging Port Repair">Charging Port Repair</SelectItem>
              <SelectItem value="Water Damage Repair">Water Damage Repair</SelectItem>
              <SelectItem value="Motherboard Repair">Motherboard Repair</SelectItem>
              <SelectItem value="Software Fix">Software Fix</SelectItem>
              <SelectItem value="Full Device Service">Full Device Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="warrantyPeriod">Warranty Period</Label>
            <Input
              id="warrantyPeriod"
              type="number"
              min="1"
              value={stickerData.warrantyPeriod}
              onChange={(e) => handleInputChange("warrantyPeriod", Number.parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warrantyUnit">Unit</Label>
            <Select
              value={stickerData.warrantyUnit}
              onValueChange={(value) => handleInputChange("warrantyUnit", value as "days" | "months")}
            >
              <SelectTrigger id="warrantyUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repairDate">Repair Date</Label>
            <Input
              id="repairDate"
              type="date"
              value={stickerData.repairDate}
              onChange={(e) => handleInputChange("repairDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={stickerData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Warranty Serial Number</Label>
          <Input
            id="serialNumber"
            value={stickerData.serialNumber}
            onChange={(e) => handleInputChange("serialNumber", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technician">Technician</Label>
          <Input
            id="technician"
            value={stickerData.technician}
            onChange={(e) => handleInputChange("technician", e.target.value)}
            placeholder="Technician name (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={stickerData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Additional notes (optional)"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeQR"
            checked={stickerData.includeQR}
            onCheckedChange={(checked) => handleInputChange("includeQR", !!checked)}
          />
          <Label htmlFor="includeQR">Include QR Code</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeTerms"
            checked={stickerData.includeTerms}
            onCheckedChange={(checked) => handleInputChange("includeTerms", !!checked)}
          />
          <Label htmlFor="includeTerms">Include Warranty Terms</Label>
        </div>

        <Button onClick={generatePreview} className="w-full">
          Generate Warranty Sticker
        </Button>
      </CardContent>
      {previewReady && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(stickerData.serialNumber)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy S/N
          </Button>
          <Button variant="outline" size="sm" onClick={printSticker}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={downloadSticker}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
