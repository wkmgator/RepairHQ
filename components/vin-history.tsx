"use client"

import { useState, useEffect } from "react"
import { getVinHistory, type VehicleInfo, fetchVehicleDetails } from "@/lib/vin-decoder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface VinHistoryProps {
  onVehicleSelect?: (vehicleInfo: VehicleInfo) => void
  limit?: number
}

export function VinHistory({ onVehicleSelect, limit = 10 }: VinHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVin, setSelectedVin] = useState<string | null>(null)

  const loadHistory = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getVinHistory(limit)

      if (result.success && result.data) {
        setHistory(result.data)
      } else {
        setError(result.error || "Failed to load VIN history")
      }
    } catch (err) {
      console.error("Error loading VIN history:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [limit])

  const handleVehicleSelect = async (vin: string) => {
    if (selectedVin === vin || !onVehicleSelect) return

    setSelectedVin(vin)

    try {
      const result = await fetchVehicleDetails(vin)

      if (result.success && result.data) {
        onVehicleSelect(result.data)
      }
    } catch (err) {
      console.error("Error fetching vehicle details:", err)
    } finally {
      setSelectedVin(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent VIN Lookups</CardTitle>
          <CardDescription>Previously looked up vehicles</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={loadHistory} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && history.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No VIN lookup history found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>VIN</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Last Lookup</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.vin}>
                    <TableCell className="font-mono text-xs">{item.vin}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.year} {item.make} {item.model}
                        </span>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.vehicle_data?.trim || "Unknown Trim"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.vehicle_data?.engine || "Unknown Engine"}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.last_lookup), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {onVehicleSelect && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVehicleSelect(item.vin)}
                          disabled={selectedVin === item.vin}
                        >
                          {selectedVin === item.vin ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                          Select
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
