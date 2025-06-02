"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { parseBarcode } from "@/lib/barcode-utils"

interface BarcodeScannerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDetected: (barcode: string, parsedData?: any) => void
  title?: string
}

export function BarcodeScannerModal({
  open,
  onOpenChange,
  onDetected,
  title = "Scan Barcode",
}: BarcodeScannerModalProps) {
  const handleBarcodeDetected = (result: string) => {
    const parsedData = parseBarcode(result)
    onDetected(result, parsedData?.data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <BarcodeScanner onDetected={handleBarcodeDetected} placeholder="Enter barcode manually..." />
      </DialogContent>
    </Dialog>
  )
}
