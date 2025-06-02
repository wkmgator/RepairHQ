export interface NetworkPrinter {
  id: string
  name: string
  model: string
  ipAddress: string
  macAddress: string
  port: number
  connectionType: "ethernet" | "wifi"
  status: "online" | "offline" | "busy" | "error"
  firmwareVersion?: string
  serialNumber?: string
  paperStatus?: "ok" | "low" | "empty" | "jam"
  lastSeen: Date
  signalStrength?: number // For WiFi
  networkName?: string // For WiFi
}

export interface NetworkScanResult {
  printers: NetworkPrinter[]
  scanDuration: number
  timestamp: Date
}

export class StarNetworkDiscovery {
  private scanInProgress = false
  private knownPrinters: Map<string, NetworkPrinter> = new Map()
  private scanCallbacks: ((result: NetworkScanResult) => void)[] = []

  // Common Star printer ports
  private readonly STAR_PORTS = [9100, 9101, 9102, 9103, 9104, 9105]

  // Star printer model detection patterns
  private readonly STAR_MODELS = {
    TSP143III: /TSP143III/i,
    TSP143IIIU: /TSP143IIIU/i,
    TSP143IIIW: /TSP143IIIW/i,
    TSP143IIILAN: /TSP143IIILAN/i,
    TSP654II: /TSP654II/i,
    TSP700II: /TSP700II/i,
    TSP800II: /TSP800II/i,
  }

  // Scan network for Star printers
  async scanNetwork(ipRange = "192.168.1.0/24", timeout = 5000): Promise<NetworkScanResult> {
    if (this.scanInProgress) {
      throw new Error("Network scan already in progress")
    }

    this.scanInProgress = true
    const startTime = Date.now()
    const foundPrinters: NetworkPrinter[] = []

    try {
      console.log(`Scanning network ${ipRange} for Star printers...`)

      const ipAddresses = this.generateIPRange(ipRange)
      const scanPromises: Promise<NetworkPrinter | null>[] = []

      // Scan each IP address
      for (const ip of ipAddresses) {
        scanPromises.push(this.scanSingleIP(ip, timeout))
      }

      // Wait for all scans to complete
      const results = await Promise.allSettled(scanPromises)

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          foundPrinters.push(result.value)
          this.knownPrinters.set(result.value.id, result.value)
        }
      }

      const scanResult: NetworkScanResult = {
        printers: foundPrinters,
        scanDuration: Date.now() - startTime,
        timestamp: new Date(),
      }

      // Notify callbacks
      this.scanCallbacks.forEach((callback) => callback(scanResult))

      console.log(`Network scan completed: ${foundPrinters.length} printers found`)
      return scanResult
    } finally {
      this.scanInProgress = false
    }
  }

  // Scan a single IP address for Star printer
  private async scanSingleIP(ipAddress: string, timeout: number): Promise<NetworkPrinter | null> {
    for (const port of this.STAR_PORTS) {
      try {
        const printer = await this.probePrinter(ipAddress, port, timeout)
        if (printer) {
          return printer
        }
      } catch (error) {
        // Continue to next port
      }
    }
    return null
  }

  // Probe specific IP:port for Star printer
  private async probePrinter(ipAddress: string, port: number, timeout: number): Promise<NetworkPrinter | null> {
    try {
      // In a real implementation, this would use raw socket connection
      // For demo purposes, we'll simulate the probe
      console.log(`Probing ${ipAddress}:${port}...`)

      // Simulate network probe delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50))

      // Simulate finding a printer (in real implementation, send status request)
      if (Math.random() > 0.95) {
        // 5% chance to find a printer for demo
        const printerInfo = await this.getPrinterInfo(ipAddress, port)

        if (printerInfo && this.isStarPrinter(printerInfo.model)) {
          const connectionType = this.detectConnectionType(ipAddress)

          return {
            id: `star-${ipAddress.replace(/\./g, "-")}-${port}`,
            name: `${printerInfo.model} (${ipAddress})`,
            model: printerInfo.model,
            ipAddress,
            macAddress: printerInfo.macAddress,
            port,
            connectionType,
            status: "online",
            firmwareVersion: printerInfo.firmwareVersion,
            serialNumber: printerInfo.serialNumber,
            paperStatus: "ok",
            lastSeen: new Date(),
            signalStrength: connectionType === "wifi" ? Math.floor(Math.random() * 40) + 60 : undefined,
            networkName: connectionType === "wifi" ? "RepairHQ-WiFi" : undefined,
          }
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  // Get printer information via network
  private async getPrinterInfo(ipAddress: string, port: number): Promise<any> {
    // In real implementation, send ESC/POS status commands
    // For demo, return simulated data
    return {
      model: "TSP143IIILAN",
      macAddress: this.generateMacAddress(),
      firmwareVersion: "1.2.3",
      serialNumber: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    }
  }

  // Check if model is a Star printer
  private isStarPrinter(model: string): boolean {
    return Object.values(this.STAR_MODELS).some((pattern) => pattern.test(model))
  }

  // Detect connection type based on IP
  private detectConnectionType(ipAddress: string): "ethernet" | "wifi" {
    // Simple heuristic - in real implementation, query network interface
    const octets = ipAddress.split(".").map(Number)

    // Common WiFi ranges
    if (
      (octets[0] === 192 && octets[1] === 168) ||
      octets[0] === 10 ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    ) {
      return Math.random() > 0.5 ? "wifi" : "ethernet"
    }

    return "ethernet"
  }

  // Generate IP range from CIDR notation
  private generateIPRange(cidr: string): string[] {
    const [baseIP, prefixLength] = cidr.split("/")
    const prefix = Number.parseInt(prefixLength)
    const baseOctets = baseIP.split(".").map(Number)

    if (prefix !== 24) {
      throw new Error("Only /24 networks supported for now")
    }

    const ips: string[] = []
    for (let i = 1; i < 255; i++) {
      ips.push(`${baseOctets[0]}.${baseOctets[1]}.${baseOctets[2]}.${i}`)
    }

    return ips
  }

  // Generate random MAC address for demo
  private generateMacAddress(): string {
    const chars = "0123456789ABCDEF"
    let mac = ""
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 2 === 0) mac += ":"
      mac += chars[Math.floor(Math.random() * chars.length)]
    }
    return mac
  }

  // Get printer status via network
  async getPrinterStatus(printer: NetworkPrinter): Promise<NetworkPrinter> {
    try {
      console.log(`Getting status for ${printer.name}...`)

      // In real implementation, send status request to printer
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Simulate status response
      const updatedPrinter: NetworkPrinter = {
        ...printer,
        status: Math.random() > 0.1 ? "online" : "offline",
        paperStatus: Math.random() > 0.2 ? "ok" : Math.random() > 0.5 ? "low" : "empty",
        lastSeen: new Date(),
        signalStrength: printer.connectionType === "wifi" ? Math.floor(Math.random() * 40) + 60 : undefined,
      }

      this.knownPrinters.set(printer.id, updatedPrinter)
      return updatedPrinter
    } catch (error) {
      console.error(`Failed to get status for ${printer.name}:`, error)
      return {
        ...printer,
        status: "error",
        lastSeen: new Date(),
      }
    }
  }

  // Test connection to printer
  async testConnection(printer: NetworkPrinter): Promise<boolean> {
    try {
      console.log(`Testing connection to ${printer.name}...`)

      // In real implementation, send test command
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate connection test
      return Math.random() > 0.1 // 90% success rate
    } catch (error) {
      console.error(`Connection test failed for ${printer.name}:`, error)
      return false
    }
  }

  // Configure printer network settings
  async configurePrinter(
    printer: NetworkPrinter,
    config: {
      ipAddress?: string
      subnetMask?: string
      gateway?: string
      dhcp?: boolean
      wifiSSID?: string
      wifiPassword?: string
    },
  ): Promise<boolean> {
    try {
      console.log(`Configuring ${printer.name}...`, config)

      // In real implementation, send configuration commands
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate configuration success
      return Math.random() > 0.2 // 80% success rate
    } catch (error) {
      console.error(`Configuration failed for ${printer.name}:`, error)
      return false
    }
  }

  // Subscribe to scan results
  onScanComplete(callback: (result: NetworkScanResult) => void): void {
    this.scanCallbacks.push(callback)
  }

  // Unsubscribe from scan results
  offScanComplete(callback: (result: NetworkScanResult) => void): void {
    const index = this.scanCallbacks.indexOf(callback)
    if (index > -1) {
      this.scanCallbacks.splice(index, 1)
    }
  }

  // Get known printers
  getKnownPrinters(): NetworkPrinter[] {
    return Array.from(this.knownPrinters.values())
  }

  // Clear known printers
  clearKnownPrinters(): void {
    this.knownPrinters.clear()
  }

  // Check if scan is in progress
  isScanInProgress(): boolean {
    return this.scanInProgress
  }
}

// Singleton instance
export const starNetworkDiscovery = new StarNetworkDiscovery()
