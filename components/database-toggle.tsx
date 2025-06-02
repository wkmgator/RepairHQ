"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Database, Zap, DollarSign, Shield } from "lucide-react"

interface DatabaseToggleProps {
  currentDatabase: "firebase" | "supabase"
  onToggle: (database: "firebase" | "supabase") => void
}

export function DatabaseToggle({ currentDatabase, onToggle }: DatabaseToggleProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate toggle delay
      onToggle(checked ? "supabase" : "firebase")
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Firebase</span>
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              Current
            </Badge>
          </div>
          <Switch checked={currentDatabase === "supabase"} onCheckedChange={handleToggle} disabled={isToggling} />
          <div className="flex items-center gap-2">
            <span className="font-medium">Supabase</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Recommended
            </Badge>
          </div>
        </div>

        {isToggling && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Switching database...</p>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-green-600" />
            <span>Better performance with PostgreSQL</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>More predictable pricing</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Open source (no vendor lock-in)</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => window.open("/migration", "_blank")}>
          View Migration Status
        </Button>
      </CardContent>
    </Card>
  )
}
