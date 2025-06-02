"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Calculator,
  Clock,
  Download,
  Edit,
  Filter,
  Info,
  Layers,
  Lightbulb,
  Percent,
  RefreshCw,
  Search,
  Settings,
  Tag,
  TrendingUp,
  PlusCircle,
} from "lucide-react"

interface PricingRule {
  id: string
  name: string
  description: string
  priority: number
  conditions: PricingCondition[]
  adjustments: PricingAdjustment[]
  isActive: boolean
  lastModified: string
  createdBy: string
}

interface PricingCondition {
  id: string
  type: string
  operator: string
  value: string | number
  valueType: string
}

interface PricingAdjustment {
  id: string
  type: string
  value: number
  isPercentage: boolean
}

interface PricingRecommendation {
  id: string
  itemId: string
  itemName: string
  currentPrice: number
  recommendedPrice: number
  minPrice: number
  maxPrice: number
  confidence: number
  factors: string[]
  appliedAt: string
  status: "pending" | "applied" | "rejected"
}

interface PricingHistory {
  id: string
  itemId: string
  itemName: string
  oldPrice: number
  newPrice: number
  changePercent: number
  reason: string
  appliedAt: string
  appliedBy: string
}

interface PricingInsight {
  id: string
  type: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: string
  createdAt: string
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  cost: number
  price: number
  margin: number
  stock: number
  sales_velocity: number
  last_price_change: string
}

export default function DynamicPricingAI() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [rules, setRules] = useState<PricingRule[]>([])
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([])
  const [history, setHistory] = useState<PricingHistory[]>([])
  const [insights, setInsights] = useState<PricingInsight[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAISettings, setShowAISettings] = useState(false)
  const [aiSettings, setAISettings] = useState({
    competitiveAnalysis: true,
    demandForecasting: true,
    seasonalityFactors: true,
    costBasedPricing: true,
    elasticityModeling: true,
    inventoryLevels: true,
    marginTargets: {
      min: 20,
      target: 35,
      max: 50,
    },
    updateFrequency: "weekly",
    confidenceThreshold: 70,
    maxPriceChangePercent: 15,
  })

  useEffect(() => {
    fetchPricingData()
  }, [])

  const fetchPricingData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Supabase queries
      // Simulate data for demo

      // Pricing rules
      setRules([
        {
          id: "rule-1",
          name: "Seasonal Holiday Pricing",
          description: "Increase prices for high-demand items during holiday season",
          priority: 1,
          conditions: [
            {
              id: "cond-1",
              type: "date_range",
              operator: "between",
              value: "11/15/2023-12/31/2023",
              valueType: "date",
            },
            {
              id: "cond-2",
              type: "category",
              operator: "in",
              value: "phones,tablets,accessories",
              valueType: "string",
            },
          ],
          adjustments: [{ id: "adj-1", type: "markup", value: 10, isPercentage: true }],
          isActive: true,
          lastModified: "2023-10-15T14:23:45Z",
          createdBy: "Admin User",
        },
        {
          id: "rule-2",
          name: "Low Stock Premium",
          description: "Increase prices for items with low stock levels",
          priority: 2,
          conditions: [
            { id: "cond-3", type: "stock_level", operator: "less_than", value: 10, valueType: "number" },
            { id: "cond-4", type: "sales_velocity", operator: "greater_than", value: 5, valueType: "number" },
          ],
          adjustments: [{ id: "adj-2", type: "markup", value: 5, isPercentage: true }],
          isActive: true,
          lastModified: "2023-10-10T09:12:33Z",
          createdBy: "Admin User",
        },
        {
          id: "rule-3",
          name: "Bulk Purchase Discount",
          description: "Apply discount for bulk purchases",
          priority: 3,
          conditions: [{ id: "cond-5", type: "quantity", operator: "greater_than", value: 5, valueType: "number" }],
          adjustments: [{ id: "adj-3", type: "discount", value: 8, isPercentage: true }],
          isActive: true,
          lastModified: "2023-09-28T11:34:21Z",
          createdBy: "Admin User",
        },
        {
          id: "rule-4",
          name: "Competitor Price Matching",
          description: "Match competitor prices for selected items",
          priority: 4,
          conditions: [
            {
              id: "cond-6",
              type: "competitor_price",
              operator: "less_than",
              value: "current_price",
              valueType: "variable",
            },
            { id: "cond-7", type: "margin", operator: "greater_than", value: 15, valueType: "number" },
          ],
          adjustments: [{ id: "adj-4", type: "set_to", value: 0, isPercentage: false }],
          isActive: false,
          lastModified: "2023-09-20T15:22:18Z",
          createdBy: "Admin User",
        },
        {
          id: "rule-5",
          name: "Slow Moving Inventory Clearance",
          description: "Discount slow-moving inventory items",
          priority: 5,
          conditions: [
            { id: "cond-8", type: "sales_velocity", operator: "less_than", value: 1, valueType: "number" },
            { id: "cond-9", type: "days_in_inventory", operator: "greater_than", value: 90, valueType: "number" },
          ],
          adjustments: [{ id: "adj-5", type: "discount", value: 15, isPercentage: true }],
          isActive: true,
          lastModified: "2023-09-15T13:45:56Z",
          createdBy: "Admin User",
        },
      ])

      // Pricing recommendations
      setRecommendations([
        {
          id: "rec-1",
          itemId: "item-1",
          itemName: "iPhone 13 Screen Replacement",
          currentPrice: 129.99,
          recommendedPrice: 139.99,
          minPrice: 119.99,
          maxPrice: 149.99,
          confidence: 85,
          factors: ["Increased demand", "Competitor price analysis", "Seasonal trend"],
          appliedAt: "2023-11-15T14:23:45Z",
          status: "pending",
        },
        {
          id: "rec-2",
          itemId: "item-2",
          itemName: "Samsung Galaxy S21 Battery",
          currentPrice: 49.99,
          recommendedPrice: 44.99,
          minPrice: 39.99,
          maxPrice: 54.99,
          confidence: 78,
          factors: ["Decreased cost", "Competitive pressure", "Inventory optimization"],
          appliedAt: "2023-11-14T10:15:22Z",
          status: "applied",
        },
        {
          id: "rec-3",
          itemId: "item-3",
          itemName: "iPad Pro 12.9 Glass Repair",
          currentPrice: 199.99,
          recommendedPrice: 219.99,
          minPrice: 189.99,
          maxPrice: 229.99,
          confidence: 92,
          factors: ["Supply chain constraints", "High demand", "Competitor price increase"],
          appliedAt: "2023-11-13T16:42:18Z",
          status: "pending",
        },
        {
          id: "rec-4",
          itemId: "item-4",
          itemName: "Google Pixel 6 Charging Port",
          currentPrice: 79.99,
          recommendedPrice: 74.99,
          minPrice: 69.99,
          maxPrice: 84.99,
          confidence: 65,
          factors: ["Increased competition", "Excess inventory", "Seasonal adjustment"],
          appliedAt: "2023-11-12T09:34:51Z",
          status: "rejected",
        },
        {
          id: "rec-5",
          itemId: "item-5",
          itemName: "MacBook Pro Keyboard Replacement",
          currentPrice: 149.99,
          recommendedPrice: 169.99,
          minPrice: 139.99,
          maxPrice: 179.99,
          confidence: 88,
          factors: ["Limited supply", "High repair complexity", "Increased labor costs"],
          appliedAt: "2023-11-11T11:27:33Z",
          status: "pending",
        },
      ])

      // Pricing history
      setHistory([
        {
          id: "hist-1",
          itemId: "item-2",
          itemName: "Samsung Galaxy S21 Battery",
          oldPrice: 49.99,
          newPrice: 44.99,
          changePercent: -10.0,
          reason: "AI recommendation based on competitive analysis",
          appliedAt: "2023-11-14T10:15:22Z",
          appliedBy: "System",
        },
        {
          id: "hist-2",
          itemId: "item-6",
          itemName: "iPhone 12 Charging Port",
          oldPrice: 69.99,
          newPrice: 74.99,
          changePercent: 7.14,
          reason: "Seasonal demand increase",
          appliedAt: "2023-11-10T14:23:45Z",
          appliedBy: "John Doe",
        },
        {
          id: "hist-3",
          itemId: "item-7",
          itemName: "Samsung Galaxy Tab Screen",
          oldPrice: 129.99,
          newPrice: 119.99,
          changePercent: -7.69,
          reason: "Inventory clearance",
          appliedAt: "2023-11-08T09:12:33Z",
          appliedBy: "System",
        },
        {
          id: "hist-4",
          itemId: "item-8",
          itemName: "MacBook Air Trackpad",
          oldPrice: 89.99,
          newPrice: 99.99,
          changePercent: 11.11,
          reason: "Supply chain cost increase",
          appliedAt: "2023-11-05T11:34:21Z",
          appliedBy: "Jane Smith",
        },
        {
          id: "hist-5",
          itemId: "item-9",
          itemName: "Google Pixel 5 Screen",
          oldPrice: 109.99,
          newPrice: 99.99,
          changePercent: -9.09,
          reason: "Competitive price matching",
          appliedAt: "2023-11-01T15:22:18Z",
          appliedBy: "System",
        },
      ])

      // Pricing insights
      setInsights([
        {
          id: "insight-1",
          type: "opportunity",
          title: "Screen Repair Price Optimization",
          description:
            "Screen repair prices can be increased by 5-10% without impacting demand, based on recent market trends and competitor analysis.",
          impact: "high",
          category: "screens",
          createdAt: "2023-11-15T14:23:45Z",
        },
        {
          id: "insight-2",
          type: "risk",
          title: "Battery Replacement Competitive Pressure",
          description:
            "Competitors have reduced battery replacement prices by an average of 8%. Consider adjusting prices to maintain market share.",
          impact: "medium",
          category: "batteries",
          createdAt: "2023-11-14T10:15:22Z",
        },
        {
          id: "insight-3",
          type: "trend",
          title: "Seasonal Demand Increase",
          description:
            "Historical data shows a 15-20% increase in repair services during December. Consider dynamic pricing to optimize revenue.",
          impact: "high",
          category: "all",
          createdAt: "2023-11-13T16:42:18Z",
        },
        {
          id: "insight-4",
          type: "opportunity",
          title: "Bundle Pricing Strategy",
          description:
            "Customers who purchase screen repairs are 40% more likely to add a case or screen protector. Consider bundle pricing to increase average order value.",
          impact: "medium",
          category: "accessories",
          createdAt: "2023-11-12T09:34:51Z",
        },
        {
          id: "insight-5",
          type: "risk",
          title: "Charging Port Repair Margin Erosion",
          description:
            "Increased component costs have reduced margins on charging port repairs by 5%. Consider price adjustments to maintain profitability.",
          impact: "medium",
          category: "charging_ports",
          createdAt: "2023-11-11T11:27:33Z",
        },
      ])

      // Inventory items
      setInventory([
        {
          id: "item-1",
          name: "iPhone 13 Screen Replacement",
          sku: "SCR-IPH13-BLK",
          category: "screens",
          cost: 85.0,
          price: 129.99,
          margin: 34.61,
          stock: 24,
          sales_velocity: 3.5,
          last_price_change: "2023-10-15T14:23:45Z",
        },
        {
          id: "item-2",
          name: "Samsung Galaxy S21 Battery",
          sku: "BAT-SAMS21",
          category: "batteries",
          cost: 28.5,
          price: 44.99,
          margin: 36.65,
          stock: 42,
          sales_velocity: 2.8,
          last_price_change: "2023-11-14T10:15:22Z",
        },
        {
          id: "item-3",
          name: "iPad Pro 12.9 Glass Repair",
          sku: "SCR-IPDP129",
          category: "screens",
          cost: 135.0,
          price: 199.99,
          margin: 32.5,
          stock: 15,
          sales_velocity: 1.2,
          last_price_change: "2023-09-28T11:34:21Z",
        },
        {
          id: "item-4",
          name: "Google Pixel 6 Charging Port",
          sku: "CHG-PIX6",
          category: "charging_ports",
          cost: 45.0,
          price: 79.99,
          margin: 43.74,
          stock: 18,
          sales_velocity: 1.5,
          last_price_change: "2023-10-10T09:12:33Z",
        },
        {
          id: "item-5",
          name: "MacBook Pro Keyboard Replacement",
          sku: "KEY-MBP-2021",
          category: "keyboards",
          cost: 95.0,
          price: 149.99,
          margin: 36.66,
          stock: 8,
          sales_velocity: 0.9,
          last_price_change: "2023-09-15T13:45:56Z",
        },
        {
          id: "item-6",
          name: "iPhone 12 Charging Port",
          sku: "CHG-IPH12",
          category: "charging_ports",
          cost: 42.0,
          price: 74.99,
          margin: 43.99,
          stock: 22,
          sales_velocity: 2.1,
          last_price_change: "2023-11-10T14:23:45Z",
        },
        {
          id: "item-7",
          name: "Samsung Galaxy Tab Screen",
          sku: "SCR-SAMTAB",
          category: "screens",
          cost: 75.0,
          price: 119.99,
          margin: 37.49,
          stock: 12,
          sales_velocity: 0.8,
          last_price_change: "2023-11-08T09:12:33Z",
        },
        {
          id: "item-8",
          name: "MacBook Air Trackpad",
          sku: "TRK-MBA-2022",
          category: "trackpads",
          cost: 65.0,
          price: 99.99,
          margin: 34.99,
          stock: 10,
          sales_velocity: 0.7,
          last_price_change: "2023-11-05T11:34:21Z",
        },
        {
          id: "item-9",
          name: "Google Pixel 5 Screen",
          sku: "SCR-PIX5",
          category: "screens",
          cost: 65.0,
          price: 99.99,
          margin: 34.99,
          stock: 14,
          sales_velocity: 1.1,
          last_price_change: "2023-11-01T15:22:18Z",
        },
        {
          id: "item-10",
          name: "iPhone 11 Battery Replacement",
          sku: "BAT-IPH11",
          category: "batteries",
          cost: 25.0,
          price: 39.99,
          margin: 37.48,
          stock: 35,
          sales_velocity: 2.5,
          last_price_change: "2023-10-20T13:45:56Z",
        },
      ])
    } catch (error) {
      console.error("Error fetching pricing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyRecommendation = (id: string) => {
    // In a real app, this would update the database
    setRecommendations(recommendations.map((rec) => (rec.id === id ? { ...rec, status: "applied" } : rec)))

    // Add to history
    const recommendation = recommendations.find((rec) => rec.id === id)
    if (recommendation) {
      const historyEntry: PricingHistory = {
        id: `hist-${Date.now()}`,
        itemId: recommendation.itemId,
        itemName: recommendation.itemName,
        oldPrice: recommendation.currentPrice,
        newPrice: recommendation.recommendedPrice,
        changePercent:
          ((recommendation.recommendedPrice - recommendation.currentPrice) / recommendation.currentPrice) * 100,
        reason: `AI recommendation based on ${recommendation.factors.join(", ")}`,
        appliedAt: new Date().toISOString(),
        appliedBy: "System",
      }
      setHistory([historyEntry, ...history])

      // Update inventory price
      setInventory(
        inventory.map((item) =>
          item.id === recommendation.itemId
            ? { ...item, price: recommendation.recommendedPrice, last_price_change: new Date().toISOString() }
            : item,
        ),
      )
    }
  }

  const rejectRecommendation = (id: string) => {
    setRecommendations(recommendations.map((rec) => (rec.id === id ? { ...rec, status: "rejected" } : rec)))
  }

  const getCategories = () => {
    const categories = new Set<string>()
    inventory.forEach((item) => categories.add(item.category))
    return Array.from(categories)
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getPriceChangeClass = (changePercent: number) => {
    if (changePercent > 0) return "text-green-600"
    if (changePercent < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getPriceChangeIcon = (changePercent: number) => {
    if (changePercent > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (changePercent < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return null
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800"
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-100 text-red-800"
    if (impact === "medium") return "bg-yellow-100 text-yellow-800"
    return "bg-blue-100 text-blue-800"
  }

  const getInsightTypeColor = (type: string) => {
    if (type === "opportunity") return "bg-green-100 text-green-800"
    if (type === "risk") return "bg-red-100 text-red-800"
    return "bg-blue-100 text-blue-800"
  }

  const getStockLevelColor = (stock: number, velocity: number) => {
    // Calculate weeks of inventory
    const weeksOfInventory = velocity > 0 ? stock / velocity : 999

    if (weeksOfInventory < 2) return "bg-red-100 text-red-800"
    if (weeksOfInventory < 4) return "bg-yellow-100 text-yellow-800"
    if (weeksOfInventory > 12) return "bg-blue-100 text-blue-800"
    return "bg-green-100 text-green-800"
  }

  const getStockLevelText = (stock: number, velocity: number) => {
    // Calculate weeks of inventory
    const weeksOfInventory = velocity > 0 ? stock / velocity : 999

    if (weeksOfInventory < 2) return "Low"
    if (weeksOfInventory < 4) return "Warning"
    if (weeksOfInventory > 12) return "Excess"
    return "Optimal"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dynamic Pricing AI</h1>
          <p className="text-gray-600">Optimize your pricing strategy with AI-powered recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAISettings(!showAISettings)}>
            <Settings className="w-4 h-4 mr-2" />
            AI Settings
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Recommendations
          </Button>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showAISettings && (
        <Card>
          <CardHeader>
            <CardTitle>AI Pricing Engine Settings</CardTitle>
            <CardDescription>Configure how the AI generates pricing recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Pricing Factors</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="competitive-analysis"
                        checked={aiSettings.competitiveAnalysis}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, competitiveAnalysis: checked })}
                      />
                      <Label htmlFor="competitive-analysis">Competitive Analysis</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="demand-forecasting"
                        checked={aiSettings.demandForecasting}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, demandForecasting: checked })}
                      />
                      <Label htmlFor="demand-forecasting">Demand Forecasting</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="seasonality"
                        checked={aiSettings.seasonalityFactors}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, seasonalityFactors: checked })}
                      />
                      <Label htmlFor="seasonality">Seasonality Factors</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cost-based"
                        checked={aiSettings.costBasedPricing}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, costBasedPricing: checked })}
                      />
                      <Label htmlFor="cost-based">Cost-Based Pricing</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="elasticity"
                        checked={aiSettings.elasticityModeling}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, elasticityModeling: checked })}
                      />
                      <Label htmlFor="elasticity">Price Elasticity Modeling</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="inventory"
                        checked={aiSettings.inventoryLevels}
                        onCheckedChange={(checked) => setAISettings({ ...aiSettings, inventoryLevels: checked })}
                      />
                      <Label htmlFor="inventory">Inventory Levels</Label>
                    </div>
                    <Info className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Pricing Parameters</h3>

                <div className="space-y-2">
                  <Label>Margin Targets (%)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">Minimum</Label>
                      <Input
                        type="number"
                        value={aiSettings.marginTargets.min}
                        onChange={(e) =>
                          setAISettings({
                            ...aiSettings,
                            marginTargets: {
                              ...aiSettings.marginTargets,
                              min: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Target</Label>
                      <Input
                        type="number"
                        value={aiSettings.marginTargets.target}
                        onChange={(e) =>
                          setAISettings({
                            ...aiSettings,
                            marginTargets: {
                              ...aiSettings.marginTargets,
                              target: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Maximum</Label>
                      <Input
                        type="number"
                        value={aiSettings.marginTargets.max}
                        onChange={(e) =>
                          setAISettings({
                            ...aiSettings,
                            marginTargets: {
                              ...aiSettings.marginTargets,
                              max: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Update Frequency</Label>
                  <Select
                    value={aiSettings.updateFrequency}
                    onValueChange={(value) => setAISettings({ ...aiSettings, updateFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Confidence Threshold ({aiSettings.confidenceThreshold}%)</Label>
                  </div>
                  <Slider
                    value={[aiSettings.confidenceThreshold]}
                    min={50}
                    max={95}
                    step={5}
                    onValueChange={(value) => setAISettings({ ...aiSettings, confidenceThreshold: value[0] })}
                  />
                  <p className="text-xs text-gray-500">
                    Only show recommendations with confidence above this threshold
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Maximum Price Change ({aiSettings.maxPriceChangePercent}%)</Label>
                  </div>
                  <Slider
                    value={[aiSettings.maxPriceChangePercent]}
                    min={5}
                    max={30}
                    step={1}
                    onValueChange={(value) => setAISettings({ ...aiSettings, maxPriceChangePercent: value[0] })}
                  />
                  <p className="text-xs text-gray-500">Limit the maximum price change percentage</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2">
              Reset to Defaults
            </Button>
            <Button onClick={() => setShowAISettings(false)}>Save Settings</Button>
          </CardFooter>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="rules">Pricing Rules</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Pricing</TabsTrigger>
          <TabsTrigger value="history">Price History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Recommendations</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendations.filter((r) => r.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">Pending price changes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(inventory.reduce((acc, item) => acc + item.margin, 0) / inventory.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Target: {aiSettings.marginTargets.target}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Changes (30d)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{history.length}</div>
                <p className="text-xs text-muted-foreground">
                  {history.filter((h) => h.changePercent > 0).length} increases,{" "}
                  {history.filter((h) => h.changePercent < 0).length} decreases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pricing Rules</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rules.filter((r) => r.isActive).length}</div>
                <p className="text-xs text-muted-foreground">Out of {rules.length} total rules</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Price Recommendations</CardTitle>
              <CardDescription>AI-generated pricing suggestions based on market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations
                  .filter((r) => r.status === "pending")
                  .slice(0, 3)
                  .map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{rec.itemName}</div>
                        <div className="text-sm text-gray-500">
                          Current: ${rec.currentPrice.toFixed(2)} → Recommended: ${rec.recommendedPrice.toFixed(2)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Badge className={getConfidenceColor(rec.confidence)}>{rec.confidence}% Confidence</Badge>
                          <span className="text-xs text-gray-500 ml-2">Based on: {rec.factors.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => applyRecommendation(rec.id)}>
                          Apply
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => rejectRecommendation(rec.id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                {recommendations.filter((r) => r.status === "pending").length === 0 && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Pending Recommendations</h3>
                    <p className="mt-1 text-sm text-gray-500">All pricing recommendations have been processed.</p>
                  </div>
                )}
              </div>
              {recommendations.filter((r) => r.status === "pending").length > 3 && (
                <Button variant="link" className="mt-4" onClick={() => setActiveTab("recommendations")}>
                  View all recommendations
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Insights Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Insights</CardTitle>
              <CardDescription>AI-generated insights to optimize your pricing strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge className={getInsightTypeColor(insight.type)}>
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(insight.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-medium mt-2">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4" onClick={() => setActiveTab("insights")}>
                View all insights
              </Button>
            </CardContent>
          </Card>

          {/* Price Change History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price Change History</CardTitle>
              <CardDescription>Recent price adjustments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    increases: {
                      label: "Price Increases",
                      color: "hsl(var(--chart-1))",
                    },
                    decreases: {
                      label: "Price Decreases",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jul", increases: 4, decreases: 2 },
                        { month: "Aug", increases: 3, decreases: 5 },
                        { month: "Sep", increases: 5, decreases: 3 },
                        { month: "Oct", increases: 7, decreases: 2 },
                        { month: "Nov", increases: 3, decreases: 4 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="increases" fill="var(--color-increases)" name="Price Increases" />
                      <Bar dataKey="decreases" fill="var(--color-decreases)" name="Price Decreases" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Recommendations</CardTitle>
              <CardDescription>
                AI-generated pricing suggestions based on market data and business rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label>Status:</Label>
                    <Select defaultValue="pending">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Recommendations</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Recommendations
                  </Button>
                </div>

                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 border rounded-lg ${rec.status === "applied" ? "bg-green-50" : rec.status === "rejected" ? "bg-gray-50" : ""}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rec.itemName}</h3>
                          {rec.status === "applied" && <Badge className="bg-green-100 text-green-800">Applied</Badge>}
                          {rec.status === "rejected" && <Badge variant="outline">Rejected</Badge>}
                          {rec.status === "pending" && <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="text-sm">
                            Current: <span className="font-medium">${rec.currentPrice.toFixed(2)}</span>
                          </div>
                          <div className="mx-2">→</div>
                          <div className="text-sm">
                            Recommended: <span className="font-medium">${rec.recommendedPrice.toFixed(2)}</span>
                          </div>
                          <div
                            className={`ml-2 text-sm ${getPriceChangeClass(((rec.recommendedPrice - rec.currentPrice) / rec.currentPrice) * 100)}`}
                          >
                            ({(((rec.recommendedPrice - rec.currentPrice) / rec.currentPrice) * 100).toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                      {rec.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => applyRecommendation(rec.id)}>
                            Apply
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => rejectRecommendation(rec.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium">Price Range</h4>
                        <div className="flex items-center mt-1">
                          <div className="text-sm text-gray-500">
                            Min: ${rec.minPrice.toFixed(2)} | Max: ${rec.maxPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Confidence</h4>
                        <div className="flex items-center mt-1">
                          <Progress value={rec.confidence} className="h-2 flex-1 mr-2" />
                          <Badge className={getConfidenceColor(rec.confidence)}>{rec.confidence}%</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Generated</h4>
                        <div className="text-sm text-gray-500 mt-1">{new Date(rec.appliedAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Factors</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rec.factors.map((factor, index) => (
                          <Badge key={index} variant="outline">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pricing Rules</CardTitle>
                  <CardDescription>Configure dynamic pricing rules and conditions</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <CardDescription>{rule.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={rule.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Priority {rule.priority}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Conditions</h3>
                          <div className="space-y-2">
                            {rule.conditions.map((condition) => (
                              <div key={condition.id} className="text-sm p-2 border rounded-md">
                                <span className="font-medium">
                                  {condition.type
                                    .split("_")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                </span>
                                <span className="mx-1">{condition.operator.replace("_", " ")}</span>
                                <span>{condition.value.toString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Adjustments</h3>
                          <div className="space-y-2">
                            {rule.adjustments.map((adjustment) => (
                              <div key={adjustment.id} className="text-sm p-2 border rounded-md">
                                <span className="font-medium">
                                  {adjustment.type === "markup"
                                    ? "Increase price by"
                                    : adjustment.type === "discount"
                                      ? "Decrease price by"
                                      : "Set price to"}
                                </span>
                                <span className="mx-1">
                                  {adjustment.isPercentage ? `${adjustment.value}%` : `$${adjustment.value.toFixed(2)}`}
                                </span>
                                {adjustment.type === "set_to" && <span>of competitor price</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-500">
                        Last modified: {new Date(rule.lastModified).toLocaleDateString()} by {rule.createdBy}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          {rule.isActive ? <>Disable</> : <>Enable</>}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Pricing</CardTitle>
                  <CardDescription>Manage and optimize pricing for your inventory items</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Bulk Update
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search inventory..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>
                            {item.category
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </TableCell>
                          <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                item.margin < aiSettings.marginTargets.min
                                  ? "text-red-600"
                                  : item.margin > aiSettings.marginTargets.max
                                    ? "text-blue-600"
                                    : "text-green-600"
                              }
                            >
                              {item.margin.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStockLevelColor(item.stock, item.sales_velocity)}>
                              {item.stock} ({getStockLevelText(item.stock, item.sales_velocity)})
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {new Date(item.last_price_change).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Change History</CardTitle>
              <CardDescription>Record of all price adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label>Time Range:</Label>
                    <Select defaultValue="30d">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export History
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Old Price</TableHead>
                        <TableHead className="text-right">New Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Applied By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{new Date(entry.appliedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{entry.itemName}</TableCell>
                          <TableCell className="text-right">${entry.oldPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${entry.newPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              {getPriceChangeIcon(entry.changePercent)}
                              <span className={getPriceChangeClass(entry.changePercent)}>
                                {entry.changePercent > 0 ? "+" : ""}
                                {entry.changePercent.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{entry.reason}</TableCell>
                          <TableCell>{entry.appliedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Insights</CardTitle>
              <CardDescription>AI-generated insights to optimize your pricing strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Label>Filter:</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter insights" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Insights</SelectItem>
                        <SelectItem value="opportunity">Opportunities</SelectItem>
                        <SelectItem value="risk">Risks</SelectItem>
                        <SelectItem value="trend">Trends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    Generate New Insights
                  </Button>
                </div>

                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge className={getInsightTypeColor(insight.type)}>
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </Badge>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                        </Badge>
                        {insight.category !== "all" && (
                          <Badge variant="outline">
                            {insight.category
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{new Date(insight.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-medium mt-2">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <Tag className="h-4 w-4 mr-2" />
                        Apply to Rules
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
