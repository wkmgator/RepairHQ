"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, AlertTriangle, CheckCircle, Database, Server, TrendingUp, Users, AlertCircle } from "lucide-react"
import { monitoringService } from "@/lib/monitoring-service"
import { backupService } from "@/lib/backup-service"
import { supabase } from "@/lib/supabase"

export function MonitoringDashboard() {
  const [healthChecks, setHealthChecks] = useState<any[]>([])
  const [systemMetrics, setSystemMetrics] = useState<any>(null)
  const [backupHistory, setBackupHistory] = useState<any[]>([])
  const [recentErrors, setRecentErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMonitoringData()
    const interval = setInterval(loadMonitoringData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadMonitoringData() {
    try {
      // Load health checks
      const checks = await monitoringService.performHealthCheck()
      setHealthChecks(checks)

      // Load system metrics
      const metrics = await monitoringService.getSystemMetrics()
      setSystemMetrics(metrics)

      // Load backup history
      const { data: backups } = await supabase
        .from("backup_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
      setBackupHistory(backups || [])

      // Load recent errors
      const { data: errors } = await supabase
        .from("application_logs")
        .select("*")
        .eq("level", "ERROR")
        .order("created_at", { ascending: false })
        .limit(10)
      setRecentErrors(errors || [])

      setLoading(false)
    } catch (error) {
      console.error("Failed to load monitoring data:", error)
      setLoading(false)
    }
  }

  async function triggerBackup() {
    try {
      await backupService.createBackup({
        tables: ["customers", "inventory", "tickets", "pos_transactions", "invoices"],
        includeSchema: true,
        compression: true,
        encryption: true,
      })
      await loadMonitoringData()
    } catch (error) {
      console.error("Backup failed:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "down":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800">Down</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div>Loading monitoring data...</div>
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthChecks.filter((c) => c.status === "healthy").length}/{healthChecks.length}
            </div>
            <p className="text-xs text-muted-foreground">Services healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics ? `${Math.round(systemMetrics.cpu * 100)}%` : "N/A"}
            </div>
            <Progress value={systemMetrics?.cpu * 100 || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics ? `${Math.round(systemMetrics.memory * 100)}%` : "N/A"}
            </div>
            <Progress value={systemMetrics?.memory * 100 || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.activeConnections || 0}</div>
            <p className="text-xs text-muted-foreground">Current users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="errors">Recent Errors</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Status</CardTitle>
              <CardDescription>Real-time health status of all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.service}</div>
                        <div className="text-sm text-muted-foreground">Response time: {check.responseTime}ms</div>
                      </div>
                    </div>
                    {getStatusBadge(check.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>Recent backup operations</CardDescription>
                </div>
                <button
                  onClick={triggerBackup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Backup
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{backup.backup_type} backup</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(backup.started_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {backup.size_bytes ? `${(backup.size_bytes / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                      </div>
                      <Badge
                        className={
                          backup.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : backup.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {backup.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Latest error logs from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentErrors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No recent errors</div>
                ) : (
                  recentErrors.map((error) => (
                    <Alert key={error.id} className="border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium">{error.message}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {error.category} • {new Date(error.created_at).toLocaleString()}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Rate</CardTitle>
                <CardDescription>Requests per minute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemMetrics?.requestsPerMinute || 0}</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Normal traffic</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disk Usage</CardTitle>
                <CardDescription>Storage utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {systemMetrics ? `${Math.round(systemMetrics.diskSpace * 100)}%` : "N/A"}
                </div>
                <Progress value={systemMetrics?.diskSpace * 100 || 0} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
