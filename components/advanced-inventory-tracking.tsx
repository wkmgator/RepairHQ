"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, TrendingUp, Truck, BarChart3, QrCode, MapPin } from "lucide-react"

const inventoryData = [
  {
    id: 1,
    sku: "IPH14-SCR-BLK",
    name: "iPhone 14 Screen - Black",
    category: "Screens",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    location: "A1-B2",
    supplier: "TechParts Inc",
    lastRestocked: "2024-01-10",
    avgUsage: 8.5,
    leadTime: 3,
    cost: 89.99,
    price: 149.99,
    turnoverRate: 12.5,
    status: "low-stock",
  },
  {
    id: 2,
    sku: "SAM-BAT-S23",
    name: "Samsung Galaxy S23 Battery",
    category: "Batteries",
    currentStock: 25,
    minStock: 15,
    maxStock: 40,
    location: "B2-C1",
    supplier: "Mobile Parts Co",
    lastRestocked: "2024-01-12",
    avgUsage: 5.2,
    leadTime: 5,
    cost: 24.99,
    price: 49.99,
    turnoverRate: 8.3,
    status: "in-stock",
  },
]

export function AdvancedInventoryTracking() {
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Expected this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2x</div>
            <p className="text-xs text-muted-foreground">Annual average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="barcode">Barcode Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <div className="flex space-x-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="screens">Screens</SelectItem>
                    <SelectItem value="batteries">Batteries</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Turnover</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.currentStock}</span>
                            <span className="text-muted-foreground">/{item.maxStock}</span>
                          </div>
                          <Progress value={(item.currentStock / item.maxStock) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {item.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                          {item.turnoverRate}x
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "low-stock" ? "destructive" : "default"}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barcode">
          <Card>
            <CardHeader>
              <CardTitle>Barcode Scanner</CardTitle>
              <CardDescription>Scan items for quick inventory updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">Scan Barcode</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Point camera at barcode to scan</p>
                  <Button className="mt-4">Start Scanner</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Manual Entry</label>
                  <Input placeholder="Enter barcode manually" />
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" placeholder="1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
