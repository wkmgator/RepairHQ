"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Check, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VinLookup } from "./vin-lookup"
import type { VehicleInfo } from "@/lib/vin-decoder"

interface VinScannerProps {
  onVehicleFound?: (vehicleInfo: VehicleInfo) => void
}

export function VinScanner({ onVehicleFound }: VinScannerProps) {
  const [activeTab, setActiveTab] = useState("manual")
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  // Handle camera activation
  const startCamera = async () => {
    setCameraError(null)

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser")
      }

      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Could not access camera. Please check permissions and try again.")
    }
  }

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        stopCamera()

        // In a real implementation, you would send this image to a VIN OCR service
        // For this demo, we'll just show a message that it would be processed
      }
    }
  }

  // Reset camera and captured image
  const resetCamera = () => {
    setCapturedImage(null)
    startCamera()
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>VIN Scanner</CardTitle>
        <CardDescription>Scan your vehicle's VIN barcode or enter it manually</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="camera" disabled={!isMobile}>
              Camera Scan {!isMobile && "(Mobile Only)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-4">
            <VinLookup onVehicleFound={onVehicleFound} className="shadow-none border-0 p-0" />
          </TabsContent>

          <TabsContent value="camera" className="mt-4">
            <div className="space-y-4">
              {!cameraActive && !capturedImage && (
                <div className="flex justify-center">
                  <Button onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              )}

              {cameraError && (
                <Alert variant="destructive">
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}

              {cameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-md border border-input"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-red-500 w-3/4 h-16 rounded-md opacity-50"></div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={captureImage}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture VIN
                    </Button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured VIN"
                      className="w-full rounded-md border border-input"
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                    <div className="mt-2 flex justify-between">
                      <Button variant="outline" onClick={resetCamera}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake
                      </Button>
                      <Button onClick={() => setActiveTab("manual")}>
                        <Check className="mr-2 h-4 w-4" />
                        Use Manual Entry
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      In a production environment, this image would be sent to an OCR service to extract the VIN. For
                      this demo, please use the manual entry tab.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        VIN scanning works best in good lighting with a clear view of the VIN plate or sticker
      </CardFooter>
    </Card>
  )
}
