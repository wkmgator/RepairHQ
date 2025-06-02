"use client"

import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area" // For long disclosures

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void
  onClear?: () => void
  disclosureTitle?: string
  disclosureText?: string
  disabled?: boolean
}

export function SignaturePad({
  onSave,
  onClear,
  disclosureTitle = "Disclosures & Consent",
  disclosureText = "By signing below, you acknowledge and agree to our terms of service and repair policies. This includes consent for the necessary diagnostics and repair work to be performed on your device/item. You understand that while every effort will be made to protect your data, RepairHQ is not responsible for data loss. You also agree to the estimated costs and understand that additional charges may apply if unforeseen issues arise, which will be communicated for approval.",
  disabled = false,
}: SignaturePadProps) {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null)
  const [isSigned, setIsSigned] = useState(false)

  const clearSignature = () => {
    sigCanvasRef.current?.clear()
    setIsSigned(false)
    if (onClear) {
      onClear()
    }
  }

  const saveSignature = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png")
      onSave(dataUrl)
      setIsSigned(true) // Keep it marked as signed even if parent handles state
    } else {
      alert("Please provide a signature before saving.")
    }
  }

  const handleBeginStroke = () => {
    setIsSigned(false) // Reset if they start drawing again after saving
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{disclosureTitle}</CardTitle>
        {disclosureText && <CardDescription>Please read the following and sign below.</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {disclosureText && (
          <ScrollArea className="h-32 w-full rounded-md border p-3 text-sm">
            <p style={{ whiteSpace: "pre-wrap" }}>{disclosureText}</p>
          </ScrollArea>
        )}
        <div className="rounded-md border border-gray-300 bg-white">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            canvasProps={{
              width: 500, // Adjust as needed, consider responsiveness
              height: 200,
              className: "sigCanvas w-full", // Ensure it takes full width of container
            }}
            onBegin={handleBeginStroke}
            onEnd={() => setIsSigned(!sigCanvasRef.current?.isEmpty())} // Update signed status on end
            backgroundColor="rgb(255,255,255)"
            clearOnResize={false} // Important for responsive layouts if width/height changes
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={clearSignature} disabled={disabled}>
            Clear
          </Button>
          <Button onClick={saveSignature} disabled={disabled || isSigned}>
            {isSigned ? "Signature Captured" : "Save Signature"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
