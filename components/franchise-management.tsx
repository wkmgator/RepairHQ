"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Plus,
} from "lucide-react"

const franchiseData = {
  overview: {
    totalLocations: 47,
    activeLocations: 45,
    totalRevenue: 2450000,
    averageRevenue: 52128,
    topPerformer: "Downtown Seattle",
    growthRate: 18.5,
  },
  locations: [
    {
      id: 1,
      name: "Downtown Seattle",
      address: "123 Pike Street, Seattle, WA",
      manager: "Sarah Johnson",
      phone: "(206) 555-0123",
      status: "active",
      performance: {
        revenue: 89500,
        target: 85000,
        growth: 23.5,
        customerSatisfaction: 4.9,
        efficiency: 94,
        profitMargin: 68,
      },
      metrics: {
        monthlyTickets: 245,
        avgTicketValue: 125,
        employeeCount: 8,
        customerRetention: 87,
      },
      alerts: [
        { type: "success", message: "Exceeded monthly target by 15%" },
        { type: "info", message: "New technician onboarded successfully" },
      ],
    },
    {
      id: 2,
      name: "Portland Central",
      address: "456 Morrison St, Portland, OR",
      manager: "Mike Chen",
      phone: "(503) 555-0456",
      status: "active",
      performance: {
        revenue: 67200,
        target: 70000,
        growth: 8.2,
        customerSatisfaction: 4.6,
        efficiency: 87,
        profitMargin: 62,
      },
      metrics: {
        monthlyTickets: 189,
        avgTicketValue: 118,
        employeeCount: 6,
        customerRetention: 82,
      },
      alerts: [
        { type: "warning", message: "Revenue 4% below target" },
        { type: "info", message: "Inventory levels optimal" },
      ],
    },
    {
      id: 3,
      name: "San Francisco Bay",
      address: "789 Market St, San Francisco, CA",
      manager: "Lisa Rodriguez",
      phone: "(415) 555-0789",
      status: "active",
      performance: {
        revenue: 95800,
        target: 90000,
        growth: 31.2,
        customerSatisfaction: 4.8,
        efficiency: 91,
        profitMargin: 71,
      },
      metrics: {
        monthlyTickets: 298,
        avgTicketValue: 142,
        employeeCount: 10,
        customerRetention: 89,
      },
      alerts: [
        { type: "success", message: "Highest growth rate in network" },
        { type: "warning", message: "Consider hiring additional staff" },
      ],
    },
  ],
  benchmarks: {
    revenue: {
      top25: 85000,
      median: 65000,
      bottom25: 45000,
    },
    satisfaction: {
      top25: 4.8,
      median: 4.5,
      bottom25: 4.2,
    },
    efficiency: {
      top25: 92,
      median: 85,
      bottom25: 78,
    },
  },
  systemWideMetrics: {
    totalCustomers: 12450,
    avgCustomerLifetime: 2.3,
    systemSatisfaction: 4.6,
    brandConsistency: 94,
    operationalCompliance: 97,
  },
}

const franchiseSupport = {
  trainingPrograms: [
    {
      name: "New Franchisee Onboarding",
      duration: "2 weeks",
      completion: 100,
      participants: 3,
      status: "active",
    },
    {
      name: "Advanced Repair Techniques",
      duration: "1 week",
      completion: 85,
      participants: 12,
      status: "active",
    },
    {
      name: "Customer Service Excellence",
      duration: "3 days",
      completion: 92,
      participants: 8,
      status: "completed",
    },
  ],
  supportTickets: [
    {
      id: "SUP-001",
      location: "Portland Central",
      issue: "POS System Integration",
      priority: "high",
      status: "in_progress",
      assignedTo: "Tech Support Team",
    },
    {
      id: "SUP-002",
      location: "Denver West",
      issue: "Inventory Management Setup",
      priority: "medium",
      status: "pending",
      assignedTo: "Operations Team",
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-red-100 text-red-800 border-red-200"
  }
}

export function FranchiseManagement() {
  const [selectedLocation, setSelectedLocation] = useState(franchiseData.locations[0])
  const [viewMode, setViewMode] = useState("overview")

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return "text-green-600"
    if (percentage >= 90) return "text-yellow-600"
    return "text-red-600"
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Franchise Management</h2>
          <p className="text-muted-foreground">Centralized control and performance monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* System-wide Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseData.overview.totalLocations}</div>
            <p className="text-xs text-muted-foreground">{franchiseData.overview.activeLocations} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(franchiseData.overview.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600">+{franchiseData.overview.growthRate}% growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Location</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${franchiseData.overview.averageRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseData.systemWideMetrics.systemSatisfaction}</div>
            <p className="text-xs text-muted-foreground">System-wide average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Consistency</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{franchiseData.systemWideMetrics.brandConsistency}%</div>
            <p className="text-xs text-muted-foreground">Compliance score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="locations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="locations">Location Performance</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="support">Franchise Support</TabsTrigger>
          <TabsTrigger value="analytics">System Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Location List */}
            <Card>
              <CardHeader>
                <CardTitle>Franchise Locations</CardTitle>
                <CardDescription>Select a location to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {franchiseData.locations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLocation.id === location.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{location.name}</h3>
                        <Badge variant={location.status === "active" ? "default" : "secondary"}>
                          {location.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Revenue:</span>
                        <span
                          className={`font-medium ${getPerformanceColor(location.performance.revenue, location.performance.target)}`}
                        >
                          ${location.performance.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{selectedLocation.name}</CardTitle>
                <CardDescription>Performance overview and key metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedLocation.performance.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Monthly Revenue</div>
                    <div className="text-xs text-green-600">
                      Target: ${selectedLocation.performance.target.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedLocation.performance.customerSatisfaction}
                    </div>
                    <div className="text-xs text-gray-600">Customer Rating</div>
                    <div className="text-xs text-blue-600">{selectedLocation.metrics.customerRetention}% retention</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedLocation.performance.efficiency}%</div>
                    <div className="text-xs text-gray-600">Efficiency Score</div>
                    <div className="text-xs text-purple-600">{selectedLocation.performance.profitMargin}% margin</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Operational Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly Tickets:</span>
                        <span className="font-medium">{selectedLocation.metrics.monthlyTickets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Ticket Value:</span>
                        <span className="font-medium">${selectedLocation.metrics.avgTicketValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employee Count:</span>
                        <span className="font-medium">{selectedLocation.metrics.employeeCount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Performance vs Target</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Revenue</span>
                          <span>
                            {Math.round(
                              (selectedLocation.performance.revenue / selectedLocation.performance.target) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(selectedLocation.performance.revenue / selectedLocation.performance.target) * 100}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Efficiency</span>
                          <span>{selectedLocation.performance.efficiency}%</span>
                        </div>
                        <Progress value={selectedLocation.performance.efficiency} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div>
                  <h4 className="font-medium mb-3">Location Alerts</h4>
                  <div className="space-y-2">
                    {selectedLocation.alerts.map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                        <div className="flex items-center">
                          {alert.type === "success" && <CheckCircle className="h-4 w-4 mr-2" />}
                          {alert.type === "warning" && <AlertTriangle className="h-4 w-4 mr-2" />}
                          {alert.type === "info" && <Clock className="h-4 w-4 mr-2" />}
                          <span className="text-sm">{alert.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Manager:</span>
                      <span className="ml-2 font-medium">{selectedLocation.manager}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedLocation.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>System-wide performance standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Revenue Benchmarks</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Top 25%</span>
                        <span className="font-medium text-green-600">
                          ${franchiseData.benchmarks.revenue.top25.toLocaleString()}+
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Median</span>
                        <span className="font-medium">${franchiseData.benchmarks.revenue.median.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bottom 25%</span>
                        <span className="font-medium text-red-600">
                          ${franchiseData.benchmarks.revenue.bottom25.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Customer Satisfaction</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Top 25%</span>
                        <span className="font-medium text-green-600">
                          {franchiseData.benchmarks.satisfaction.top25}+
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Median</span>
                        <span className="font-medium">{franchiseData.benchmarks.satisfaction.median}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bottom 25%</span>
                        <span className="font-medium text-red-600">
                          {franchiseData.benchmarks.satisfaction.bottom25}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Rankings</CardTitle>
                <CardDescription>Performance leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseData.locations
                    .sort((a, b) => b.performance.revenue - a.performance.revenue)
                    .map((location, index) => (
                      <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                  ? "bg-gray-100 text-gray-800"
                                  : index === 2
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-gray-600">{location.manager}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${location.performance.revenue.toLocaleString()}</div>
                          <div className="text-sm text-green-600">+{location.performance.growth}%</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Programs</CardTitle>
                <CardDescription>Franchise education and development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseSupport.trainingPrograms.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{program.name}</h3>
                        <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-1 font-medium">{program.duration}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Participants:</span>
                          <span className="ml-1 font-medium">{program.participants}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion Rate</span>
                          <span>{program.completion}%</span>
                        </div>
                        <Progress value={program.completion} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Franchise assistance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseSupport.supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">#{ticket.id}</span>
                        <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-1 font-medium">{ticket.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Issue:</span>
                          <span className="ml-1">{ticket.issue}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned to:</span>
                          <span className="ml-1">{ticket.assignedTo}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System-wide Trends</CardTitle>
                <CardDescription>Franchise network performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+{franchiseData.overview.growthRate}%</div>
                      <div className="text-xs text-gray-600">Revenue Growth</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {franchiseData.systemWideMetrics.totalCustomers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Customers</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Brand Consistency</span>
                        <span>{franchiseData.systemWideMetrics.brandConsistency}%</span>
                      </div>
                      <Progress value={franchiseData.systemWideMetrics.brandConsistency} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Operational Compliance</span>
                        <span>{franchiseData.systemWideMetrics.operationalCompliance}%</span>
                      </div>
                      <Progress value={franchiseData.systemWideMetrics.operationalCompliance} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>Expansion and improvement areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-sm">Market Expansion</span>
                    </div>
                    <p className="text-xs text-gray-600">5 new markets identified for potential franchise locations</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-sm">Service Expansion</span>
                    </div>
                    <p className="text-xs text-gray-600">Data recovery services showing 40% growth potential</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="font-medium text-sm">Training Enhancement</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Advanced certification program could improve efficiency by 15%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
