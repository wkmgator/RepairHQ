"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Printer, Download, Car, Droplets } from "lucide-react"
import { format, addMonths } from "date-fns"

interface OilChangeSticker {
  businessName: string
  businessPhone: string
  businessAddress: string
  vehicleInfo: string
  currentMileage: number
  serviceDate: string
  oilType: string
  oilBrand: string
  filterType: string
  nextServiceMileage: number
  nextServiceDate: string
  nextServiceMonths: number
  technicianName: string
  includeQR: boolean
  includeBarcode: boolean
  stickerColor: "white" | "yellow" | "blue" | "green"
}

interface OilChangeStickerGeneratorProps {
  initialData?: Partial<OilChangeSticker>
  onGenerate?: (data: OilChangeSticker) => void
}

export function OilChangeStickerGenerator({ initialData, onGenerate }: OilChangeStickerGeneratorProps) {
  const { toast } = useToast()
  const [stickerData, setStickerData] = useState<OilChangeSticker>({
    businessName: initialData?.businessName || "Quick Lube Express",
    businessPhone: initialData?.businessPhone || "(555) 123-4567",
    businessAddress: initialData?.businessAddress || "123 Main St, Anytown USA",
    vehicleInfo: initialData?.vehicleInfo || "",
    currentMileage: initialData?.currentMileage || 0,
    serviceDate: initialData?.serviceDate || format(new Date(), "yyyy-MM-dd"),
    oilType: initialData?.oilType || "5W-30 Conventional",
    oilBrand: initialData?.oilBrand || "Valvoline",
    filterType: initialData?.filterType || "Standard Oil Filter",
    nextServiceMileage: initialData?.nextServiceMileage || 0,
    nextServiceDate: initialData?.nextServiceDate || format(addMonths(new Date(), 3), "yyyy-MM-dd"),
    nextServiceMonths: initialData?.nextServiceMonths || 3,
    technicianName: initialData?.technicianName || "",
    includeQR: initialData?.includeQR !== undefined ? initialData.includeQR : true,
    includeBarcode: initialData?.includeBarcode !== undefined ? initialData.includeBarcode : false,
    stickerColor: initialData?.stickerColor || "white",
  })
  const [previewReady, setPreviewReady] = useState(false)

  // Calculate next service mileage when current mileage changes
  const calculateNextServiceMileage = () => {
    const serviceInterval = getServiceInterval(stickerData.oilType)
    return stickerData.currentMileage + serviceInterval
  }

  // Get service interval based on oil type
  const getServiceInterval = (oilType: string): number => {
    if (oilType.includes("Full Synthetic")) return 10000
    if (oilType.includes("Synthetic Blend")) return 7500
    if (oilType.includes("High Mileage")) return 5000
    return 3000 // Conventional oil
  }

  const handleInputChange = (field: keyof OilChangeSticker, value: any) => {
    setStickerData((prev) => {
      const newData = { ...prev, [field]: value }

      // Recalculate next service when relevant fields change
      if (field === "currentMileage" || field === "oilType") {
        newData.nextServiceMileage = calculateNextServiceMileage()
      }

      // Recalculate next service date when service date or months change
      if (field === "serviceDate" || field === "nextServiceMonths") {
        const serviceDate = new Date(field === "serviceDate" ? value : newData.serviceDate)
        newData.nextServiceDate = format(addMonths(serviceDate, newData.nextServiceMonths), "yyyy-MM-dd")
      }

      return newData
    })
    setPreviewReady(false)
  }

  const generatePreview = () => {
    if (!stickerData.vehicleInfo || !stickerData.currentMileage) {
      toast({
        title: "Missing Information",
        description: "Please provide vehicle information and current mileage.",
        variant: "destructive",
      })
      return
    }

    setPreviewReady(true)

    if (onGenerate) {
      onGenerate(stickerData)
    }

    toast({
      title: "Oil Change Sticker Generated",
      description: "Your windshield sticker is ready to print.",
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
        description: "Please allow popups to print oil change stickers.",
        variant: "destructive",
      })
      return
    }

    // Format dates for display
    const serviceDateFormatted = format(new Date(stickerData.serviceDate), "MM/dd/yyyy")
    const nextServiceDateFormatted = format(new Date(stickerData.nextServiceDate), "MM/dd/yyyy")

    // Generate QR code data
    const qrData = JSON.stringify({
      type: "oil_change",
      business: stickerData.businessName,
      vehicle: stickerData.vehicleInfo,
      mileage: stickerData.currentMileage,
      date: stickerData.serviceDate,
      nextService: stickerData.nextServiceMileage,
    })

    // Color schemes for different sticker colors
    const colorSchemes = {
      white: { bg: "#FFFFFF", border: "#000000", text: "#000000", accent: "#0066CC" },
      yellow: { bg: "#FFF9C4", border: "#F57F17", text: "#333333", accent: "#FF6F00" },
      blue: { bg: "#E3F2FD", border: "#1976D2", text: "#0D47A1", accent: "#2196F3" },
      green: { bg: "#E8F5E8", border: "#388E3C", text: "#1B5E20", accent: "#4CAF50" },
    }

    const colors = colorSchemes[stickerData.stickerColor]

    // Write the HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Oil Change Windshield Sticker</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .oil-change-sticker {
              background-color: ${colors.bg};
              border: 3px solid ${colors.border};
              border-radius: 8px;
              padding: 12px;
              width: 280px;
              height: 180px;
              page-break-inside: avoid;
              position: relative;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid ${colors.border};
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .business-name {
              font-weight: bold;
              font-size: 16px;
              color: ${colors.text};
              margin-bottom: 3px;
            }
            .business-contact {
              font-size: 10px;
              color: ${colors.text};
              line-height: 1.2;
            }
            .service-title {
              background-color: ${colors.accent};
              color: white;
              font-weight: bold;
              font-size: 12px;
              text-align: center;
              padding: 4px;
              margin: 8px 0;
              border-radius: 4px;
            }
            .service-info {
              font-size: 9px;
              color: ${colors.text};
              line-height: 1.3;
            }
            .service-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .label {
              font-weight: bold;
            }
            .next-service {
              background-color: ${colors.accent};
              color: white;
              padding: 6px;
              border-radius: 4px;
              margin-top: 8px;
              text-align: center;
            }
            .next-service-title {
              font-weight: bold;
              font-size: 10px;
              margin-bottom: 2px;
            }
            .next-service-info {
              font-size: 9px;
              line-height: 1.2;
            }
            .qr-code {
              position: absolute;
              top: 45px;
              right: 12px;
              width: 50px;
              height: 50px;
              border: 1px solid ${colors.border};
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: white;
            }
            .footer {
              position: absolute;
              bottom: 8px;
              left: 12px;
              right: 12px;
              text-align: center;
              font-size: 8px;
              color: ${colors.text};
            }
            @media print {
              @page {
                margin: 0.5cm;
                size: 4in 3in;
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
          <div class="oil-change-sticker">
            <div class="header">
              <div class="business-name">${stickerData.businessName}</div>
              <div class="business-contact">
                ${stickerData.businessPhone}<br>
                ${stickerData.businessAddress}
              </div>
            </div>
            
            <div class="service-title">OIL CHANGE SERVICE</div>
            
            <div class="service-info">
              <div class="service-row">
                <span class="label">Vehicle:</span>
                <span>${stickerData.vehicleInfo}</span>
              </div>
              <div class="service-row">
                <span class="label">Date:</span>
                <span>${serviceDateFormatted}</span>
              </div>
              <div class="service-row">
                <span class="label">Mileage:</span>
                <span>${stickerData.currentMileage.toLocaleString()}</span>
              </div>
              <div class="service-row">
                <span class="label">Oil:</span>
                <span>${stickerData.oilBrand} ${stickerData.oilType}</span>
              </div>
              <div class="service-row">
                <span class="label">Filter:</span>
                <span>${stickerData.filterType}</span>
              </div>
              ${
                stickerData.technicianName
                  ? `
                <div class="service-row">
                  <span class="label">Tech:</span>
                  <span>${stickerData.technicianName}</span>
                </div>
              `
                  : ""
              }
            </div>
            
            ${
              stickerData.includeQR
                ? `
              <div class="qr-code" id="qrcode">
                QR
              </div>
            `
                : ""
            }
            
            <div class="next-service">
              <div class="next-service-title">NEXT SERVICE DUE</div>
              <div class="next-service-info">
                ${stickerData.nextServiceMileage.toLocaleString()} miles<br>
                or ${nextServiceDateFormatted}
              </div>
            </div>
            
            <div class="footer">
              Thank you for choosing ${stickerData.businessName}!
            </div>
          </div>
          ${
            stickerData.includeQR
              ? `
            <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
            <script>
              window.onload = function() {
                var qr = qrcode(0, 'M');
                qr.addData('${qrData}');
                qr.make();
                document.getElementById('qrcode').innerHTML = qr.createImgTag(2);
              }
            </script>
          `
              : ""
          }
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="h-5 w-5 mr-2" />
          Oil Change Windshield Sticker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={stickerData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessPhone">Phone Number</Label>
            <Input
              id="businessPhone"
              value={stickerData.businessPhone}
              onChange={(e) => handleInputChange("businessPhone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            value={stickerData.businessAddress}
            onChange={(e) => handleInputChange("businessAddress", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleInfo">Vehicle Information</Label>
          <Input
            id="vehicleInfo"
            value={stickerData.vehicleInfo}
            onChange={(e) => handleInputChange("vehicleInfo", e.target.value)}
            placeholder="e.g., 2023 Honda Civic"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentMileage">Current Mileage</Label>
            <Input
              id="currentMileage"
              type="number"
              value={stickerData.currentMileage}
              onChange={(e) => handleInputChange("currentMileage", Number.parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceDate">Service Date</Label>
            <Input
              id="serviceDate"
              type="date"
              value={stickerData.serviceDate}
              onChange={(e) => handleInputChange("serviceDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="oilBrand">Oil Brand</Label>
            <Select value={stickerData.oilBrand} onValueChange={(value) => handleInputChange("oilBrand", value)}>
              <SelectTrigger id="oilBrand">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Valvoline">Valvoline</SelectItem>
                <SelectItem value="Mobil 1">Mobil 1</SelectItem>
                <SelectItem value="Castrol">Castrol</SelectItem>
                <SelectItem value="Pennzoil">Pennzoil</SelectItem>
                <SelectItem value="Shell">Shell</SelectItem>
                <SelectItem value="Quaker State">Quaker State</SelectItem>
                <SelectItem value="Royal Purple">Royal Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oilType">Oil Type</Label>
            <Select value={stickerData.oilType} onValueChange={(value) => handleInputChange("oilType", value)}>
              <SelectTrigger id="oilType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0W-20 Full Synthetic">0W-20 Full Synthetic</SelectItem>
                <SelectItem value="5W-20 Full Synthetic">5W-20 Full Synthetic</SelectItem>
                <SelectItem value="5W-30 Full Synthetic">5W-30 Full Synthetic</SelectItem>
                <SelectItem value="0W-30 Full Synthetic">0W-30 Full Synthetic</SelectItem>
                <SelectItem value="5W-30 Synthetic Blend">5W-30 Synthetic Blend</SelectItem>
                <SelectItem value="10W-30 Synthetic Blend">10W-30 Synthetic Blend</SelectItem>
                <SelectItem value="5W-30 Conventional">5W-30 Conventional</SelectItem>
                <SelectItem value="10W-30 Conventional">10W-30 Conventional</SelectItem>
                <SelectItem value="5W-30 High Mileage">5W-30 High Mileage</SelectItem>
                <SelectItem value="10W-40 High Mileage">10W-40 High Mileage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filterType">Filter Type</Label>
          <Select value={stickerData.filterType} onValueChange={(value) => handleInputChange("filterType", value)}>
            <SelectTrigger id="filterType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard Oil Filter">Standard Oil Filter</SelectItem>
              <SelectItem value="Premium Oil Filter">Premium Oil Filter</SelectItem>
              <SelectItem value="High Performance Filter">High Performance Filter</SelectItem>
              <SelectItem value="Extended Life Filter">Extended Life Filter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nextServiceMonths">Service Interval (Months)</Label>
            <Select
              value={stickerData.nextServiceMonths.toString()}
              onValueChange={(value) => handleInputChange("nextServiceMonths", Number.parseInt(value))}
            >
              <SelectTrigger id="nextServiceMonths">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextServiceMileage">Next Service Mileage</Label>
            <Input
              id="nextServiceMileage"
              type="number"
              value={stickerData.nextServiceMileage}
              onChange={(e) => handleInputChange("nextServiceMileage", Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technicianName">Technician Name (Optional)</Label>
          <Input
            id="technicianName"
            value={stickerData.technicianName}
            onChange={(e) => handleInputChange("technicianName", e.target.value)}
            placeholder="Technician who performed service"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stickerColor">Sticker Color</Label>
          <Select value={stickerData.stickerColor} onValueChange={(value) => handleInputChange("stickerColor", value)}>
            <SelectTrigger id="stickerColor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
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
              id="includeBarcode"
              checked={stickerData.includeBarcode}
              onCheckedChange={(checked) => handleInputChange("includeBarcode", !!checked)}
            />
            <Label htmlFor="includeBarcode">Include Barcode</Label>
          </div>
        </div>

        <Button onClick={generatePreview} className="w-full">
          <Droplets className="h-4 w-4 mr-2" />
          Generate Oil Change Sticker
        </Button>
      </CardContent>
      {previewReady && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(stickerData))}
          >
            <Download className="h-4 w-4 mr-2" />
            Copy Data
          </Button>
          <Button size="sm" onClick={printSticker}>
            <Printer className="h-4 w-4 mr-2" />
            Print Sticker
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
