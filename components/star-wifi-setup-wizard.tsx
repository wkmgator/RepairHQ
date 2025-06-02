"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wifi,
  Signal,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Router,
  Settings,
  Monitor,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import { wifiScanner, type WiFiNetwork } from "@/lib/wifi-scanner"
// Import the new progress component
import WiFiSetupProgress from "./wifi-setup-progress"

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
}

interface WiFiCredentials {
  ssid: string
  password: string
  security: string
  hidden: boolean
}

interface NetworkSettings {
  dhcp: boolean
  ipAddress: string
  subnetMask: string
  gateway: string
  dns1: string
  dns2: string
}

export default function StarWiFiSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [availableNetworks, setAvailableNetworks] = useState<WiFiNetwork[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null)

  const [wifiCredentials, setWifiCredentials] = useState<WiFiCredentials>({
    ssid: "",
    password: "",
    security: "wpa2",
    hidden: false,
  })

  const [networkSettings, setNetworkSettings] = useState<NetworkSettings>({
    dhcp: true,
    ipAddress: "",
    subnetMask: "255.255.255.0",
    gateway: "",
    dns1: "8.8.8.8",
    dns2: "8.8.4.4",
  })

  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean
    signalStrength: number
    ipAddress: string
    error?: string
  }>({
    connected: false,
    signalStrength: 0,
    ipAddress: "",
  })

  const steps: SetupStep[] = [
    {
      id: "scan",
      title: "Scan Networks",
      description: "Discover available WiFi networks",
      completed: availableNetworks.length > 0,
      current: currentStep === 0,
    },
    {
      id: "select",
      title: "Select Network",
      description: "Choose your WiFi network",
      completed: selectedNetwork !== null || wifiCredentials.ssid !== "",
      current: currentStep === 1,
    },
    {
      id: "credentials",
      title: "Enter Credentials",
      description: "Provide WiFi password and security settings",
      completed: wifiCredentials.password !== "" || selectedNetwork?.security === "open",
      current: currentStep === 2,
    },
    {
      id: "network",
      title: "Network Settings",
      description: "Configure IP and DNS settings",
      completed: networkSettings.dhcp || networkSettings.ipAddress !== "",
      current: currentStep === 3,
    },
    {
      id: "connect",
      title: "Connect",
      description: "Apply settings and connect to WiFi",
      completed: connectionStatus.connected,
      current: currentStep === 4,
    },
  ]

  const scanWiFiNetworks = async () => {
    setIsScanning(true)
    try {
      const result = await wifiScanner.scanNetworks()
      setAvailableNetworks(result.networks)

      if (result.networks.length > 0 && currentStep === 0) {
        setCurrentStep(1)
      }
    } catch (error) {
      console.error("WiFi scan failed:", error)
      alert("Failed to scan WiFi networks. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const selectNetwork = (network: WiFiNetwork) => {
    setSelectedNetwork(network)
    setWifiCredentials((prev) => ({
      ...prev,
      ssid: network.ssid || "Hidden Network",
      security: network.security,
      hidden: network.ssid === "",
    }))

    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const connectToWiFi = async () => {
    setIsConnecting(true)
    setConnectionProgress(0)

    try {
      // Simulate connection process with progress updates
      const steps = [
        { message: "Preparing printer for WiFi setup...", progress: 10 },
        { message: "Sending network credentials...", progress: 25 },
        { message: "Configuring security settings...", progress: 40 },
        { message: "Setting up IP configuration...", progress: 60 },
        { message: "Establishing WiFi connection...", progress: 80 },
        { message: "Verifying connection...", progress: 95 },
        { message: "Connection successful!", progress: 100 },
      ]

      for (const step of steps) {
        console.log(step.message)
        setConnectionProgress(step.progress)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Simulate successful connection
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        setConnectionStatus({
          connected: true,
          signalStrength: selectedNetwork?.signal || Math.floor(Math.random() * 40) + 60,
          ipAddress: networkSettings.dhcp
            ? `192.168.1.${Math.floor(Math.random() * 200) + 50}`
            : networkSettings.ipAddress,
        })

        if (currentStep === 4) {
          // Setup complete
          alert("WiFi connection established successfully!")
        }
      } else {
        throw new Error("Failed to connect to WiFi network. Please check your credentials and try again.")
      }
    } catch (error) {
      console.error("WiFi connection failed:", error)
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        error: error.message,
      }))
    } finally {
      setIsConnecting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case "open":
        return <Unlock className="h-4 w-4 text-red-500" />
      case "wep":
        return <Lock className="h-4 w-4 text-orange-500" />
      case "wpa":
        return <Lock className="h-4 w-4 text-yellow-500" />
      case "wpa2":
        return <Shield className="h-4 w-4 text-green-500" />
      case "wpa3":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const getSignalIcon = (strength: number) => {
    const className =
      strength >= 80
        ? "text-green-600"
        : strength >= 60
          ? "text-yellow-600"
          : strength >= 40
            ? "text-orange-600"
            : "text-red-600"

    return <Signal className={`h-4 w-4 ${className}`} />
  }

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25)
    return (
      <div className="flex items-end space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 ${bar <= bars ? "bg-current" : "bg-gray-300"}`}
            style={{ height: `${bar * 3 + 2}px` }}
          />
        ))}
      </div>
    )
  }

  // Add a welcome state and auto-progress through initial steps
  const [setupStarted, setSetupStarted] = useState(true)
  const [welcomeShown, setWelcomeShown] = useState(false)

  useEffect(() => {
    // Auto-scan on component mount and show welcome message
    const startSetup = async () => {
      console.log("Starting Star TSP100 WiFi Setup Process...")
      await scanWiFiNetworks()
    }

    startSetup()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Star TSP100 WiFi Setup</h1>
          <p className="text-gray-600">Configure your Star TSP100 printer for WiFi connectivity</p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed
                        ? "bg-green-600 text-white"
                        : step.current
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${step.completed ? "bg-green-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Progress Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Main Step Content */}
            <Card>
              <CardContent className="p-6">
                {/* Step Content */}
                {/* Welcome Screen */}
                {!welcomeShown && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Wifi className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-2">Welcome to Star TSP100 WiFi Setup</h2>
                      <p className="text-gray-600 mb-6">
                        Let's get your Star TSP100 printer connected to WiFi. This process will take about 5 minutes.
                      </p>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-blue-900 mb-2">Before we begin, please ensure:</h3>
                        <ul className="text-sm text-blue-800 space-y-1 text-left">
                          <li>✓ Your Star TSP100 printer is powered on</li>
                          <li>✓ You have your WiFi network name and password ready</li>
                          <li>✓ The printer is within range of your WiFi router</li>
                          <li>✓ Your router is broadcasting its network name (SSID)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          setWelcomeShown(true)
                          scanWiFiNetworks()
                        }}
                        size="lg"
                        className="flex items-center"
                      >
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Start WiFi Setup
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 0: Scan Networks */}
                {currentStep === 0 && welcomeShown && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Wifi className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-xl font-semibold mb-2">Scan for WiFi Networks</h2>
                      <p className="text-gray-600 mb-6">
                        We'll scan for available WiFi networks in your area. Make sure your router is powered on and
                        broadcasting.
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={scanWiFiNetworks} disabled={isScanning} size="lg" className="flex items-center">
                        {isScanning ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Wifi className="h-5 w-5 mr-2" />
                            Scan WiFi Networks
                          </>
                        )}
                      </Button>
                    </div>

                    {availableNetworks.length > 0 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Found {availableNetworks.length} WiFi networks. Click "Next" to select your network.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Step 1: Select Network */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Router className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-xl font-semibold mb-2">Select WiFi Network</h2>
                      <p className="text-gray-600 mb-6">
                        Choose your WiFi network from the list below. If you don't see your network, try scanning again.
                      </p>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableNetworks.map((network, index) => (
                        <div
                          key={`${network.bssid}-${index}`}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedNetwork?.bssid === network.bssid
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => selectNetwork(network)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Wifi className="h-5 w-5 text-blue-600" />
                              <div>
                                <h3 className="font-medium">
                                  {network.ssid || "Hidden Network"}
                                  {network.hidden && (
                                    <Badge variant="secondary" className="ml-2">
                                      Hidden
                                    </Badge>
                                  )}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>Channel {network.channel}</span>
                                  <span>•</span>
                                  <span>{wifiScanner.getFrequencyBand(network.frequency)}</span>
                                  <span>•</span>
                                  <span className="capitalize">{network.security}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {getSignalIcon(network.signal)}
                              <div className={getSignalIcon(network.signal).props.className}>
                                {getSignalBars(network.signal)}
                              </div>
                              <span className="text-sm text-gray-500">{network.signal}%</span>
                              {getSecurityIcon(network.security)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hidden-network"
                          checked={wifiCredentials.hidden}
                          onCheckedChange={(checked) => {
                            setWifiCredentials((prev) => ({ ...prev, hidden: checked }))
                            if (checked) {
                              setSelectedNetwork(null)
                            }
                          }}
                        />
                        <Label htmlFor="hidden-network">Connect to hidden network</Label>
                      </div>

                      {wifiCredentials.hidden && (
                        <div className="mt-3">
                          <Label htmlFor="hidden-ssid">Network Name (SSID)</Label>
                          <Input
                            id="hidden-ssid"
                            value={wifiCredentials.ssid}
                            onChange={(e) => setWifiCredentials((prev) => ({ ...prev, ssid: e.target.value }))}
                            placeholder="Enter network name"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={scanWiFiNetworks} variant="outline" disabled={isScanning}>
                        {isScanning ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rescan Networks
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Enter Credentials */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Lock className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-xl font-semibold mb-2">WiFi Credentials</h2>
                      <p className="text-gray-600 mb-6">
                        Enter the password for your WiFi network. Make sure you have the correct credentials.
                      </p>
                    </div>

                    {selectedNetwork && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Wifi className="h-5 w-5 text-blue-600" />
                              <div>
                                <h3 className="font-medium">{selectedNetwork.ssid || "Hidden Network"}</h3>
                                <p className="text-sm text-gray-600">
                                  {selectedNetwork.security.toUpperCase()} Security • Signal: {selectedNetwork.signal}%
                                </p>
                              </div>
                            </div>
                            {getSecurityIcon(selectedNetwork.security)}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="network-name">Network Name (SSID)</Label>
                        <Input
                          id="network-name"
                          value={wifiCredentials.ssid}
                          onChange={(e) => setWifiCredentials((prev) => ({ ...prev, ssid: e.target.value }))}
                          placeholder="Enter network name"
                          disabled={!wifiCredentials.hidden && selectedNetwork !== null}
                        />
                      </div>

                      {(selectedNetwork?.security !== "open" || wifiCredentials.hidden) && (
                        <div>
                          <Label htmlFor="wifi-password">WiFi Password</Label>
                          <div className="relative">
                            <Input
                              id="wifi-password"
                              type={showPassword ? "text" : "password"}
                              value={wifiCredentials.password}
                              onChange={(e) => setWifiCredentials((prev) => ({ ...prev, password: e.target.value }))}
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
                      )}

                      <div>
                        <Label htmlFor="security-type">Security Type</Label>
                        <select
                          id="security-type"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={wifiCredentials.security}
                          onChange={(e) => setWifiCredentials((prev) => ({ ...prev, security: e.target.value }))}
                          disabled={selectedNetwork !== null && !wifiCredentials.hidden}
                        >
                          <option value="open">Open (No Password)</option>
                          <option value="wep">WEP</option>
                          <option value="wpa">WPA</option>
                          <option value="wpa2">WPA2</option>
                          <option value="wpa3">WPA3</option>
                        </select>
                      </div>
                    </div>

                    {selectedNetwork?.security === "open" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This is an open network with no password protection. Your data may not be secure.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Step 3: Network Settings */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Settings className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-xl font-semibold mb-2">Network Configuration</h2>
                      <p className="text-gray-600 mb-6">Configure IP address and DNS settings for your printer.</p>
                    </div>

                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="dhcp">Automatic IP (DHCP)</Label>
                            <p className="text-sm text-gray-500">Let the router assign an IP address automatically</p>
                          </div>
                          <Switch
                            id="dhcp"
                            checked={networkSettings.dhcp}
                            onCheckedChange={(checked) => setNetworkSettings((prev) => ({ ...prev, dhcp: checked }))}
                          />
                        </div>

                        {!networkSettings.dhcp && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="static-ip">IP Address</Label>
                              <Input
                                id="static-ip"
                                value={networkSettings.ipAddress}
                                onChange={(e) => setNetworkSettings((prev) => ({ ...prev, ipAddress: e.target.value }))}
                                placeholder="192.168.1.100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="subnet">Subnet Mask</Label>
                              <Input
                                id="subnet"
                                value={networkSettings.subnetMask}
                                onChange={(e) =>
                                  setNetworkSettings((prev) => ({ ...prev, subnetMask: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="gateway">Gateway</Label>
                              <Input
                                id="gateway"
                                value={networkSettings.gateway}
                                onChange={(e) => setNetworkSettings((prev) => ({ ...prev, gateway: e.target.value }))}
                                placeholder="192.168.1.1"
                              />
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        <div>
                          <Label htmlFor="dns1">Primary DNS Server</Label>
                          <Input
                            id="dns1"
                            value={networkSettings.dns1}
                            onChange={(e) => setNetworkSettings((prev) => ({ ...prev, dns1: e.target.value }))}
                            placeholder="8.8.8.8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dns2">Secondary DNS Server</Label>
                          <Input
                            id="dns2"
                            value={networkSettings.dns2}
                            onChange={(e) => setNetworkSettings((prev) => ({ ...prev, dns2: e.target.value }))}
                            placeholder="8.8.4.4"
                          />
                        </div>

                        <Alert>
                          <Globe className="h-4 w-4" />
                          <AlertDescription>
                            DNS servers help resolve domain names. Google DNS (8.8.8.8) and Cloudflare DNS (1.1.1.1) are
                            reliable options.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Step 4: Connect */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Zap className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-xl font-semibold mb-2">Connect to WiFi</h2>
                      <p className="text-gray-600 mb-6">
                        Ready to connect your Star TSP100 printer to WiFi. This may take a few moments.
                      </p>
                    </div>

                    {/* Configuration Summary */}
                    <Card className="bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Configuration Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Network:</span>
                          <span className="font-medium">{wifiCredentials.ssid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security:</span>
                          <span className="font-medium capitalize">{wifiCredentials.security}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IP Configuration:</span>
                          <span className="font-medium">{networkSettings.dhcp ? "DHCP (Automatic)" : "Static"}</span>
                        </div>
                        {!networkSettings.dhcp && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">IP Address:</span>
                            <span className="font-medium">{networkSettings.ipAddress}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Connection Progress */}
                    {isConnecting && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Connecting to WiFi...</span>
                          <span>{Math.round(connectionProgress)}%</span>
                        </div>
                        <Progress value={connectionProgress} className="w-full" />
                      </div>
                    )}

                    {/* Connection Status */}
                    {connectionStatus.connected && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div>WiFi connection established successfully!</div>
                            <div className="text-sm">
                              <strong>IP Address:</strong> {connectionStatus.ipAddress}
                              <br />
                              <strong>Signal Strength:</strong> {connectionStatus.signalStrength}%
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {connectionStatus.error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{connectionStatus.error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Connect Button */}
                    {!connectionStatus.connected && (
                      <div className="flex justify-center">
                        <Button onClick={connectToWiFi} disabled={isConnecting} size="lg" className="flex items-center">
                          {isConnecting ? (
                            <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Wifi className="h-5 w-5 mr-2" />
                              Connect to WiFi
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={nextStep}
                    disabled={
                      currentStep === steps.length - 1 ||
                      (currentStep === 0 && availableNetworks.length === 0) ||
                      (currentStep === 1 && !selectedNetwork && !wifiCredentials.hidden) ||
                      (currentStep === 2 && wifiCredentials.ssid === "") ||
                      (currentStep === 2 && wifiCredentials.security !== "open" && wifiCredentials.password === "") ||
                      (currentStep === 3 && !networkSettings.dhcp && networkSettings.ipAddress === "")
                    }
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Progress Sidebar */}
            <WiFiSetupProgress
              currentStep={currentStep}
              isScanning={isScanning}
              isConnecting={isConnecting}
              connectionProgress={connectionProgress}
              error={connectionStatus.error}
            />
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              WiFi Setup Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Before You Start</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure your Star TSP100 supports WiFi (TSP143IIIW model)</li>
                  <li>• Have your WiFi network name and password ready</li>
                  <li>• Place the printer within good signal range</li>
                  <li>• Make sure your router is broadcasting the SSID</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Troubleshooting</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• If connection fails, check your WiFi password</li>
                  <li>• Try moving closer to the router</li>
                  <li>• Restart the printer and try again</li>
                  <li>• Check if MAC filtering is enabled on your router</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
