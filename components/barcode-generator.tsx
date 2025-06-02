"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarcodeType, generateBarcode } from "@/lib/barcode-utils"
import { Download, Copy, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import JsBarcode from "jsbarcode"

interface BarcodeGeneratorProps {
  initialValue?: string
  initialType?: BarcodeType
  onGenerate?: (barcode: string) => void
}

export function BarcodeGenerator({
  initialValue = "",
  initialType = BarcodeType.CODE128,
  onGenerate,
}: BarcodeGeneratorProps) {
  const { toast } = useToast()
  const [barcodeValue, setBarcodeValue] = useState(initialValue)
  const [barcodeType, setBarcodeType] = useState<BarcodeType>(initialType)
  const [prefix, setPrefix] = useState("")
  const [generatedBarcode, setGeneratedBarcode] = useState<string | null>(null)

  const generateNewBarcode = () => {
    const newBarcode = generateBarcode(barcodeType, prefix)
    setGeneratedBarcode(newBarcode)
    setBarcodeValue(newBarcode)

    if (onGenerate) {
      onGenerate(newBarcode)
    }

    // Render the barcode after a short delay to ensure the DOM is updated
    setTimeout(() => {
      const canvas = document.getElementById("barcodeCanvas") as HTMLCanvasElement
      if (canvas) {
        try {
          JsBarcode(canvas, newBarcode, {
            format: barcodeType === BarcodeType.QR ? "CODE128" : barcodeType,
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 14,
            margin: 10,
          })
        } catch (error) {
          console.error("Error generating barcode:", error)
          toast({
            title: "Barcode Generation Error",
            description: "Could not generate barcode with the current settings.",
            variant: "destructive",
          })
        }
      }
    }, 100)
  }

  const copyToClipboard = () => {
    if (generatedBarcode) {
      navigator.clipboard.writeText(generatedBarcode)
      toast({
        title: "Copied to clipboard",
        description: "Barcode value has been copied to clipboard.",
      })
    }
  }

  const printBarcode = () => {
    const canvas = document.getElementById("barcodeCanvas") as HTMLCanvasElement
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Barcode</title>
              <style>
                body { margin: 0; padding: 20px; text-align: center; }
                .barcode-container { margin-bottom: 10px; }
                .barcode-value { font-family: monospace; margin-top: 5px; }
                @media print {
                  @page { margin: 0; }
                  body { margin: 1cm; }
                }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                <img src="${dataUrl}" alt="Barcode" />
                <div class="barcode-value">${generatedBarcode}</div>
              </div>
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  const downloadBarcode = () => {
    const canvas = document.getElementById("barcodeCanvas") as HTMLCanvasElement
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `barcode-${generatedBarcode}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Barcode Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="barcodeType">Barcode Type</Label>
          <Select value={barcodeType} onValueChange={(value) => setBarcodeType(value as BarcodeType)}>
            <SelectTrigger id="barcodeType">
              <SelectValue placeholder="Select barcode type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BarcodeType.CODE128}>CODE-128</SelectItem>
              <SelectItem value={BarcodeType.EAN13}>EAN-13</SelectItem>
              <SelectItem value={BarcodeType.UPC}>UPC-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prefix">Prefix (Optional)</Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Enter prefix for barcode"
          />
        </div>

        <div className="flex justify-center">
          <Button onClick={generateNewBarcode}>Generate Barcode</Button>
        </div>

        {generatedBarcode && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md flex flex-col items-center">
            <canvas id="barcodeCanvas"></canvas>
            <div className="mt-2 font-mono text-sm">{generatedBarcode}</div>
          </div>
        )}
      </CardContent>
      {generatedBarcode && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={printBarcode}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={downloadBarcode}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
