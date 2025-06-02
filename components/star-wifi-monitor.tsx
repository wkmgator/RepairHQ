"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wifi,
  WifiOff,
  Signal,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Globe,
  Router,
  Monitor,
  Activity,
  Clock,
  Zap,
} from "lucide-react"

interface WiFiStatus {
  connected: boolean
  ssid: string
  signalStrength: number
  ipAddress: string
  macAddress: string
  frequency: number
  channel: number
  security: string
  uptime: number
  dataTransferred: {
    sent: number
    received: number
  }
  lastSeen: Date
  errors: string[]
}

export default function StarWiFiMonitor() {
  const [wifiStatus, setWifiStatus] = useState<WiFiStatus>({
    connected: true,
    ssid: "RepairHQ-WiFi",
    signalStrength: 78,
    ipAddress: "192.168.1.156",
    macAddress: "00:11:22:33:44:55",
    frequency: 2437,
    channel: 6,
    security: "WPA2",
    uptime: 3600000, // 1 hour in milliseconds
    dataTransferred: {
      sent: 1024 * 1024 * 2.5, // 2.5 MB
      received: 1024 * 1024 * 1.2, // 1.2 MB
    },
    lastSeen: new Date(),
    errors: [],
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const refreshStatus = async () => {
    setIsRefreshing(true)

    try {
      // Simulate API call to get printer WiFi status
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate status updates
      setWifiStatus((prev) => ({
        ...prev,
        signalStrength: Math.max(20, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
        uptime: prev.uptime + 30000, // Add 30 seconds
        dataTransferred: {
          sent: prev.dataTransferred.sent + Math.random() * 1024 * 10,
          received: prev.dataTransferred.received + Math.random() * 1024 * 5,
        },
        lastSeen: new Date(),
        connected: Math.random() > 0.05, // 95% chance to stay connected
        errors: Math.random() > 0.9 ? ["Weak signal detected"] : [],
      }))
    } catch (error) {
      console.error("Failed to refresh WiFi status:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatUptime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getSignalColor = (strength: number): string => {
    if (strength >= 80) return "text-green-600"
    if (strength >= 60) return "text-yellow-600"
    if (strength >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25)
    return (
      <div className="flex items-end space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-2 ${bar <= bars ? "bg-current" : "bg-gray-300"} rounded-sm`}
            style={{ height: `${bar * 3 + 4}px` }}
          />
        ))}
      </div>
    )
  }

  const getFrequencyBand = (frequency: number): string => {
    if (frequency < 3000) return "2.4GHz"
    if (frequency < 6000) return "5GHz"
    return "6GHz"
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoRefresh) {
      interval = setInterval(refreshStatus, 30000) // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-6">
      {/* Connection Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              {wifiStatus.connected ? (
                <Wifi className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 mr-2 text-red-600" />
              )}
              WiFi Connection Status
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
              <Button variant="outline" size="sm" onClick={refreshStatus} disabled={isRefreshing}>
                {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Connection Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={wifiStatus.connected ? "default" : "destructive"}>
                  {wifiStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
                {wifiStatus.connected && <span className="text-sm text-gray-500">to {wifiStatus.ssid}</span>}
              </div>
            </div>

            {/* Signal Strength */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Signal className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Signal Strength</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={getSignalColor(wifiStatus.signalStrength)}>
                  {getSignalBars(wifiStatus.signalStrength)}
                </div>
                <span className={`text-sm font-medium ${getSignalColor(wifiStatus.signalStrength)}`}>
                  {wifiStatus.signalStrength}%
                </span>
              </div>
            </div>

            {/* IP Address */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Router className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">IP Address</span>
              </div>
              <div className="text-sm font-mono">{wifiStatus.ipAddress}</div>
            </div>

            {/* Uptime */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <div className="text-sm">{formatUptime(wifiStatus.uptime)}</div>
            </div>
          </div>

          {/* Signal Strength Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Signal Quality</span>
              <span className="text-sm text-gray-500">{wifiStatus.signalStrength}%</span>
            </div>
            <Progress
              value={wifiStatus.signalStrength}
              className={`h-2 ${
                wifiStatus.signalStrength >= 80
                  ? "bg-green-100"
                  : wifiStatus.signalStrength >= 60
                    ? "bg-yellow-100"
                    : wifiStatus.signalStrength >= 40
                      ? "bg-orange-100"
                      : "bg-red-100"
              }`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Network Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Network Name:</span>
                <div className="font-medium">{wifiStatus.ssid}</div>
              </div>
              <div>
                <span className="text-gray-500">Security:</span>
                <div className="font-medium">{wifiStatus.security}</div>
              </div>
              <div>
                <span className="text-gray-500">Frequency:</span>
                <div className="font-medium">
                  {wifiStatus.frequency} MHz ({getFrequencyBand(wifiStatus.frequency)})
                </div>
              </div>
              <div>
                <span className="text-gray-500">Channel:</span>
                <div className="font-medium">{wifiStatus.channel}</div>
              </div>
              <div>
                <span className="text-gray-500">MAC Address:</span>
                <div className="font-medium font-mono">{wifiStatus.macAddress}</div>
              </div>
              <div>
                <span className="text-gray-500">Last Seen:</span>
                <div className="font-medium">{wifiStatus.lastSeen.toLocaleTimeString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Transfer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Data Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Data Sent:</span>
                <span className="text-sm font-medium">{formatBytes(wifiStatus.dataTransferred.sent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Data Received:</span>
                <span className="text-sm font-medium">{formatBytes(wifiStatus.dataTransferred.received)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Transfer:</span>
                <span className="text-sm font-medium">
                  {formatBytes(wifiStatus.dataTransferred.sent + wifiStatus.dataTransferred.received)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Transfer Rate</span>
              </div>
              <div className="text-xs text-gray-500">
                Real-time monitoring of data transfer between printer and network
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Errors */}
      {wifiStatus.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Alerts & Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {wifiStatus.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Connection Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {wifiStatus.signalStrength >= 70 ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : wifiStatus.signalStrength >= 40 ? (
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className="font-medium">Signal Quality</h3>
              <p className="text-sm text-gray-500">
                {wifiStatus.signalStrength >= 70 ? "Excellent" : wifiStatus.signalStrength >= 40 ? "Good" : "Poor"}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {wifiStatus.connected ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className="font-medium">Connectivity</h3>
              <p className="text-sm text-gray-500">{wifiStatus.connected ? "Stable" : "Disconnected"}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {wifiStatus.errors.length === 0 ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                )}
              </div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-gray-500">
                {wifiStatus.errors.length === 0 ? "No Issues" : `${wifiStatus.errors.length} Warning(s)`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
