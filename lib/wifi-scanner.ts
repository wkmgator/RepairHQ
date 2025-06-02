export interface WiFiNetwork {
  ssid: string
  bssid: string
  signal: number
  frequency: number
  security: "open" | "wep" | "wpa" | "wpa2" | "wpa3"
  channel: number
  hidden: boolean
}

export interface WiFiScanResult {
  networks: WiFiNetwork[]
  scanDuration: number
  timestamp: Date
}

export class WiFiScanner {
  private scanInProgress = false

  async scanNetworks(): Promise<WiFiScanResult> {
    if (this.scanInProgress) {
      throw new Error("WiFi scan already in progress")
    }

    this.scanInProgress = true
    const startTime = Date.now()

    try {
      console.log("Scanning for WiFi networks...")

      // Simulate WiFi scan delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock WiFi networks for demo
      const networks: WiFiNetwork[] = [
        {
          ssid: "RepairHQ-WiFi",
          bssid: "00:11:22:33:44:55",
          signal: 85,
          frequency: 2437,
          security: "wpa2",
          channel: 6,
          hidden: false,
        },
        {
          ssid: "RepairHQ-Guest",
          bssid: "00:11:22:33:44:56",
          signal: 82,
          frequency: 2437,
          security: "wpa2",
          channel: 6,
          hidden: false,
        },
        {
          ssid: "Office-5G",
          bssid: "AA:BB:CC:DD:EE:FF",
          signal: 65,
          frequency: 5180,
          security: "wpa3",
          channel: 36,
          hidden: false,
        },
        {
          ssid: "Neighbor-WiFi",
          bssid: "11:22:33:44:55:66",
          signal: 45,
          frequency: 2462,
          security: "wpa2",
          channel: 11,
          hidden: false,
        },
        {
          ssid: "",
          bssid: "FF:EE:DD:CC:BB:AA",
          signal: 30,
          frequency: 2412,
          security: "wpa2",
          channel: 1,
          hidden: true,
        },
      ]

      return {
        networks: networks.sort((a, b) => b.signal - a.signal),
        scanDuration: Date.now() - startTime,
        timestamp: new Date(),
      }
    } finally {
      this.scanInProgress = false
    }
  }

  isScanInProgress(): boolean {
    return this.scanInProgress
  }

  getSecurityIcon(security: string): string {
    switch (security) {
      case "open":
        return "🔓"
      case "wep":
        return "🔒"
      case "wpa":
        return "🔒"
      case "wpa2":
        return "🔐"
      case "wpa3":
        return "🛡️"
      default:
        return "❓"
    }
  }

  getSignalStrength(signal: number): "excellent" | "good" | "fair" | "poor" {
    if (signal >= 80) return "excellent"
    if (signal >= 60) return "good"
    if (signal >= 40) return "fair"
    return "poor"
  }

  getFrequencyBand(frequency: number): "2.4GHz" | "5GHz" | "6GHz" {
    if (frequency < 3000) return "2.4GHz"
    if (frequency < 6000) return "5GHz"
    return "6GHz"
  }
}

export const wifiScanner = new WiFiScanner()
