"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Wifi,
  NetworkIcon as Ethernet,
  RefreshCw,
  AlertCircle,
  Settings,
  Network,
  Signal,
  Globe,
  Router,
  Monitor,
  TestTube,
  Save,
  Eye,
  EyeOff,
} from "lucide-react"
import { starNetworkDiscovery, type NetworkPrinter, type NetworkScanResult } from "@/lib/star-network-discovery"

export default function StarNetworkSetupComponent() {
  const [scanResults, setScanResults] = useState<NetworkScanResult | null>(null)
  const [selectedPrinter, setSelectedPrinter] = useState<NetworkPrinter | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  // Network configuration state
  const [networkConfig, setNetworkConfig] = useState({
    ipRange: "192.168.1.0/24",
    timeout: 5000,
  })

  // Printer configuration state
  const [printerConfig, setPrinterConfig] = useState({
    dhcp: true,
    ipAddress: "",
    subnetMask: "255.255.255.0",
    gateway: "",
    wifiSSID: "",
    wifiPassword: "",
    connectionType: "ethernet" as "ethernet" | "wifi",
  })

  useEffect(() => {
    // Subscribe to scan results
    const handleScanComplete = (result: NetworkScanResult) => {
      setScanResults(result)
      setIsScanning(false)
      setScanProgress(100)
    }

    starNetworkDiscovery.onScanComplete(handleScanComplete)

    return () => {
      starNetworkDiscovery.offScanComplete(handleScanComplete)
    }
  }, [])

  const startNetworkScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanResults(null)
    setSelectedPrinter(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 10
      })
    }, 200)

    try {
      await starNetworkDiscovery.scanNetwork(networkConfig.ipRange, networkConfig.timeout)
    } catch (error) {
      console.error("Network scan failed:", error)
      setIsScanning(false)
      setScanProgress(0)
      clearInterval(progressInterval)
      alert("Network scan failed. Please check your network settings.")
    }
  }

  const testPrinterConnection = async (printer: NetworkPrinter) => {
    setIsTesting(true)
    try {
      const success = await starNetworkDiscovery.testConnection(printer)
      if (success) {
        alert(`Connection test successful for ${printer.name}`)
      } else {
        alert(`Connection test failed for ${printer.name}`)
      }
    } catch (error) {
      alert(`Connection test error: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  const configurePrinter = async () => {
    if (!selectedPrinter) return

    setIsConfiguring(true)
    try {
      const success = await starNetworkDiscovery.configurePrinter(selectedPrinter, printerConfig)
      if (success) {
        alert(`${selectedPrinter.name} configured successfully!`)
        // Refresh printer status
        await starNetworkDiscovery.getPrinterStatus(selectedPrinter)
      } else {
        alert(`Failed to configure ${selectedPrinter.name}`)
      }
    } catch (error) {
      alert(`Configuration error: ${error.message}`)
    } finally {
      setIsConfiguring(false)
    }
  }

  const refreshPrinterStatus = async (printer: NetworkPrinter) => {
    try {
      const updatedPrinter = await starNetworkDiscovery.getPrinterStatus(printer)

      // Update scan results
      if (scanResults) {
        const updatedPrinters = scanResults.printers.map((p) => (p.id === printer.id ? updatedPrinter : p))
        setScanResults({
          ...scanResults,
          printers: updatedPrinters,
        })
      }

      // Update selected printer
      if (selectedPrinter?.id === printer.id) {
        setSelectedPrinter(updatedPrinter)
      }
    } catch (error) {
      console.error("Failed to refresh printer status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "busy":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getSignalIcon = (strength?: number) => {
    if (!strength) return null

    if (strength >= 80) return <Signal className="h-4 w-4 text-green-600" />
    if (strength >= 60) return <Signal className="h-4 w-4 text-yellow-600" />
    if (strength >= 40) return <Signal className="h-4 w-4 text-orange-600" />
    return <Signal className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Star TSP100 Network Setup</h1>

          <div className="flex items-center space-x-4">
            <Button onClick={startNetworkScan} disabled={isScanning} className="flex items-center">
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scan Network
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Scan Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  Network Scan Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ipRange">IP Range (CIDR)</Label>
                    <Input
                      id="ipRange"
                      value={networkConfig.ipRange}
                      onChange={(e) => setNetworkConfig((prev) => ({ ...prev, ipRange: e.target.value }))}
                      placeholder="192.168.1.0/24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={networkConfig.timeout}
                      onChange={(e) => setNetworkConfig((prev) => ({ ...prev, timeout: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Scanning network...</span>
                      <span>{Math.round(scanProgress)}%</span>
                    </div>
                    <Progress value={scanProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scan Results */}
            {scanResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Monitor className="h-5 w-5 mr-2" />
                      Discovered Printers ({scanResults.printers.length})
                    </span>
                    <Badge variant="outline">Scan took {(scanResults.scanDuration / 1000).toFixed(1)}s</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {scanResults.printers.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No Star printers found on the network. Make sure your printers are powered on and connected.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {scanResults.printers.map((printer) => (
                        <div
                          key={printer.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPrinter?.id === printer.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedPrinter(printer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {printer.connectionType === "wifi" ? (
                                <Wifi className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Ethernet className="h-5 w-5 text-green-600" />
                              )}
                              <div>
                                <h3 className="font-medium">{printer.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {printer.ipAddress}:{printer.port} • {printer.macAddress}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {printer.connectionType === "wifi" && getSignalIcon(printer.signalStrength)}
                              <Badge variant={getStatusColor(printer.status)}>{printer.status}</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  refreshPrinterStatus(printer)
                                }}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {printer.connectionType === "wifi" && printer.networkName && (
                            <div className="mt-2 text-sm text-gray-600">
                              Network: {printer.networkName} • Signal: {printer.signalStrength}%
                            </div>
                          )}

                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Model: {printer.model}</span>
                            <span>Paper: {printer.paperStatus}</span>
                            <span>Last seen: {printer.lastSeen.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            {selectedPrinter ? (
              <>
                {/* Printer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Printer Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">{selectedPrinter.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Model:</span>
                        <span className="text-sm">{selectedPrinter.model}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">IP Address:</span>
                        <span className="text-sm">{selectedPrinter.ipAddress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Connection:</span>
                        <div className="flex items-center space-x-1">
                          {selectedPrinter.connectionType === "wifi" ? (
                            <Wifi className="h-3 w-3" />
                          ) : (
                            <Ethernet className="h-3 w-3" />
                          )}
                          <span className="text-sm capitalize">{selectedPrinter.connectionType}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => testPrinterConnection(selectedPrinter)}
                      disabled={isTesting}
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="h-4 w-4 mr-2" />
                          Test Connection
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Network Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Network Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={printerConfig.connectionType}
                      onValueChange={(value) =>
                        setPrinterConfig((prev) => ({ ...prev, connectionType: value as "ethernet" | "wifi" }))
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ethernet">
                          <Ethernet className="h-4 w-4 mr-2" />
                          Ethernet
                        </TabsTrigger>
                        <TabsTrigger value="wifi">
                          <Wifi className="h-4 w-4 mr-2" />
                          WiFi
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="ethernet" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dhcp">Use DHCP</Label>
                          <Switch
                            id="dhcp"
                            checked={printerConfig.dhcp}
                            onCheckedChange={(checked) => setPrinterConfig((prev) => ({ ...prev, dhcp: checked }))}
                          />
                        </div>

                        {!printerConfig.dhcp && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="staticIP">IP Address</Label>
                              <Input
                                id="staticIP"
                                value={printerConfig.ipAddress}
                                onChange={(e) => setPrinterConfig((prev) => ({ ...prev, ipAddress: e.target.value }))}
                                placeholder="192.168.1.100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="subnet">Subnet Mask</Label>
                              <Input
                                id="subnet"
                                value={printerConfig.subnetMask}
                                onChange={(e) => setPrinterConfig((prev) => ({ ...prev, subnetMask: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="gateway">Gateway</Label>
                              <Input
                                id="gateway"
                                value={printerConfig.gateway}
                                onChange={(e) => setPrinterConfig((prev) => ({ ...prev, gateway: e.target.value }))}
                                placeholder="192.168.1.1"
                              />
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="wifi" className="space-y-4">
                        <div>
                          <Label htmlFor="ssid">WiFi Network (SSID)</Label>
                          <Input
                            id="ssid"
                            value={printerConfig.wifiSSID}
                            onChange={(e) => setPrinterConfig((prev) => ({ ...prev, wifiSSID: e.target.value }))}
                            placeholder="RepairHQ-WiFi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">WiFi Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={printerConfig.wifiPassword}
                              onChange={(e) => setPrinterConfig((prev) => ({ ...prev, wifiPassword: e.target.value }))}
                              placeholder="Enter WiFi password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="wifiDhcp">Use DHCP</Label>
                          <Switch
                            id="wifiDhcp"
                            checked={printerConfig.dhcp}
                            onCheckedChange={(checked) => setPrinterConfig((prev) => ({ ...prev, dhcp: checked }))}
                          />
                        </div>

                        {!printerConfig.dhcp && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="wifiStaticIP">IP Address</Label>
                              <Input
                                id="wifiStaticIP"
                                value={printerConfig.ipAddress}
                                onChange={(e) => setPrinterConfig((prev) => ({ ...prev, ipAddress: e.target.value }))}
                                placeholder="192.168.1.101"
                              />
                            </div>
                            <div>
                              <Label htmlFor="wifiGateway">Gateway</Label>
                              <Input
                                id="wifiGateway"
                                value={printerConfig.gateway}
                                onChange={(e) => setPrinterConfig((prev) => ({ ...prev, gateway: e.target.value }))}
                                placeholder="192.168.1.1"
                              />
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>

                    <Button className="w-full mt-4" onClick={configurePrinter} disabled={isConfiguring}>
                      {isConfiguring ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Configuring...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Apply Configuration
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Printer Selected</h3>
                  <p className="text-gray-500">
                    Scan the network and select a printer to configure its network settings.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Router className="h-5 w-5 mr-2" />
              Network Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Ethernet Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Connect printer to network with Ethernet cable</li>
                  <li>• Power on the printer and wait for network initialization</li>
                  <li>• Use DHCP for automatic IP assignment (recommended)</li>
                  <li>• For static IP, ensure it's in your network range</li>
                  <li>• Test connection after configuration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">WiFi Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure printer supports WiFi (TSP143IIIW model)</li>
                  <li>• Enter correct WiFi network name (SSID)</li>
                  <li>• Use WPA2/WPA3 security for best compatibility</li>
                  <li>• Place printer within good signal range</li>
                  <li>• Monitor signal strength after setup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
