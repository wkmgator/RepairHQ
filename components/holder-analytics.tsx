"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Search, Download, RefreshCw, Users, Wallet, TrendingUp, Clock } from "lucide-react"

// Mock data for holder analytics
const holderData = {
  totalHolders: 12458,
  activeHolders: 8745,
  newHolders24h: 124,
  avgHoldingTime: 145, // days
  totalSupply: 100000000,
  circulatingSupply: 65000000,
  distributionBySize: [
    { name: "Whales (>1M)", value: 45 },
    { name: "Large (100k-1M)", value: 25 },
    { name: "Medium (10k-100k)", value: 15 },
    { name: "Small (1k-10k)", value: 10 },
    { name: "Micro (<1k)", value: 5 },
  ],
  holderGrowth: [
    { month: "Jan", holders: 8000 },
    { month: "Feb", holders: 8500 },
    { month: "Mar", holders: 9200 },
    { month: "Apr", holders: 10000 },
    { month: "May", holders: 11200 },
    { month: "Jun", holders: 12458 },
  ],
  retentionRate: [
    { month: "Jan", rate: 92 },
    { month: "Feb", rate: 94 },
    { month: "Mar", rate: 91 },
    { month: "Apr", rate: 93 },
    { month: "May", rate: 95 },
    { month: "Jun", rate: 96 },
  ],
  topHolders: [
    { rank: 1, address: "0x1a2b...3c4d", balance: 5000000, percentage: 5.0, type: "Exchange" },
    { rank: 2, address: "0x5e6f...7g8h", balance: 3500000, percentage: 3.5, type: "Whale" },
    { rank: 3, address: "0x9i0j...1k2l", balance: 2800000, percentage: 2.8, type: "Team" },
    { rank: 4, address: "0x3m4n...5o6p", balance: 2200000, percentage: 2.2, type: "Whale" },
    { rank: 5, address: "0x7q8r...9s0t", balance: 1800000, percentage: 1.8, type: "Whale" },
  ],
}

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function HolderAnalytics() {
  const [timeframe, setTimeframe] = useState("6m")
  const [searchAddress, setSearchAddress] = useState("")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = () => {
    // In a real app, this would fetch the latest data
    setLastUpdated(new Date())
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">GBT Holder Analytics</CardTitle>
            <CardDescription>Analyze token holder distribution and behavior</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated.toLocaleString()}</div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="top-holders">Top Holders</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Users className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total Holders</div>
                    <div className="text-2xl font-bold">{formatNumber(holderData.totalHolders)}</div>
                    <div className="text-xs text-green-500">+{holderData.newHolders24h} (24h)</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Wallet className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Active Holders</div>
                    <div className="text-2xl font-bold">{formatNumber(holderData.activeHolders)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((holderData.activeHolders / holderData.totalHolders) * 100)}% of total
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <TrendingUp className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Circulating Supply</div>
                    <div className="text-2xl font-bold">{formatNumber(holderData.circulatingSupply)}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((holderData.circulatingSupply / holderData.totalSupply) * 100)}% of total
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Clock className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Avg Holding Time</div>
                    <div className="text-2xl font-bold">{holderData.avgHoldingTime} days</div>
                    <div className="text-xs text-green-500">Strong retention</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Holder Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={holderData.holderGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="holders" fill="#8884d8" name="Total Holders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Holder Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={holderData.distributionBySize}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {holderData.distributionBySize.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="pt-4">
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution by Holder Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={holderData.distributionBySize}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {holderData.distributionBySize.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Whale Concentration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">{holderData.distributionBySize[0].value}%</div>
                    <div className="text-sm text-muted-foreground text-center mt-1">of supply held by whales</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Retail Investors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {holderData.distributionBySize[3].value + holderData.distributionBySize[4].value}%
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-1">of supply held by retail</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Gini Coefficient</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">0.62</div>
                    <div className="text-sm text-muted-foreground text-center mt-1">token distribution equality</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="top-holders" className="pt-4">
            <div className="flex mb-4 space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by address..."
                  className="pl-8"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Rank</th>
                      <th className="h-10 px-4 text-left font-medium">Address</th>
                      <th className="h-10 px-4 text-left font-medium">Balance</th>
                      <th className="h-10 px-4 text-left font-medium">% of Supply</th>
                      <th className="h-10 px-4 text-left font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holderData.topHolders.map((holder) => (
                      <tr key={holder.rank} className="border-b">
                        <td className="p-4 align-middle">{holder.rank}</td>
                        <td className="p-4 align-middle font-mono">{holder.address}</td>
                        <td className="p-4 align-middle">{formatNumber(holder.balance)}</td>
                        <td className="p-4 align-middle">{holder.percentage}%</td>
                        <td className="p-4 align-middle">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              holder.type === "Exchange"
                                ? "bg-blue-100 text-blue-800"
                                : holder.type === "Whale"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {holder.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">Showing 5 of 100 holders</div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Holder Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={holderData.holderGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="holders" fill="#8884d8" name="Total Holders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Holder Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={holderData.retentionRate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#82ca9d" name="Retention Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Key Metrics Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">New Holders (Monthly Average)</span>
                    <span className="text-green-500">+450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Holder Churn Rate</span>
                    <span className="text-green-500">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Whale Accumulation</span>
                    <span className="text-amber-500">+2.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Retail Distribution</span>
                    <span className="text-green-500">+4.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Data provided by GatorBite Analytics</div>
        <Button variant="link" size="sm">
          View Full Analytics Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}
