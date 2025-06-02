"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Coins,
  BarChart3,
  ExternalLink,
  Copy,
  Shield,
  Zap,
  Target,
  Globe,
} from "lucide-react"

const GBT_TOKEN_ADDRESS = "0xBf632C62b6b842015B5912a2B2cE942bd13A30Ad"

// Mock price data - in real implementation, this would come from an API
const priceData = [
  { time: "00:00", price: 0.0823, volume: 12500 },
  { time: "04:00", price: 0.0834, volume: 15200 },
  { time: "08:00", price: 0.0847, volume: 18900 },
  { time: "12:00", price: 0.0852, volume: 16800 },
  { time: "16:00", price: 0.0845, volume: 21300 },
  { time: "20:00", price: 0.0847, volume: 19600 },
]

const tokenMetrics = [
  {
    label: "Market Cap",
    value: "$2.1M",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "24h Volume",
    value: "$156K",
    change: "+8.7%",
    trend: "up",
    icon: BarChart3,
  },
  {
    label: "Holders",
    value: "3,247",
    change: "+23",
    trend: "up",
    icon: Users,
  },
  {
    label: "Circulating Supply",
    value: "25M GBT",
    change: "Fixed",
    trend: "neutral",
    icon: Coins,
  },
]

const tokenomics = [
  { category: "Liquidity Pool", percentage: 40, amount: "10M GBT", color: "#3B82F6" },
  { category: "Rewards Pool", percentage: 25, amount: "6.25M GBT", color: "#10B981" },
  { category: "Team & Development", percentage: 15, amount: "3.75M GBT", color: "#F59E0B" },
  { category: "Marketing", percentage: 10, amount: "2.5M GBT", color: "#EF4444" },
  { category: "Community", percentage: 10, amount: "2.5M GBT", color: "#8B5CF6" },
]

export function GBTTokenInfo() {
  const [currentPrice, setCurrentPrice] = useState(0.0847)
  const [priceChange, setPriceChange] = useState(12.5)

  const copyTokenAddress = () => {
    navigator.clipboard.writeText(GBT_TOKEN_ADDRESS)
  }

  const addToMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: GBT_TOKEN_ADDRESS,
            symbol: "GBT",
            decimals: 18,
            image: "/images/gatorbite-logo.png",
          },
        },
      })
    } catch (error) {
      console.error("Error adding token:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                GBT
              </div>
              <div>
                <CardTitle className="text-2xl">GatorBite Token (GBT)</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>BSC BEP-20 Token</span>
                  <Badge variant="outline">Verified</Badge>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${currentPrice.toFixed(4)}</div>
              <div className={`flex items-center text-sm ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                {priceChange >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {priceChange >= 0 ? "+" : ""}
                {priceChange}% (24h)
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Contract:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                {GBT_TOKEN_ADDRESS.slice(0, 6)}...{GBT_TOKEN_ADDRESS.slice(-4)}
              </code>
              <Button variant="ghost" size="sm" onClick={copyTokenAddress} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={addToMetaMask}>
              Add to MetaMask
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://bscscan.com/token/${GBT_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                BscScan
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Token Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {tokenMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p
                  className={`text-xs flex items-center ${
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {metric.trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                  {metric.trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="utility">Utility</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>GBT Price Chart (24h)</CardTitle>
              <CardDescription>Real-time price and volume data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={["dataMin - 0.001", "dataMax + 0.001"]} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "price" ? `$${value}` : value,
                      name === "price" ? "Price" : "Volume",
                    ]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>How GBT tokens are allocated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokenomics.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">
                        {item.percentage}% ({item.amount})
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Economics</CardTitle>
                <CardDescription>Key economic parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span className="font-medium">25,000,000 GBT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">25,000,000 GBT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Burn Mechanism</span>
                    <span className="font-medium">2% per transaction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Staking Rewards</span>
                    <span className="font-medium">12.5% APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Liquidity Lock</span>
                    <span className="font-medium">2 Years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utility">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Repair Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Earn GBT tokens for completing repairs, customer reviews, and referrals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium">Discount Payments</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use GBT to pay for repairs and services at discounted rates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Staking Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stake GBT tokens to earn passive income and governance rights
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Priority Access</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  GBT holders get priority booking and exclusive service access
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium">DAO Governance</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vote on platform decisions and future development proposals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="h-5 w-5 text-teal-600" />
                  <h3 className="font-medium">Global Rewards</h3>
                </div>
                <p className="text-sm text-muted-foreground">Use GBT across partner repair shops worldwide</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>GBT Development Roadmap</CardTitle>
              <CardDescription>Upcoming features and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium text-green-600">Q1 2024 - Completed</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Token launch on BSC</li>
                      <li>• RepairHQ integration</li>
                      <li>• Basic rewards system</li>
                      <li>• PancakeSwap listing</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium text-blue-600">Q2 2024 - In Progress</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Staking platform launch</li>
                      <li>• NFT warranty system</li>
                      <li>• Mobile app integration</li>
                      <li>• Partnership expansion</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium text-yellow-600">Q3 2024 - Planned</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• DAO governance launch</li>
                      <li>• Cross-chain bridge</li>
                      <li>• DeFi yield farming</li>
                      <li>• Global marketplace</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gray-400 rounded-full mt-2" />
                  <div>
                    <h3 className="font-medium text-gray-600">Q4 2024 - Future</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Layer 2 scaling solution</li>
                      <li>• AI-powered features</li>
                      <li>• Enterprise partnerships</li>
                      <li>• Global expansion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Trading Links */}
      <Card>
        <CardHeader>
          <CardTitle>Trade GBT</CardTitle>
          <CardDescription>Buy, sell, and trade GatorBite tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild className="h-12">
              <a href="https://pancakeswap.finance/swap" target="_blank" rel="noopener noreferrer">
                <Coins className="mr-2 h-4 w-4" />
                PancakeSwap
              </a>
            </Button>
            <Button variant="outline" asChild className="h-12">
              <a href={`https://bscscan.com/token/${GBT_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                BscScan
              </a>
            </Button>
            <Button variant="outline" asChild className="h-12">
              <a href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer">
                <BarChart3 className="mr-2 h-4 w-4" />
                CoinMarketCap
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
