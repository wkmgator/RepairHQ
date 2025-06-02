"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, DollarSign, Star } from "lucide-react"

const locations = [
  {
    id: 1,
    name: "Downtown Store",
    address: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    email: "downtown@repairhq.com",
    manager: "John Smith",
    status: "active",
    revenue: 45230,
    customers: 234,
    repairs: 156,
    rating: 4.8,
    staff: 8,
    utilization: 87,
    openHours: "9 AM - 8 PM",
  },
  {
    id: 2,
    name: "Mall Location",
    address: "456 Shopping Center, Mall",
    phone: "(555) 234-5678",
    email: "mall@repairhq.com",
    manager: "Sarah Davis",
    status: "active",
    revenue: 38950,
    customers: 198,
    repairs: 134,
    rating: 4.6,
    staff: 6,
    utilization: 92,
    openHours: "10 AM - 9 PM",
  },
  {
    id: 3,
    name: "Suburban Branch",
    address: "789 Oak Ave, Suburbs",
    phone: "(555) 345-6789",
    email: "suburban@repairhq.com",
    manager: "Mike Johnson",
    status: "active",
    revenue: 28750,
    customers: 145,
    repairs: 98,
    rating: 4.7,
    staff: 5,
    utilization: 78,
    openHours: "9 AM - 7 PM",
  },
]

const inventoryTransfers = [
  {
    id: 1,
    from: "Downtown Store",
    to: "Mall Location",
    item: "iPhone 14 Screen - Black",
    quantity: 5,
    status: "in-transit",
    requestDate: "2024-01-14",
    expectedDate: "2024-01-16",
  },
  {
    id: 2,
    from: "Mall Location",
    to: "Suburban Branch",
    item: "Samsung Battery Pack",
    quantity: 10,
    status: "completed",
    requestDate: "2024-01-12",
    expectedDate: "2024-01-14",
  },
]

export function MultiLocationManagement() {
  const [selectedLocation, setSelectedLocation] = useState("all")

  const totalRevenue = locations.reduce((sum, loc) => sum + loc.revenue, 0)
  const totalCustomers = locations.reduce((sum, loc) => sum + loc.customers, 0)
  const avgRating = locations.reduce((sum, loc) => sum + loc.rating, 0) / locations.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Location Management</h2>
          <p className="text-muted-foreground">Manage all your store locations from one dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Add Location</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combined Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Transfers</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Location Overview</CardTitle>
                <CardDescription>Performance summary for all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              {location.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.manager}</div>
                            <div className="text-sm text-muted-foreground">{location.staff} staff</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${location.revenue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{location.repairs} repairs</div>
                        </TableCell>
                        <TableCell>{location.customers}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 text-yellow-500" />
                            {location.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{location.utilization}%</div>
                            <Progress value={location.utilization} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={location.status === "active" ? "default" : "secondary"}>
                            {location.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {location.name}
                      <Badge variant="outline">{location.status}</Badge>
                    </CardTitle>
                    <CardDescription>{location.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="font-medium">${location.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customers</span>
                      <span className="font-medium">{location.customers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rating</span>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-500" />
                        <span className="font-medium">{location.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Hours</span>
                      <span className="font-medium">{location.openHours}</span>
                    </div>
                    <div className="pt-2">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Transfers</CardTitle>
              <CardDescription>Manage inventory transfers between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Transfers</h3>
                  <Button>New Transfer</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">{transfer.item}</TableCell>
                        <TableCell>{transfer.from}</TableCell>
                        <TableCell>{transfer.to}</TableCell>
                        <TableCell>{transfer.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={transfer.status === "completed" ? "default" : "secondary"}>
                            {transfer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transfer.expectedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
