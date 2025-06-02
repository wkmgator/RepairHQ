"use client"

import type React from "react"

import { useState } from "react"
import { fetchVehicleDetails, type VehicleInfo } from "@/lib/vin-decoder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface VinLookupProps {
  onVehicleFound?: (vehicleInfo: VehicleInfo) => void
  showDetails?: boolean
  className?: string
}

export function VinLookup({ onVehicleFound, showDetails = true, className }: VinLookupProps) {
  const [vin, setVin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)

  // Format VIN as user types (groups of 4 for readability)
  const formatVin = (input: string) => {
    // Remove any non-alphanumeric characters
    const cleaned = input.replace(/[^A-Z0-9]/gi, "").toUpperCase()
    setVin(cleaned)
  }

  const handleLookup = async () => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchVehicleDetails(vin)

      if (result.success && result.data) {
        setVehicleInfo(result.data)
        if (onVehicleFound) {
          onVehicleFound(result.data)
        }
      } else {
        setError(result.error || "Failed to decode VIN")
        setVehicleInfo(null)
      }
    } catch (err) {
      console.error("VIN lookup error:", err)
      setError("An unexpected error occurred")
      setVehicleInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLookup()
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Vehicle Identification Number (VIN) Lookup</CardTitle>
        <CardDescription>Enter a 17-character VIN to automatically retrieve vehicle information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="vin-input">VIN</Label>
            <div className="flex space-x-2">
              <Input
                id="vin-input"
                placeholder="e.g. 1HGCM82633A004352"
                value={vin}
                onChange={(e) => formatVin(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={17}
                className="font-mono uppercase"
                disabled={isLoading}
              />
              <Button onClick={handleLookup} disabled={isLoading || vin.length !== 17}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Lookup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The VIN is typically located on the driver&apos;s side dashboard or door jamb
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {vehicleInfo && showDetails && (
            <div className="space-y-4 mt-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Vehicle Found</AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully retrieved information for this VIN
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Vehicle Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Year:</span>
                      <span className="font-medium">{vehicleInfo.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Make:</span>
                      <span className="font-medium">{vehicleInfo.make}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Model:</span>
                      <span className="font-medium">{vehicleInfo.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trim:</span>
                      <span className="font-medium">{vehicleInfo.trim}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Body Type:</span>
                      <span className="font-medium">{vehicleInfo.bodyType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Technical Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Engine:</span>
                      <span className="font-medium">{vehicleInfo.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transmission:</span>
                      <span className="font-medium">{vehicleInfo.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Drive Train:</span>
                      <span className="font-medium">{vehicleInfo.driveTrain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fuel Type:</span>
                      <span className="font-medium">{vehicleInfo.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Country:</span>
                      <span className="font-medium">{vehicleInfo.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Manufacturing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Manufacturer:</span>
                    <span className="font-medium">{vehicleInfo.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Plant Code:</span>
                    <span className="font-medium">{vehicleInfo.plantCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Plant Location:</span>
                    <span className="font-medium">{vehicleInfo.plantLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Serial Number:</span>
                    <span className="font-medium">{vehicleInfo.serialNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {vehicleInfo && (
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Badge variant="outline">{vehicleInfo.year}</Badge>
            <Badge variant="outline">{vehicleInfo.make}</Badge>
            <Badge variant="outline">{vehicleInfo.model}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setVehicleInfo(null)
              setVin("")
            }}
          >
            Clear
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
