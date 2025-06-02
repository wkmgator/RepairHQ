"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

export function LoyaltyRewards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Loyalty Program</CardTitle>
        <CardDescription>Earn and redeem points for discounts and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Current Points:</span>
            <span>2450</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Next Reward:</span>
            <span>10% off next service</span>
          </div>
          <Button variant="outline" className="w-full">
            Redeem Rewards
            <Gift className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
