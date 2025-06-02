"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RepairVertical, getVerticalConfig } from "@/lib/industry-verticals"
import VerticalDashboardRouter from "@/components/vertical-dashboard-router"

const allVerticals = Object.values(RepairVertical)

export default function TestDashboardsPage() {
  const [currentVertical, setCurrentVertical] = useState<RepairVertical>(RepairVertical.PHONE_REPAIR)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Testing Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {allVerticals.map((vertical) => {
              const config = getVerticalConfig(vertical)
              return (
                <Button
                  key={vertical}
                  variant={currentVertical === vertical ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentVertical(vertical)}
                >
                  {config.name}
                </Button>
              )
            })}
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4 p-3 bg-white rounded border">
              <h3 className="font-semibold">Testing: {getVerticalConfig(currentVertical).name}</h3>
              <p className="text-sm text-muted-foreground">{getVerticalConfig(currentVertical).description}</p>
            </div>

            <div className="bg-white rounded border">
              <VerticalDashboardRouter userVertical={currentVertical} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
