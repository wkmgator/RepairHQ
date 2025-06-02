"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, AlertCircle } from "lucide-react"
import { dymoPrinter, type TicketLabelData, type PartLabelData } from "@/lib/dymo-printer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface DymoLabelPrinterProps {
  type: "ticket" | "part"
  data: TicketLabelData | PartLabelData
  onPrintSuccess?: () => void
}

export function DymoLabelPrinter({ type, data, onPrintSuccess }: DymoLabelPrinterProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [printers, setPrinters] = useState<string[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string>("")
  const [isPrinting, setIsPrinting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initPrinter = async () => {
      const script = document.createElement("script")
      script.src = "https://labelwriter.com/software/dls/sdk/js/DYMO.Label.Framework.3.0.js"
      script.async = true
      script.onload = async () => {
        const initialized = await dymoPrinter.init()
        if (initialized) {
          setIsInitialized(true)
          const availablePrinters = dymoPrinter.getPrinters()
          setPrinters(availablePrinters)
          if (availablePrinters.length > 0) {
            setSelectedPrinter(availablePrinters[0])
          }
        }
      }
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }

    initPrinter()
  }, [])

  const handlePrint = async () => {
    setIsPrinting(true)
    try {
      let success = false
      if (type === "ticket") {
        success = await dymoPrinter.printTicketLabel(data as TicketLabelData, selectedPrinter)
      } else {
        success = await dymoPrinter.printPartLabel(data as PartLabelData, selectedPrinter)
      }

      if (success) {
        toast({
          title: "Label printed successfully",
          description: `Your ${type} label has been sent to the printer.`,
        })
        onPrintSuccess?.()
      } else {
        throw new Error("Failed to print label")
      }
    } catch (error) {
      toast({
        title: "Print failed",
        description: "There was an error printing the label. Please check your printer.",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }

  if (!isInitialized) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Initializing DYMO printer... Make sure DYMO Connect is installed.</AlertDescription>
      </Alert>
    )
  }

  if (printers.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No DYMO printers found. Please connect a DYMO LabelWriter and refresh the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Print {type === "ticket" ? "Ticket" : "Part"} Label
        </CardTitle>
        <CardDescription>Print a label using your DYMO LabelWriter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Printer</label>
          <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {printers.map((printer) => (
                <SelectItem key={printer} value={printer}>
                  {printer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Label Preview</h4>
          {type === "ticket" ? (
            <div className="text-sm space-y-1">
              <p>
                <strong>Customer:</strong> {(data as TicketLabelData).customerName}
              </p>
              <p>
                <strong>Device:</strong> {(data as TicketLabelData).deviceType}
              </p>
              <p>
                <strong>Ticket:</strong> #{(data as TicketLabelData).ticketId}
              </p>
              <p>
                <strong>Repair:</strong> {(data as TicketLabelData).repairType}
              </p>
            </div>
          ) : (
            <div className="text-sm space-y-1">
              <p>
                <strong>Part:</strong> {(data as PartLabelData).partName}
              </p>
              <p>
                <strong>SKU:</strong> {(data as PartLabelData).sku}
              </p>
              {(data as PartLabelData).location && (
                <p>
                  <strong>Location:</strong> {(data as PartLabelData).location}
                </p>
              )}
              {(data as PartLabelData).price && (
                <p>
                  <strong>Price:</strong> ${(data as PartLabelData).price.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>

        <Button onClick={handlePrint} disabled={isPrinting || !selectedPrinter} className="w-full">
          {isPrinting ? (
            <>
              <Printer className="mr-2 h-4 w-4 animate-pulse" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="mr-2 h-4 w-4" />
              Print Label
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
