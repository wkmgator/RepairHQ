"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Gift, Trophy, Crown, Zap, Heart, Award, TrendingUp } from "lucide-react"

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, color: "bg-amber-600", icon: Star },
  { name: "Silver", minPoints: 500, color: "bg-gray-400", icon: Trophy },
  { name: "Gold", minPoints: 1000, color: "bg-yellow-500", icon: Crown },
  { name: "Platinum", minPoints: 2000, color: "bg-purple-600", icon: Zap },
]

const rewards = [
  {
    id: 1,
    name: "10% Off Next Repair",
    points: 100,
    type: "discount",
    description: "Get 10% off your next repair service",
    validUntil: "2024-12-31",
  },
  {
    id: 2,
    name: "Free Screen Protector",
    points: 200,
    type: "product",
    description: "Complimentary screen protector with installation",
    validUntil: "2024-12-31",
  },
  {
    id: 3,
    name: "Priority Service",
    points: 300,
    type: "service",
    description: "Skip the queue with priority service",
    validUntil: "2024-12-31",
  },
  {
    id: 4,
    name: "Free Diagnostic",
    points: 150,
    type: "service",
    description: "Complimentary device diagnostic service",
    validUntil: "2024-12-31",
  },
]

const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    points: 750,
    tier: "Silver",
    totalSpent: 1250,
    visits: 8,
    lastVisit: "2024-01-10",
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    name: "Sarah Davis",
    email: "sarah@example.com",
    points: 1200,
    tier: "Gold",
    totalSpent: 2100,
    visits: 12,
    lastVisit: "2024-01-12",
    joinDate: "2023-03-20",
  },
]

export function CustomerLoyaltyProgram() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0])

  const getCurrentTier = (points: number) => {
    return loyaltyTiers.reduce((prev, current) => (points >= current.minPoints ? current : prev))
  }

  const getNextTier = (points: number) => {
    return loyaltyTiers.find((tier) => tier.minPoints > points)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Tier</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Silver</div>
            <p className="text-xs text-muted-foreground">Customer average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">12-month retention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="tiers">Tier Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Loyalty Members</CardTitle>
                <CardDescription>Customers with highest points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => {
                    const currentTier = getCurrentTier(customer.points)
                    const nextTier = getNextTier(customer.points)
                    const TierIcon = currentTier.icon

                    return (
                      <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${currentTier.color} text-white`}>
                            <TierIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.points} points • {currentTier.name} tier
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{customer.visits} visits</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Redemptions</CardTitle>
                <CardDescription>Latest reward redemptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Gift className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Free Screen Protector</div>
                        <div className="text-sm text-muted-foreground">John Smith • 200 points</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Gift className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">10% Off Discount</div>
                        <div className="text-sm text-muted-foreground">Sarah Davis • 100 points</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Catalog</CardTitle>
              <CardDescription>Manage available rewards and redemption options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => (
                  <Card key={reward.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Gift className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{reward.points} pts</Badge>
                      </div>
                      <h3 className="font-medium mb-1">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Valid until {reward.validUntil}</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <Button>Add New Reward</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Tiers</CardTitle>
              <CardDescription>Configure tier requirements and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loyaltyTiers.map((tier, index) => {
                  const TierIcon = tier.icon
                  return (
                    <div key={tier.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${tier.color} text-white`}>
                          <TierIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{tier.name} Tier</div>
                          <div className="text-sm text-muted-foreground">{tier.minPoints}+ points required</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {index === 0 ? "5%" : index === 1 ? "10%" : index === 2 ? "15%" : "20%"} discount
                        </Badge>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
