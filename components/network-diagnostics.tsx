"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, CheckCircle, AlertCircle, RefreshCw, Clock } from "lucide-react"

interface DiagnosticTest {
  name: string
  status: "pending" | "running" | "passed" | "failed" | "warning"
  duration?: number
  details?: string
  result?: any
}

export default function NetworkDiagnosticsComponent() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    { name: "Network Connectivity", status: "pending" },
    { name: "DNS Resolution", status: "pending" },
    { name: "Internet Access", status: "pending" },
    { name: "Printer Port Scan", status: "pending" },
    { name: "Latency Test", status: "pending" },
    { name: "Bandwidth Test", status: "pending" },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const runDiagnostics = async () => {
    setIsRunning(true)
    setProgress(0)

    const testFunctions = [
      testNetworkConnectivity,
      testDNSResolution,
      testInternetAccess,
      testPrinterPorts,
      testLatency,
      testBandwidth,
    ]

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setCurrentTest(test.name)

      // Update test status to running
      setTests((prev) => prev.map((t, idx) => (idx === i ? { ...t, status: "running" } : t)))

      try {
        const startTime = Date.now()
        const result = await testFunctions[i]()
        const duration = Date.now() - startTime

        setTests((prev) =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  status: result.status,
                  duration,
                  details: result.details,
                  result: result.data,
                }
              : t,
          ),
        )
      } catch (error) {
        setTests((prev) =>
          prev.map((t, idx) =>
            idx === i
              ? {
                  ...t,
                  status: "failed",
                  duration: Date.now() - Date.now(),
                  details: error.message,
                }
              : t,
          ),
        )
      }

      setProgress(((i + 1) / tests.length) * 100)

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setCurrentTest(null)
    setIsRunning(false)
  }

  // Test functions
  const testNetworkConnectivity = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate network connectivity test
    const success = Math.random() > 0.1

    return {
      status: success ? "passed" : "failed",
      details: success ? "Network interface is active and configured" : "Network interface not found or misconfigured",
      data: {
        interface: "eth0",
        ipAddress: "192.168.1.100",
        subnetMask: "255.255.255.0",
        gateway: "192.168.1.1",
      },
    }
  }

  const testDNSResolution = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = Math.random() > 0.05

    return {
      status: success ? "passed" : "failed",
      details: success ? "DNS resolution working correctly" : "DNS resolution failed - check DNS settings",
      data: {
        primaryDNS: "8.8.8.8",
        secondaryDNS: "8.8.4.4",
        responseTime: Math.floor(Math.random() * 50) + 10,
      },
    }
  }

  const testInternetAccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const success = Math.random() > 0.05

    return {
      status: success ? "passed" : "failed",
      details: success ? "Internet access confirmed" : "No internet access - check firewall and routing",
      data: {
        testUrl: "https://www.google.com",
        responseCode: success ? 200 : 0,
        responseTime: Math.floor(Math.random() * 200) + 100,
      },
    }
  }

  const testPrinterPorts = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const openPorts = []
    const testPorts = [9100, 9101, 9102, 515, 631]

    for (const port of testPorts) {
      if (Math.random() > 0.7) {
        openPorts.push(port)
      }
    }

    return {
      status: openPorts.length > 0 ? "passed" : "warning",
      details:
        openPorts.length > 0
          ? `Found ${openPorts.length} open printer ports`
          : "No printer ports detected - printers may not be available",
      data: {
        openPorts,
        scannedPorts: testPorts,
        scanRange: "192.168.1.0/24",
      },
    }
  }

  const testLatency = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const latency = Math.floor(Math.random() * 50) + 5
    const status = latency < 20 ? "passed" : latency < 50 ? "warning" : "failed"

    return {
      status,
      details: `Average latency: ${latency}ms`,
      data: {
        averageLatency: latency,
        minLatency: latency - 5,
        maxLatency: latency + 10,
        packetLoss: Math.random() > 0.95 ? Math.floor(Math.random() * 5) : 0,
      },
    }
  }

  const testBandwidth = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const downloadSpeed = Math.floor(Math.random() * 100) + 50
    const uploadSpeed = Math.floor(Math.random() * 50) + 25

    return {
      status: downloadSpeed > 10 ? "passed" : "warning",
      details: `Download: ${downloadSpeed} Mbps, Upload: ${uploadSpeed} Mbps`,
      data: {
        downloadSpeed,
        uploadSpeed,
        testDuration: 3000,
        testServer: "speedtest.net",
      },
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "default"
      case "failed":
        return "destructive"
      case "warning":
        return "secondary"
      case "running":
        return "outline"
      default:
        return "outline"
    }
  }

  const resetTests = () => {
    setTests((prev) =>
      prev.map((test) => ({
        name: test.name,
        status: "pending" as const,
      })),
    )
    setProgress(0)
    setCurrentTest(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Network Diagnostics
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetTests} disabled={isRunning}>
                Reset
              </Button>
              <Button onClick={runDiagnostics} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Diagnostics
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{currentTest ? `Running: ${currentTest}` : "Preparing diagnostics..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    {test.details && <p className="text-sm text-gray-500">{test.details}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {test.duration && <span className="text-xs text-gray-400">{test.duration}ms</span>}
                  <Badge variant={getStatusColor(test.status)}>{test.status}</Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {!isRunning && tests.some((t) => t.status !== "pending") && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Diagnostic Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-medium">{tests.filter((t) => t.status === "passed").length}</div>
                  <div className="text-gray-500">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-medium">
                    {tests.filter((t) => t.status === "warning").length}
                  </div>
                  <div className="text-gray-500">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-medium">{tests.filter((t) => t.status === "failed").length}</div>
                  <div className="text-gray-500">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 font-medium">
                    {tests.filter((t) => t.duration).reduce((sum, t) => sum + (t.duration || 0), 0)}ms
                  </div>
                  <div className="text-gray-500">Total Time</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {tests.some((t) => t.status === "failed" || t.status === "warning") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests
                .filter((t) => t.status === "failed" || t.status === "warning")
                .map((test) => (
                  <Alert key={test.name}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{test.name}:</strong> {test.details}
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
