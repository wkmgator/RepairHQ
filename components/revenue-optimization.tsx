"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, Target, ShoppingCart, Zap, Brain, BarChart3, ArrowUp, Star, Gift } from "lucide-react"

const dynamicPricing = {
  currentStrategy: "demand_based",
  priceOptimization: 94,
  revenueIncrease: 23.5,
  strategies: [
    {
      id: "demand_based",
      name: "Demand-Based Pricing",
      description: "Adjust prices based on current demand and capacity",
      active: true,
      impact: "+18% revenue",
      confidence: 94,
    },
    {
      id: "complexity_based",
      name: "Complexity-Based Pricing",
      description: "Price based on repair difficulty and time required",
      active: true,
      impact: "+12% margin",
      confidence: 89,
    },
    {
      id: "seasonal",
      name: "Seasonal Pricing",
      description: "Adjust for seasonal demand patterns",
      active: false,
      impact: "+8% revenue",
      confidence: 76,
    },
  ],
  priceAdjustments: [
    {
      service: "iPhone Screen Repair",
      currentPrice: 89,
      suggestedPrice: 95,
      reason: "High demand, low inventory",
      confidence: 92,
      impact: "+$180/week",
    },
    {
      service: "Water Damage Repair",
      currentPrice: 149,
      suggestedPrice: 169,
      reason: "Specialized skill required",
      confidence: 88,
      impact: "+$240/week",
    },
    {
      service: "Battery Replacement",
      currentPrice: 59,
      suggestedPrice: 55,
      reason: "Increase volume, high competition",
      confidence: 85,
      impact: "+$120/week",
    },
  ],
}

const upselling = {
  opportunities: [
    {
      id: 1,
      customer: "John Smith",
      primaryService: "iPhone Screen Repair",
      upsellSuggestions: [
        {
          service: "Screen Protector Installation",
          price: 25,
          probability: 78,
          reason: "Prevent future damage",
        },
        {
          service: "Battery Health Check",
          price: 15,
          probability: 65,
          reason: "Device is 2 years old",
        },
      ],
      potentialRevenue: 40,
      confidence: 82,
    },
    {
      id: 2,
      customer: "Sarah Davis",
      primaryService: "Laptop Diagnostics",
      upsellSuggestions: [
        {
          service: "RAM Upgrade",
          price: 120,
          probability: 85,
          reason: "Performance improvement needed",
        },
        {
          service: "SSD Installation",
          price: 180,
          probability: 72,
          reason: "Faster boot times",
        },
      ],
      potentialRevenue: 300,
      confidence: 89,
    },
  ],
  performance: {
    upsellRate: 34,
    averageUpsellValue: 67,
    monthlyUpsellRevenue: 2840,
    topPerformingUpsells: [
      { service: "Screen Protectors", rate: 68, revenue: 890 },
      { service: "Extended Warranty", rate: 45, revenue: 1200 },
      { service: "Data Backup", rate: 52, revenue: 750 },
    ],
  },
}

const revenueMetrics = {
  monthly: {
    current: 28450,
    target: 32000,
    growth: 12.3,
    optimizationGain: 3200,
  },
  profitMargins: {
    labor: 68,
    parts: 45,
    services: 72,
    overall: 58,
  },
  revenueStreams: [
    { name: "Repairs", value: 18500, percentage: 65, growth: 8 },
    { name: "Parts Sales", value: 5200, percentage: 18, growth: 15 },
    { name: "Accessories", value: 2800, percentage: 10, growth: 22 },
    { name: "Services", value: 1950, percentage: 7, growth: 18 },
  ],
}

export function RevenueOptimization() {
  const [selectedPricing, setSelectedPricing] = useState("current")
  const [timeframe, setTimeframe] = useState("month")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Optimization</h2>
          <p className="text-muted-foreground">Dynamic pricing and intelligent upselling</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Target className="mr-2 h-4 w-4" />
            Set Targets
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueMetrics.monthly.current.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-xs text-green-600">+{revenueMetrics.monthly.growth}% vs last month</span>
            </div>
            <Progress value={(revenueMetrics.monthly.current / revenueMetrics.monthly.target) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Gain</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              +${revenueMetrics.monthly.optimizationGain.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From AI pricing & upselling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueMetrics.profitMargins.overall}%</div>
            <div className="flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-xs text-green-600">+4.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upsell Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upselling.performance.upsellRate}%</div>
            <p className="text-xs text-muted-foreground">Avg value: ${upselling.performance.averageUpsellValue}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
          <TabsTrigger value="upselling">Smart Upselling</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="forecasting">Revenue Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategies</CardTitle>
                <CardDescription>AI-powered pricing optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dynamicPricing.strategies.map((strategy) => (
                    <div key={strategy.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{strategy.name}</h3>
                        <Badge variant={strategy.active ? "default" : "secondary"}>
                          {strategy.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">{strategy.impact}</span>
                        <div className="flex items-center">
                          <Brain className="h-3 w-3 mr-1 text-purple-600" />
                          <span className="text-xs">{strategy.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Recommendations</CardTitle>
                <CardDescription>AI-suggested price adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dynamicPricing.priceAdjustments.map((adjustment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{adjustment.service}</h3>
                        <Badge variant="outline">{adjustment.confidence}% confident</Badge>
                      </div>

                      <div className="flex items-center space-x-4 mb-2">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Current</div>
                          <div className="font-medium">${adjustment.currentPrice}</div>
                        </div>
                        <ArrowUp className="h-4 w-4 text-green-600" />
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Suggested</div>
                          <div className="font-medium text-green-600">${adjustment.suggestedPrice}</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{adjustment.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">{adjustment.impact}</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                          <Button size="sm">Apply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upselling">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upselling Opportunities</CardTitle>
                <CardDescription>AI-identified revenue opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upselling.opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{opportunity.customer}</h3>
                        <Badge variant="outline">{opportunity.confidence}% match</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">Primary: {opportunity.primaryService}</p>

                      <div className="space-y-2 mb-3">
                        {opportunity.upsellSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{suggestion.service}</div>
                              <div className="text-xs text-gray-600">{suggestion.reason}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${suggestion.price}</div>
                              <div className="text-xs text-green-600">{suggestion.probability}% likely</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Potential: ${opportunity.potentialRevenue}</span>
                        <Button size="sm">
                          <Gift className="h-3 w-3 mr-1" />
                          Suggest
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upselling Performance</CardTitle>
                <CardDescription>Track upselling success metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{upselling.performance.upsellRate}%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${upselling.performance.monthlyUpsellRevenue}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Revenue</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Top Performing Upsells</h4>
                    <div className="space-y-3">
                      {upselling.performance.topPerformingUpsells.map((upsell, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{upsell.service}</div>
                            <div className="text-xs text-gray-600">{upsell.rate}% success rate</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${upsell.revenue}</div>
                            <div className="text-xs text-gray-600">this month</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      View All Opportunities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueMetrics.revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stream.name}</span>
                        <div className="text-right">
                          <div className="font-medium">${stream.value.toLocaleString()}</div>
                          <div className="text-xs text-green-600">+{stream.growth}%</div>
                        </div>
                      </div>
                      <Progress value={stream.percentage} />
                      <div className="text-xs text-gray-600">{stream.percentage}% of total revenue</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margin Analysis</CardTitle>
                <CardDescription>Profitability by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{revenueMetrics.profitMargins.labor}%</div>
                      <div className="text-xs text-gray-600">Labor Margin</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{revenueMetrics.profitMargins.parts}%</div>
                      <div className="text-xs text-gray-600">Parts Margin</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Services</span>
                      <div className="flex items-center">
                        <Progress value={revenueMetrics.profitMargins.services} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{revenueMetrics.profitMargins.services}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overall</span>
                      <div className="flex items-center">
                        <Progress value={revenueMetrics.profitMargins.overall} className="w-20 mr-2" />
                        <span className="text-sm font-medium">{revenueMetrics.profitMargins.overall}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        +${revenueMetrics.monthly.optimizationGain}
                      </div>
                      <div className="text-sm text-gray-600">Monthly optimization gain</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
              <CardDescription>AI-powered revenue predictions and growth opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <h3 className="font-medium">Next Month Forecast</h3>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$31,200</div>
                    <div className="text-sm text-gray-600">Projected Revenue</div>
                    <div className="text-xs text-green-600 mt-1">+9.7% growth</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Growth Opportunities</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <div className="font-medium">Premium Services</div>
                      <div className="text-xs text-gray-600">+$2,400 potential</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <div className="font-medium">Extended Hours</div>
                      <div className="text-xs text-gray-600">+$1,800 potential</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Risk Factors</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-orange-50 rounded text-sm">
                      <div className="font-medium">Seasonal Decline</div>
                      <div className="text-xs text-gray-600">-5% in Q1</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded text-sm">
                      <div className="font-medium">Competition</div>
                      <div className="text-xs text-gray-600">Monitor pricing</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
