"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, Droplets, RefreshCw, ExternalLink } from "lucide-react"

// Mock data for liquidity pools
const pools = [
  {
    id: "gbt-eth",
    name: "GBT-ETH",
    platform: "Uniswap V3",
    tvl: 2450000,
    apr: 24.5,
    volume24h: 345000,
    fees24h: 1035,
    myLiquidity: 5000,
    myShare: 0.204,
    myEarnings: 1230,
    chart: [
      { date: "2023-01", tvl: 1200000, volume: 200000 },
      { date: "2023-02", tvl: 1500000, volume: 250000 },
      { date: "2023-03", tvl: 1800000, volume: 300000 },
      { date: "2023-04", tvl: 2100000, volume: 320000 },
      { date: "2023-05", tvl: 2300000, volume: 330000 },
      { date: "2023-06", tvl: 2450000, volume: 345000 },
    ],
  },
  {
    id: "gbt-usdc",
    name: "GBT-USDC",
    platform: "SushiSwap",
    tvl: 1850000,
    apr: 18.2,
    volume24h: 275000,
    fees24h: 825,
    myLiquidity: 3000,
    myShare: 0.162,
    myEarnings: 546,
    chart: [
      { date: "2023-01", tvl: 900000, volume: 150000 },
      { date: "2023-02", tvl: 1100000, volume: 180000 },
      { date: "2023-03", tvl: 1300000, volume: 210000 },
      { date: "2023-04", tvl: 1500000, volume: 240000 },
      { date: "2023-05", tvl: 1700000, volume: 260000 },
      { date: "2023-06", tvl: 1850000, volume: 275000 },
    ],
  },
  {
    id: "gbt-bnb",
    name: "GBT-BNB",
    platform: "PancakeSwap",
    tvl: 980000,
    apr: 22.8,
    volume24h: 195000,
    fees24h: 585,
    myLiquidity: 2000,
    myShare: 0.204,
    myEarnings: 456,
    chart: [
      { date: "2023-01", tvl: 500000, volume: 100000 },
      { date: "2023-02", tvl: 600000, volume: 120000 },
      { date: "2023-03", tvl: 700000, volume: 140000 },
      { date: "2023-04", tvl: 800000, volume: 160000 },
      { date: "2023-05", tvl: 900000, volume: 180000 },
      { date: "2023-06", tvl: 980000, volume: 195000 },
    ],
  },
]

export function LiquidityPoolInfo() {
  const [selectedPool, setSelectedPool] = useState(pools[0])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleRefresh = () => {
    // In a real app, this would fetch the latest data
    setLastUpdated(new Date())
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Liquidity Pools</CardTitle>
            <CardDescription>Manage your liquidity positions across multiple platforms</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated.toLocaleString()}</div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={selectedPool.id}
          onValueChange={(value) => {
            const pool = pools.find((p) => p.id === value)
            if (pool) setSelectedPool(pool)
          }}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            {pools.map((pool) => (
              <TabsTrigger key={pool.id} value={pool.id}>
                {pool.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Value Locked</div>
                <div className="text-2xl font-bold">{formatCurrency(selectedPool.tvl)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">APR</div>
                <div className="text-2xl font-bold text-green-500">{selectedPool.apr}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">24h Volume</div>
                <div className="text-2xl font-bold">{formatCurrency(selectedPool.volume24h)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">24h Fees</div>
                <div className="text-2xl font-bold">{formatCurrency(selectedPool.fees24h)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-position">My Position</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedPool.name} Pool</h3>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="mr-2">
                      {selectedPool.platform}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      <Droplets className="inline h-4 w-4 mr-1" />
                      Liquidity: {formatCurrency(selectedPool.tvl)}
                    </div>
                  </div>
                </div>
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on {selectedPool.platform}
                </Button>
              </div>

              <div className="h-[300px] mt-6">
                <ChartContainer
                  config={{
                    tvl: {
                      label: "Total Value Locked",
                      color: "hsl(var(--chart-1))",
                    },
                    volume: {
                      label: "Volume",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPool.chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="tvl" stroke="var(--color-tvl)" strokeWidth={2} />
                      <Line type="monotone" dataKey="volume" stroke="var(--color-volume)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="my-position" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">My Liquidity</div>
                    <div className="text-2xl font-bold">{formatCurrency(selectedPool.myLiquidity)}</div>
                    <div className="text-sm text-muted-foreground mt-1">{selectedPool.myShare}% of pool</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground">My Earnings</div>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(selectedPool.myEarnings)}</div>
                    <div className="text-sm text-green-500 mt-1 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {((selectedPool.apr * selectedPool.myShare) / 100).toFixed(2)}% APR
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col h-full justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Actions</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="flex-1">
                        Add
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Position Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pool</span>
                      <span className="font-medium">{selectedPool.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform</span>
                      <span className="font-medium">{selectedPool.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">My Liquidity</span>
                      <span className="font-medium">{formatCurrency(selectedPool.myLiquidity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pool Share</span>
                      <span className="font-medium">{selectedPool.myShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earnings</span>
                      <span className="font-medium text-green-500">{formatCurrency(selectedPool.myEarnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current APR</span>
                      <span className="font-medium text-green-500">{selectedPool.apr}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Volume Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedPool.chart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="volume" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>TVL Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedPool.chart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="tvl" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Data provided by GatorBite DeFi Analytics</div>
        <Button variant="link" size="sm">
          View All Pools
          <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
