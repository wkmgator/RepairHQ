"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Activity,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  DollarSign,
} from "lucide-react"

interface EnterpriseMetrics {
  activeUsers: number
  requestsPerSecond: number
  databaseConnections: number
  memoryUsage: number
  cpuUsage: number
  responseTime: number
  errorRate: number
  queueBacklog: number
  cacheHitRate: number
  diskUsage: number
  timestamp: string
}

interface GlobalRegion {
  id: string
  name: string
  country: string
  isHealthy: boolean
  loadPercentage: number
  latency: number
  requestsPerSecond: number
}

export function EnterpriseMonitoringDashboard() {
  const [metrics, setMetrics] = useState<EnterpriseMetrics[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<EnterpriseMetrics | null>(null)
  const [globalRegions, setGlobalRegions] = useState<GlobalRegion[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(async () => {
      try {
        const [metricsResponse, regionsResponse, alertsResponse] = await Promise.all([
          fetch("/api/monitoring/enterprise-metrics"),
          fetch("/api/monitoring/global-regions"),
          fetch("/api/monitoring/alerts"),
        ])

        const newMetrics = await metricsResponse.json()
        const regions = await regionsResponse.json()
        const alertsData = await alertsResponse.json()

        setCurrentMetrics(newMetrics)
        setMetrics((prev) => [...prev.slice(-29), newMetrics])
        setGlobalRegions(regions)
        setAlerts(alertsData)
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to fetch enterprise metrics:", error)
        setIsConnected(false)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, threshold: number, inverse = false) => {
    if (inverse) {
      return value < threshold ? "text-green-600" : value < threshold * 1.5 ? "text-yellow-600" : "text-red-600"
    }
    return value > threshold ? "text-red-600" : value > threshold * 0.8 ? "text-yellow-600" : "text-green-600"
  }

  const getStatusBadge = (value: number, threshold: number, inverse = false) => {
    if (inverse) {
      if (value < threshold) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      if (value < threshold * 1.5) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
      return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
    } else {
      if (value > threshold) return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      if (value > threshold * 0.8) return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
    }
  }

  if (!currentMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse mx-auto mb-2" />
          <p>Loading enterprise metrics...</p>
        </div>
      </div>
    )
  }

  const pieData = [
    { name: "Healthy", value: globalRegions.filter((r) => r.isHealthy).length, color: "#10b981" },
    {
      name: "Warning",
      value: globalRegions.filter((r) => !r.isHealthy && r.loadPercentage < 90).length,
      color: "#f59e0b",
    },
    {
      name: "Critical",
      value: globalRegions.filter((r) => !r.isHealthy && r.loadPercentage >= 90).length,
      color: "#ef4444",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Enterprise Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">Real-time global infrastructure monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">Disconnected</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <EliteCard variant="glass">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{currentMetrics.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              {getStatusBadge(currentMetrics.activeUsers, 50000)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EliteCard variant="glass">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Requests/sec</p>
                  <p className="text-2xl font-bold">{currentMetrics.requestsPerSecond.toLocaleString()}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              {getStatusBadge(currentMetrics.requestsPerSecond, 10000)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EliteCard variant="glass">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">{currentMetrics.responseTime}ms</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              {getStatusBadge(currentMetrics.responseTime, 1000, true)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EliteCard variant="glass">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">{(currentMetrics.cacheHitRate * 100).toFixed(1)}%</p>
                </div>
                <Database className="w-8 h-8 text-green-600" />
              </div>
              {getStatusBadge(currentMetrics.cacheHitRate, 0.8)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EliteCard variant="glass">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-2xl font-bold">{(currentMetrics.errorRate * 100).toFixed(2)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              {getStatusBadge(currentMetrics.errorRate, 0.01, true)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>
      </div>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="global">Global Regions</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Volume Chart */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Request Volume Trends
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: number) => [value.toLocaleString(), "Requests/sec"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="requestsPerSecond"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </EliteCardContent>
            </EliteCard>

            {/* Response Time Chart */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Response Time Analysis
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                      formatter={(value: number) => [`${value}ms`, "Response Time"]}
                    />
                    <Line type="monotone" dataKey="responseTime" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </EliteCardContent>
            </EliteCard>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Resources */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Resources
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      CPU Usage
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(currentMetrics.cpuUsage, 0.8)}`}>
                      {(currentMetrics.cpuUsage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={currentMetrics.cpuUsage * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Memory Usage
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(currentMetrics.memoryUsage, 0.8)}`}>
                      {(currentMetrics.memoryUsage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={currentMetrics.memoryUsage * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      Disk Usage
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(currentMetrics.diskUsage, 0.9)}`}>
                      {(currentMetrics.diskUsage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={currentMetrics.diskUsage * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Database Connections
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(currentMetrics.databaseConnections, 80)}`}>
                      {currentMetrics.databaseConnections}/100
                    </span>
                  </div>
                  <Progress value={currentMetrics.databaseConnections} className="h-2" />
                </div>
              </EliteCardContent>
            </EliteCard>

            {/* Queue Status */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Background Processing
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-950">
                    <div>
                      <div className="font-medium">Queue Backlog</div>
                      <div className="text-sm text-muted-foreground">{currentMetrics.queueBacklog} jobs pending</div>
                    </div>
                    {getStatusBadge(currentMetrics.queueBacklog, 1000, true)}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950">
                    <div>
                      <div className="font-medium">Cache Performance</div>
                      <div className="text-sm text-muted-foreground">
                        {(currentMetrics.cacheHitRate * 100).toFixed(1)}% hit rate
                      </div>
                    </div>
                    {getStatusBadge(currentMetrics.cacheHitRate, 0.8)}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-purple-950">
                    <div>
                      <div className="font-medium">Error Rate</div>
                      <div className="text-sm text-muted-foreground">
                        {(currentMetrics.errorRate * 100).toFixed(2)}% errors
                      </div>
                    </div>
                    {getStatusBadge(currentMetrics.errorRate, 0.01, true)}
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </div>
        </TabsContent>

        <TabsContent value="global">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Regions Status */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Global Edge Locations
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-4">
                  {globalRegions.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            region.isHealthy ? "bg-green-500" : "bg-red-500"
                          } ${region.isHealthy ? "animate-pulse" : ""}`}
                        />
                        <div>
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Load: {region.loadPercentage.toFixed(1)}% • {region.requestsPerSecond} req/s
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={region.isHealthy ? "default" : "destructive"}>
                          {region.isHealthy ? "Healthy" : "Unhealthy"}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{region.latency}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </EliteCardContent>
            </EliteCard>

            {/* Regional Distribution */}
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Regional Health Distribution
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </EliteCardContent>
            </EliteCard>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <EliteCard variant="glass">
            <EliteCardHeader>
              <EliteCardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Alerts & Notifications
              </EliteCardTitle>
            </EliteCardHeader>
            <EliteCardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All Systems Operational</h3>
                    <p className="text-muted-foreground">No active alerts or issues detected</p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        alert.type === "critical"
                          ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                          : alert.type === "warning"
                            ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                            : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 mt-0.5 ${
                              alert.type === "critical"
                                ? "text-red-600"
                                : alert.type === "warning"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.component} • {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            alert.type === "critical"
                              ? "destructive"
                              : alert.type === "warning"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </EliteCardContent>
          </EliteCard>
        </TabsContent>

        <TabsContent value="costs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monthly Infrastructure Cost
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$4,247</div>
                <div className="text-sm text-muted-foreground mb-4">Current month projection</div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  18% below budget
                </Badge>
              </EliteCardContent>
            </EliteCard>

            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Cost per Request
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$0.08</div>
                <div className="text-sm text-muted-foreground mb-4">Per 1000 requests</div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Optimized
                </Badge>
              </EliteCardContent>
            </EliteCard>

            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Auto-scaling Savings
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">31%</div>
                <div className="text-sm text-muted-foreground mb-4">Cost reduction from scaling</div>
                <Badge variant="default" className="bg-purple-100 text-purple-800">
                  Excellent
                </Badge>
              </EliteCardContent>
            </EliteCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
