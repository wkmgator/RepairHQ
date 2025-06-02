"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Activity, Users, Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, Server } from "lucide-react"

interface SystemMetrics {
  activeUsers: number
  requestsPerSecond: number
  databaseConnections: number
  memoryUsage: number
  cpuUsage: number
  responseTime: number
  errorRate: number
  timestamp: string
}

export function RealTimeMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/monitoring/metrics")
        const newMetrics = await response.json()

        setCurrentMetrics(newMetrics)
        setMetrics((prev) => [...prev.slice(-29), newMetrics]) // Keep last 30 data points
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
        setIsConnected(false)
      }
    }, 5000) // Update every 5 seconds

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
      if (value < threshold) return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      if (value < threshold * 1.5) return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>
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
          <p>Loading real-time metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time System Monitoring</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-600">Connected</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-600">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {getStatusBadge(currentMetrics.activeUsers, 10000)}
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
              {getStatusBadge(currentMetrics.requestsPerSecond, 5000)}
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
              {getStatusBadge(currentMetrics.responseTime, 1000)}
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
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-2xl font-bold">{(currentMetrics.errorRate * 100).toFixed(2)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              {getStatusBadge(currentMetrics.errorRate, 0.01)}
            </EliteCardContent>
          </EliteCard>
        </motion.div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Resource Usage
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">CPU Usage</span>
                <span className={`text-sm font-medium ${getStatusColor(currentMetrics.cpuUsage, 0.8)}`}>
                  {(currentMetrics.cpuUsage * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={currentMetrics.cpuUsage * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Memory Usage</span>
                <span className={`text-sm font-medium ${getStatusColor(currentMetrics.memoryUsage, 0.8)}`}>
                  {(currentMetrics.memoryUsage * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={currentMetrics.memoryUsage * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Database Connections</span>
                <span className={`text-sm font-medium ${getStatusColor(currentMetrics.databaseConnections, 80)}`}>
                  {currentMetrics.databaseConnections}/100
                </span>
              </div>
              <Progress value={currentMetrics.databaseConnections} className="h-2" />
            </div>
          </EliteCardContent>
        </EliteCard>

        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Request Volume
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                  formatter={(value: number) => [value.toLocaleString(), "Requests/sec"]}
                />
                <Area type="monotone" dataKey="requestsPerSecond" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </EliteCardContent>
        </EliteCard>
      </div>

      {/* Response Time Chart */}
      <EliteCard variant="glass">
        <EliteCardHeader>
          <EliteCardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Response Time Trends
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
  )
}
