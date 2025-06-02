"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"

export default function CameraDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Camera className="mr-3 h-8 w-8 text-indigo-500" />
          Camera & Photography Equipment Dashboard
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage repairs for cameras, lenses, and photography gear. Track sensor cleanings, lens calibrations, shutter
            counts, and parts for vintage equipment.
          </p>
          <div className="mt-4 p-8 border border-dashed rounded-lg text-center text-gray-500">
            Charts and KPIs for Camera Repair coming soon.
          </div>
        </CardContent>
      </Card>
      {/* Add cards for lens types serviced, sensor cleaning frequency, popular camera brands etc. */}
    </div>
  )
}
