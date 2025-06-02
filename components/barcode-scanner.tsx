"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Camera, X, Scan, Keyboard } from "lucide-react"
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library"

interface BarcodeScannerProps {
  onDetected: (result: string) => void
  onClose?: () => void
  supportedFormats?: BarcodeFormat[]
  manualEntry?: boolean
  placeholder?: string
}

export function BarcodeScanner({
  onDetected,
  onClose,
  supportedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_128,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ],
  manualEntry = true,
  placeholder = "Enter barcode manually...",
}: BarcodeScannerProps) {
  const [activeTab, setActiveTab] = useState<string>("camera")
  const [hasCamera, setHasCamera] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        setHasCamera(true)
        stream.getTracks().forEach((track) => track.stop()) // Release camera
      })
      .catch(() => {
        setHasCamera(false)
        setActiveTab("manual")
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Initialize barcode reader
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, supportedFormats)
    readerRef.current = new BrowserMultiFormatReader(hints)

    return () => {
      if (readerRef.current) {
        readerRef.current.reset()
      }
    }
  }, [supportedFormats])

  useEffect(() => {
    if (activeTab === "camera" && hasCamera && videoRef.current && readerRef.current) {
      setIsLoading(true)
      setError(null)

      readerRef.current
        .decodeFromConstraints(
          {
            video: {
              facingMode: "environment",
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
            },
          },
          videoRef.current,
          (result, error) => {
            if (result) {
              onDetected(result.getText())
              if (readerRef.current) {
                readerRef.current.reset()
              }
            }
            if (error && !(error instanceof TypeError)) {
              // TypeError is thrown when the scanner is stopped, so we ignore it
              console.error("Barcode scanning error:", error)
            }
          },
        )
        .catch((err) => {
          console.error("Error starting barcode scanner:", err)
          setError("Could not access camera. Please check permissions.")
          setActiveTab("manual")
        })
        .finally(() => {
          setIsLoading(false)
        })

      return () => {
        if (readerRef.current) {
          readerRef.current.reset()
        }
      }
    }
  }, [activeTab, hasCamera, onDetected])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onDetected(manualCode.trim())
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="camera" disabled={!hasCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="manual" disabled={!manualEntry}>
                <Keyboard className="h-4 w-4 mr-2" />
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-4">
              {error ? (
                <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>
              ) : (
                <div className="relative">
                  <div className="aspect-video bg-black rounded-md overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted></video>
                  </div>
                  <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 rounded-md"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Scan className="h-24 w-24 text-primary/30" />
                  </div>
                </div>
              )}
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Position the barcode within the scanner area
              </p>
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <form onSubmit={handleManualSubmit}>
                <div className="flex space-x-2">
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" disabled={!manualCode.trim()}>
                    Submit
                  </Button>
                </div>
              </form>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Enter the barcode manually or use a handheld scanner
              </p>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
