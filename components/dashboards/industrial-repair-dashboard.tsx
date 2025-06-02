"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Wrench, Zap, AlertTriangle, CheckCircle, Clock, Factory } from "lucide-react"

// Mock data - replace with actual data fetching
const kpiData = {
  equipmentUptime: 98.5, // percentage
  pmComplianceRate: 92, // percentage
  mtbf: 1200, // hours (Mean Time Between Failures)
  mttr: 4.5, // hours (Mean Time To Repair)
  overdueWorkOrders: 5,
  criticalAlerts: 2,
}

const workOrdersByStatusData = [
  { name: "Pending", value: 15 },
  { name: "In Progress", value: 25 },
  { name: "Awaiting Parts", value: 8 },
  { name: "Completed", value: 150 },
  { name: "Overdue", value: kpiData.overdueWorkOrders },
]

const maintenanceTypeData = [
  { name: "Preventive", value: 60, fill: "#8884d8" },
  { name: "Corrective", value: 30, fill: "#82ca9d" },
  { name: "Predictive", value: 5, fill: "#ffc658" },
  { name: "Emergency", value: 5, fill: "#ff8042" },
]

export default function IndustrialRepairDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Factory className="mr-3 h-8 w-8 text-blue-600" />
          Industrial Maintenance Dashboard
        </h1>
        {/* Add date range picker or other filters here */}
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.equipmentUptime}%</div>
            <p className="text-xs text-muted-foreground">Target: 99%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PM Compliance</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pmComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">Preventive Maintenance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Work Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.overdueWorkOrders}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTBF (Hours)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.mtbf} hrs</div>
            <p className="text-xs text-muted-foreground">Mean Time Between Failures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTTR (Hours)</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.mttr} hrs</div>
            <p className="text-xs text-muted-foreground">Mean Time To Repair</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Active critical equipment alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Work Orders by Status</CardTitle>
            <CardDescription>Current distribution of work orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workOrdersByStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Work Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Types Breakdown</CardTitle>
            <CardDescription>Distribution of maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {maintenanceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Add more sections like Recent Activity, Upcoming PMs, etc. */}
    </div>
  )
}
