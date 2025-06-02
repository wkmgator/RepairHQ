import type { Metadata } from "next"
import { Suspense } from "react"
import AdvancedPOSInterface from "@/components/advanced-pos-interface"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Advanced POS System - RepairHQ",
  description: "Complete advanced point of sale system with split payments, layaway, gift cards, and more",
}

function POSLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <CardContent className="flex items-center space-x-4 p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div>
            <p className="font-medium">Loading Advanced POS System</p>
            <p className="text-sm text-muted-foreground">Initializing payment processing...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdvancedPOSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<POSLoading />}>
        <AdvancedPOSInterface />
      </Suspense>
    </div>
  )
}
