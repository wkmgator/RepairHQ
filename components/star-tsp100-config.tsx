"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Printer,
  Settings,
  Wifi,
  Usb,
  NetworkIcon as Ethernet,
  Bluetooth,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TestTube,
  DollarSign,
  Volume2,
} from "lucide-react"
import { StarTSP100Service, STAR_TSP100_CONFIGS } from "@/lib/star-tsp100-service"

export default function StarTSP100ConfigComponent() {
  const [config, setConfig] = useState(STAR_TSP100_CONFIGS.TSP143III_USB)
  const [printerService, setPrinterService] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [status, setStatus] = useState(null)
  const [queueStatus, setQueueStatus] = useState({ pending: 0, processing: false, total: 0 })

  useEffect(() => {
    if (printerService) {
      const interval = setInterval(() => {
        setQueueStatus(printerService.getQueueStatus())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [printerService])

  const connectPrinter = async () => {
    setIsConnecting(true)
    try {
      const service = new StarTSP100Service(config)
      const connected = await service.initialize()

      if (connected) {
        setPrinterService(service)
        setIsConnected(true)
        const printerStatus = await service.getStatus()
        setStatus(printerStatus)
      } else {
        throw new Error("Failed to connect to printer")
      }
    } catch (error) {
      console.error("Connection failed:", error)
      alert("Failed to connect to Star TSP100 printer")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectPrinter = () => {
    if (printerService) {
      printerService.stopStatusMonitoring()
      setPrinterService(null)
    }
    setIsConnected(false)
    setStatus(null)
  }

  const testPrint = async () => {
    if (!printerService) return

    setIsTesting(true)
    try {
      await printerService.printTestPage()
      alert("Test page sent to printer!")
    } catch (error) {
      console.error("Test print failed:", error)
      alert("Test print failed")
    } finally {
      setIsTesting(false)
    }
  }

  const openCashDrawer = async () => {
    if (!printerService) return

    try {
      await printerService.openCashDrawer()
      alert("Cash drawer opened!")
    } catch (error) {
      console.error("Failed to open cash drawer:", error)
      alert("Failed to open cash drawer")
    }
  }

  const loadPresetConfig = (preset) => {
    setConfig(STAR_TSP100_CONFIGS[preset])
    if (isConnected) {
      disconnectPrinter()
    }
  }

  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    if (isConnected) {
      disconnectPrinter()
    }
  }

  const getConnectionIcon = () => {
    switch (config.connectionType) {
      case "usb":
        return <Usb className="h-4 w-4" />
      case "ethernet":
        return <Ethernet className="h-4 w-4" />
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "bluetooth":
        return <Bluetooth className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Star TSP100 Printer Settings</h1>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Disconnected</span>
                </div>
              )}
            </div>

            {isConnected ? (
              <Button variant="outline" onClick={disconnectPrinter}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={connectPrinter} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Connect Printer
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Printer Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="connection" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="connection">Connection</TabsTrigger>
                    <TabsTrigger value="paper">Paper</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="presets">Presets</TabsTrigger>
                  </TabsList>

                  <TabsContent value="connection" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="model">Printer Model</Label>
                        <Select value={config.model} onValueChange={(value) => updateConfig("model", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TSP143III">TSP143III (USB)</SelectItem>
                            <SelectItem value="TSP143IIIU">TSP143IIIU (USB)</SelectItem>
                            <SelectItem value="TSP143IIIW">TSP143IIIW (WiFi)</SelectItem>
                            <SelectItem value="TSP143IIILAN">TSP143IIILAN (Ethernet)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="connection">Connection Type</Label>
                        <Select
                          value={config.connectionType}
                          onValueChange={(value) => updateConfig("connectionType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usb">USB</SelectItem>
                            <SelectItem value="ethernet">Ethernet</SelectItem>
                            <SelectItem value="wifi">WiFi</SelectItem>
                            <SelectItem value="bluetooth">Bluetooth</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(config.connectionType === "ethernet" || config.connectionType === "wifi") && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ip">IP Address</Label>
                          <Input
                            id="ip"
                            value={config.ipAddress || ""}
                            onChange={(e) => updateConfig("ipAddress", e.target.value)}
                            placeholder="192.168.1.100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="port">Port</Label>
                          <Input
                            id="port"
                            type="number"
                            value={config.port || 9100}
                            onChange={(e) => updateConfig("port", Number.parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="paper" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paperWidth">Paper Width</Label>
                        <Select
                          value={config.paperWidth.toString()}
                          onValueChange={(value) => updateConfig("paperWidth", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="72">72mm</SelectItem>
                            <SelectItem value="80">80mm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="charset">Character Set</Label>
                        <Select
                          value={config.characterSet}
                          onValueChange={(value) => updateConfig("characterSet", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CP437">CP437 (US)</SelectItem>
                            <SelectItem value="CP850">CP850 (Multilingual)</SelectItem>
                            <SelectItem value="CP858">CP858 (Euro)</SelectItem>
                            <SelectItem value="CP1252">CP1252 (Windows)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="density">Print Density</Label>
                        <Select value={config.density} onValueChange={(value) => updateConfig("density", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cutType">Cut Type</Label>
                        <Select value={config.cutType} onValueChange={(value) => updateConfig("cutType", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Cut</SelectItem>
                            <SelectItem value="partial">Partial Cut</SelectItem>
                            <SelectItem value="tear">Manual Tear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="cashDrawer">Cash Drawer</Label>
                          <p className="text-sm text-gray-500">Enable cash drawer control</p>
                        </div>
                        <Switch
                          id="cashDrawer"
                          checked={config.cashDrawer}
                          onCheckedChange={(checked) => updateConfig("cashDrawer", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="buzzer">Buzzer</Label>
                          <p className="text-sm text-gray-500">Enable buzzer notifications</p>
                        </div>
                        <Switch
                          id="buzzer"
                          checked={config.buzzer}
                          onCheckedChange={(checked) => updateConfig("buzzer", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoReconnect">Auto Reconnect</Label>
                          <p className="text-sm text-gray-500">Automatically reconnect on disconnect</p>
                        </div>
                        <Switch
                          id="autoReconnect"
                          checked={config.autoReconnect}
                          onCheckedChange={(checked) => updateConfig("autoReconnect", checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="presets" className="space-y-4">
                    <div className="grid gap-4">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => loadPresetConfig("TSP143III_USB")}
                      >
                        <Usb className="h-4 w-4 mr-2" />
                        TSP143III USB (Standard)
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => loadPresetConfig("TSP143III_ETHERNET")}
                      >
                        <Ethernet className="h-4 w-4 mr-2" />
                        TSP143III Ethernet
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => loadPresetConfig("TSP143III_WIFI")}
                      >
                        <Wifi className="h-4 w-4 mr-2" />
                        TSP143III WiFi
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Status & Controls */}
          <div className="space-y-6">
            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getConnectionIcon()}
                  <span className="ml-2">Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection:</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                {status && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Paper:</span>
                      <Badge variant={status.paperStatus === "ok" ? "default" : "destructive"}>
                        {status.paperStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Temperature:</span>
                      <Badge variant={status.temperature === "normal" ? "default" : "secondary"}>
                        {status.temperature}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cutter:</span>
                      <Badge variant={status.cutterStatus === "ok" ? "default" : "destructive"}>
                        {status.cutterStatus}
                      </Badge>
                    </div>

                    {config.cashDrawer && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Drawer:</span>
                        <Badge variant="outline">{status.drawerStatus}</Badge>
                      </div>
                    )}
                  </>
                )}

                {queueStatus.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Queue:</span>
                      <Badge variant="outline">{queueStatus.pending} pending</Badge>
                    </div>
                    {queueStatus.processing && (
                      <div className="flex items-center text-blue-600">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        <span className="text-xs">Processing...</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={testPrint} disabled={!isConnected || isTesting}>
                  {isTesting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Print Test Page
                    </>
                  )}
                </Button>

                {config.cashDrawer && (
                  <Button variant="outline" className="w-full" onClick={openCashDrawer} disabled={!isConnected}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Open Cash Drawer
                  </Button>
                )}

                {config.buzzer && (
                  <Button variant="outline" className="w-full" disabled={!isConnected}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test Buzzer
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Config</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <span className="font-medium">{config.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connection:</span>
                  <span className="font-medium">{config.connectionType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paper:</span>
                  <span className="font-medium">{config.paperWidth}mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Cut Type:</span>
                  <span className="font-medium">{config.cutType}</span>
                </div>
                {(config.connectionType === "ethernet" || config.connectionType === "wifi") && (
                  <div className="flex justify-between">
                    <span>IP:</span>
                    <span className="font-medium">
                      {config.ipAddress}:{config.port}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        {!isConnected && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Configure your Star TSP100 printer settings and click "Connect Printer" to establish connection. Make sure
              the printer is powered on and connected to your system.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
