export interface StarTSP100Config {
  model: "TSP143III" | "TSP143IIIU" | "TSP143IIIW" | "TSP143IIILAN"
  connectionType: "usb" | "ethernet" | "wifi" | "bluetooth"
  ipAddress?: string
  port?: number
  paperWidth: 72 | 80 // mm
  characterSet: "CP437" | "CP850" | "CP858" | "CP860" | "CP863" | "CP865" | "CP1252"
  density: "light" | "medium" | "dark"
  cutType: "full" | "partial" | "tear"
  cashDrawer: boolean
  buzzer: boolean
  autoReconnect: boolean
}

export interface StarPrintJob {
  id: string
  type: "receipt" | "report" | "test" | "label"
  data: any
  status: "pending" | "printing" | "completed" | "failed" | "cancelled"
  timestamp: Date
  retryCount: number
  priority: "low" | "normal" | "high"
}

export class StarTSP100Service {
  private config: StarTSP100Config
  private printQueue: StarPrintJob[] = []
  private isProcessing = false
  private connection: any = null
  private statusCheckInterval: NodeJS.Timeout | null = null

  // Star Micronics ESC/POS Commands
  private readonly ESC = "\x1B"
  private readonly GS = "\x1D"
  private readonly LF = "\x0A"
  private readonly CR = "\x0D"
  private readonly FF = "\x0C"
  private readonly CAN = "\x18"

  constructor(config: StarTSP100Config) {
    this.config = config
    this.startStatusMonitoring()
  }

  // Initialize printer connection
  async initialize(): Promise<boolean> {
    try {
      console.log(`Initializing Star TSP100 ${this.config.model}...`)

      // Initialize printer with Star-specific commands
      let commands = ""
      commands += this.ESC + "@" // Initialize printer
      commands += this.ESC + "R" + "\x00" // Select international character set
      commands += this.ESC + "t" + this.getCharacterSetCode() // Select character code table
      commands += this.GS + "a" + "\x00" // Enable/disable Automatic Status Back (ASB)

      await this.sendToPrinter(commands)

      // Test printer response
      const status = await this.getStatus()
      if (status.connected) {
        console.log("Star TSP100 initialized successfully")
        return true
      }

      throw new Error("Printer not responding")
    } catch (error) {
      console.error("Star TSP100 initialization failed:", error)
      return false
    }
  }

  // Get character set code for Star printers
  private getCharacterSetCode(): string {
    const charSets: Record<string, string> = {
      CP437: "\x00",
      CP850: "\x02",
      CP858: "\x13",
      CP860: "\x03",
      CP863: "\x04",
      CP865: "\x05",
      CP1252: "\x10",
    }
    return charSets[this.config.characterSet] || "\x00"
  }

  // Print receipt with Star TSP100 optimizations
  async printReceipt(receiptData: any): Promise<boolean> {
    const printJob: StarPrintJob = {
      id: `star-${Date.now()}`,
      type: "receipt",
      data: receiptData,
      status: "pending",
      timestamp: new Date(),
      retryCount: 0,
      priority: "normal",
    }

    this.printQueue.push(printJob)
    return this.processQueue()
  }

  // Generate Star TSP100 optimized commands
  private generateStarReceiptCommands(receiptData: any): string {
    let commands = ""

    // Initialize and set paper width
    commands += this.ESC + "@" // Initialize
    commands += this.GS + "W" + this.getPaperWidthBytes() // Set print area width

    // Store header (centered, emphasized)
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += this.ESC + "E" + "\x01" // Emphasized on
    commands += this.ESC + "!" + "\x30" // Double height/width
    commands += receiptData.storeInfo.name + this.LF
    commands += this.ESC + "!" + "\x00" // Normal size
    commands += this.ESC + "E" + "\x00" // Emphasized off

    // Store contact info
    commands += receiptData.storeInfo.address.replace(/\n/g, this.LF) + this.LF
    commands += receiptData.storeInfo.phone + this.LF
    commands += receiptData.storeInfo.email + this.LF + this.LF

    // Receipt details (left aligned)
    commands += this.ESC + "a" + "\x00" // Left alignment
    commands += "Receipt: " + receiptData.receiptNumber + this.LF
    commands += "Date: " + receiptData.timestamp.toLocaleString() + this.LF
    commands += "Cashier: " + receiptData.employeeName + this.LF + this.LF

    // Customer info
    if (receiptData.customer) {
      commands += "Customer: " + receiptData.customer.name + this.LF
      commands += "Phone: " + receiptData.customer.phone + this.LF
      if (receiptData.customer.loyaltyPoints) {
        commands += "Loyalty Points: " + receiptData.customer.loyaltyPoints + this.LF
      }
      commands += this.LF
    }

    // Items section with Star-optimized formatting
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF
    commands += this.ESC + "E" + "\x01" // Emphasized
    commands += "ITEMS" + this.LF
    commands += this.ESC + "E" + "\x00" // Normal
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF

    receiptData.items.forEach((item: any) => {
      // Item name (may wrap)
      commands += item.name + this.LF

      // SKU and quantity/price line
      commands += "  " + item.sku + this.LF
      commands +=
        this.formatStarItemLine(
          `  ${item.quantity} x $${item.unitPrice.toFixed(2)}`,
          `$${item.totalPrice.toFixed(2)}`,
          this.config.paperWidth === 80 ? 48 : 32,
        ) +
        this.LF +
        this.LF
    })

    // Totals section
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF
    commands +=
      this.formatStarItemLine(
        "Subtotal:",
        `$${receiptData.subtotal.toFixed(2)}`,
        this.config.paperWidth === 80 ? 48 : 32,
      ) + this.LF

    if (receiptData.discount > 0) {
      commands +=
        this.formatStarItemLine(
          "Discount:",
          `-$${receiptData.discount.toFixed(2)}`,
          this.config.paperWidth === 80 ? 48 : 32,
        ) + this.LF
    }

    commands +=
      this.formatStarItemLine("Tax:", `$${receiptData.tax.toFixed(2)}`, this.config.paperWidth === 80 ? 48 : 32) +
      this.LF
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF

    // Total (emphasized)
    commands += this.ESC + "E" + "\x01" // Emphasized on
    commands += this.ESC + "!" + "\x20" // Double width
    commands +=
      this.formatStarItemLine("TOTAL:", `$${receiptData.total.toFixed(2)}`, this.config.paperWidth === 80 ? 24 : 16) +
      this.LF
    commands += this.ESC + "!" + "\x00" // Normal size
    commands += this.ESC + "E" + "\x00" // Emphasized off
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF + this.LF

    // Payment information
    commands += "Payment: " + receiptData.paymentMethod + this.LF
    if (receiptData.cashReceived) {
      commands +=
        this.formatStarItemLine(
          "Cash Received:",
          `$${receiptData.cashReceived.toFixed(2)}`,
          this.config.paperWidth === 80 ? 48 : 32,
        ) + this.LF
      commands +=
        this.formatStarItemLine(
          "Change:",
          `$${receiptData.change?.toFixed(2)}`,
          this.config.paperWidth === 80 ? 48 : 32,
        ) + this.LF
    }
    commands += this.LF

    // GBT Rewards
    if (receiptData.loyaltyPointsEarned > 0) {
      commands += this.ESC + "a" + "\x01" // Center alignment
      commands += "🎉 GBT Earned: " + receiptData.loyaltyPointsEarned + this.LF
      commands += "Use for future discounts!" + this.LF + this.LF
      commands += this.ESC + "a" + "\x00" // Left alignment
    }

    // Footer (centered)
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += "Thank you for choosing RepairHQ!" + this.LF
    commands += receiptData.storeInfo.website + this.LF

    if (receiptData.promotionalMessage) {
      commands += this.LF + receiptData.promotionalMessage + this.LF
    }

    // QR Code (if printer supports it)
    if (receiptData.digitalReceiptUrl) {
      commands += this.LF + "Scan for digital receipt:" + this.LF
      commands += this.generateStarQRCode(receiptData.digitalReceiptUrl)
    }

    // Buzzer (if enabled)
    if (this.config.buzzer) {
      commands += this.ESC + "B" + "\x02" + "\x01" // Buzzer pattern
    }

    // Feed and cut
    commands += this.LF + this.LF + this.LF

    // Star-specific cut command
    switch (this.config.cutType) {
      case "full":
        commands += this.ESC + "d" + "\x00" // Full cut
        break
      case "partial":
        commands += this.ESC + "d" + "\x01" // Partial cut
        break
      case "tear":
        commands += this.LF + this.LF + this.LF // Just feed for manual tear
        break
    }

    return commands
  }

  // Get paper width in bytes for Star printers
  private getPaperWidthBytes(): string {
    // Star TSP100 paper width settings
    if (this.config.paperWidth === 80) {
      return "\x00\x00\x02\x00" // 80mm
    } else {
      return "\x00\x00\x01\xC0" // 72mm
    }
  }

  // Helper functions for Star formatting
  private printStarLine(char: string, length: number): string {
    return char.repeat(length)
  }

  private formatStarItemLine(left: string, right: string, totalWidth: number): string {
    const spaces = totalWidth - left.length - right.length
    return left + " ".repeat(Math.max(1, spaces)) + right
  }

  // Generate QR code for Star printers
  private generateStarQRCode(data: string): string {
    let commands = ""

    // Star QR Code commands (if supported by model)
    commands += this.GS + "Z" + "\x00" // QR Code mode
    commands += this.GS + "Z" + "\x01" + String.fromCharCode(data.length) + data
    commands += this.GS + "Z" + "\x02" // Print QR code

    return commands
  }

  // Process print queue with Star-specific optimizations
  private async processQueue(): Promise<boolean> {
    if (this.isProcessing || this.printQueue.length === 0) {
      return true
    }

    this.isProcessing = true

    // Sort queue by priority
    this.printQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    while (this.printQueue.length > 0) {
      const job = this.printQueue[0]

      try {
        job.status = "printing"

        let commands = ""
        switch (job.type) {
          case "receipt":
            commands = this.generateStarReceiptCommands(job.data)
            break
          case "test":
            commands = this.generateStarTestCommands()
            break
          default:
            throw new Error(`Unknown job type: ${job.type}`)
        }

        await this.sendToPrinter(commands)
        job.status = "completed"
        this.printQueue.shift()

        // Small delay between jobs for Star printers
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error("Star print job failed:", error)
        job.status = "failed"
        job.retryCount++

        if (job.retryCount < 3) {
          job.status = "pending"
          this.printQueue.push(this.printQueue.shift()!)
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait before retry
        } else {
          this.printQueue.shift()
        }
      }
    }

    this.isProcessing = false
    return true
  }

  // Generate test commands for Star TSP100
  private generateStarTestCommands(): string {
    let commands = ""

    commands += this.ESC + "@" // Initialize
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += this.ESC + "E" + "\x01" // Emphasized
    commands += this.ESC + "!" + "\x30" // Double size
    commands += "STAR TSP100 TEST" + this.LF
    commands += this.ESC + "!" + "\x00" // Normal size
    commands += this.ESC + "E" + "\x00" // Normal emphasis
    commands += this.LF

    commands += "Model: " + this.config.model + this.LF
    commands += "Date: " + new Date().toLocaleString() + this.LF
    commands += this.LF

    commands += this.ESC + "a" + "\x00" // Left alignment
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF
    commands += "PRINTER STATUS CHECK" + this.LF
    commands += this.printStarLine("-", this.config.paperWidth === 80 ? 48 : 32) + this.LF

    commands += "✓ Connection: OK" + this.LF
    commands += "✓ Paper: " + this.config.paperWidth + "mm" + this.LF
    commands += "✓ Character Set: " + this.config.characterSet + this.LF
    commands += "✓ Cut Type: " + this.config.cutType + this.LF
    commands += "✓ Cash Drawer: " + (this.config.cashDrawer ? "Enabled" : "Disabled") + this.LF

    // Test different text styles
    commands += this.LF + "TEXT STYLES:" + this.LF
    commands += "Normal text" + this.LF
    commands += this.ESC + "E" + "\x01" + "Emphasized text" + this.ESC + "E" + "\x00" + this.LF
    commands += this.ESC + "!" + "\x10" + "Double height" + this.ESC + "!" + "\x00" + this.LF
    commands += this.ESC + "!" + "\x20" + "Double width" + this.ESC + "!" + "\x00" + this.LF

    commands += this.LF + this.LF
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += "Test completed successfully!" + this.LF
    commands += this.LF + this.LF + this.LF

    // Test cut
    switch (this.config.cutType) {
      case "full":
        commands += this.ESC + "d" + "\x00"
        break
      case "partial":
        commands += this.ESC + "d" + "\x01"
        break
      case "tear":
        commands += this.LF + this.LF + this.LF
        break
    }

    return commands
  }

  // Send commands to Star printer
  private async sendToPrinter(commands: string): Promise<void> {
    switch (this.config.connectionType) {
      case "usb":
        await this.sendViaUSB(commands)
        break
      case "ethernet":
      case "wifi":
        await this.sendViaNetwork(commands)
        break
      case "bluetooth":
        await this.sendViaBluetooth(commands)
        break
    }
  }

  private async sendViaUSB(commands: string): Promise<void> {
    // Star USB communication
    console.log("Sending to Star TSP100 via USB:", commands.length, "bytes")
    await new Promise((resolve) => setTimeout(resolve, 800))
  }

  private async sendViaNetwork(commands: string): Promise<void> {
    if (!this.config.ipAddress) {
      throw new Error("IP address not configured for Star printer")
    }

    const port = this.config.port || 9100
    console.log(`Sending to Star TSP100 at ${this.config.ipAddress}:${port}`)

    // In real implementation, use raw socket connection
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }

  private async sendViaBluetooth(commands: string): Promise<void> {
    console.log("Sending to Star TSP100 via Bluetooth:", commands.length, "bytes")
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Open cash drawer (Star-specific command)
  async openCashDrawer(): Promise<boolean> {
    if (!this.config.cashDrawer) {
      throw new Error("Cash drawer not enabled in configuration")
    }

    try {
      // Star cash drawer command
      const commands = this.ESC + "B" + "\x01" + "\x01" // Open drawer
      await this.sendToPrinter(commands)
      return true
    } catch (error) {
      console.error("Failed to open Star cash drawer:", error)
      return false
    }
  }

  // Get printer status
  async getStatus(): Promise<any> {
    try {
      // Send status request command
      const statusCommand = this.GS + "a" + "\x01"
      await this.sendToPrinter(statusCommand)

      // In real implementation, read response
      return {
        connected: true,
        paperStatus: "ok",
        temperature: "normal",
        cutterStatus: "ok",
        drawerStatus: this.config.cashDrawer ? "closed" : "disabled",
        errors: [],
      }
    } catch (error) {
      return {
        connected: false,
        paperStatus: "unknown",
        temperature: "unknown",
        cutterStatus: "unknown",
        drawerStatus: "unknown",
        errors: [error.message],
      }
    }
  }

  // Start status monitoring
  private startStatusMonitoring(): void {
    this.statusCheckInterval = setInterval(async () => {
      await this.getStatus()
    }, 30000) // Check every 30 seconds
  }

  // Stop status monitoring
  stopStatusMonitoring(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval)
      this.statusCheckInterval = null
    }
  }

  // Print test page
  async printTestPage(): Promise<boolean> {
    const testJob: StarPrintJob = {
      id: `star-test-${Date.now()}`,
      type: "test",
      data: {},
      status: "pending",
      timestamp: new Date(),
      retryCount: 0,
      priority: "high",
    }

    this.printQueue.push(testJob)
    return this.processQueue()
  }

  // Cancel all pending jobs
  cancelAllJobs(): void {
    this.printQueue.forEach((job) => {
      if (job.status === "pending") {
        job.status = "cancelled"
      }
    })
    this.printQueue = this.printQueue.filter((job) => job.status !== "cancelled")
  }

  // Get queue status
  getQueueStatus(): { pending: number; processing: boolean; total: number } {
    return {
      pending: this.printQueue.filter((job) => job.status === "pending").length,
      processing: this.isProcessing,
      total: this.printQueue.length,
    }
  }
}

// Predefined Star TSP100 configurations
export const STAR_TSP100_CONFIGS = {
  TSP143III_USB: {
    model: "TSP143III" as const,
    connectionType: "usb" as const,
    paperWidth: 80,
    characterSet: "CP437" as const,
    density: "medium" as const,
    cutType: "partial" as const,
    cashDrawer: true,
    buzzer: true,
    autoReconnect: true,
  },
  TSP143III_ETHERNET: {
    model: "TSP143IIILAN" as const,
    connectionType: "ethernet" as const,
    ipAddress: "192.168.1.100",
    port: 9100,
    paperWidth: 80,
    characterSet: "CP437" as const,
    density: "medium" as const,
    cutType: "partial" as const,
    cashDrawer: true,
    buzzer: true,
    autoReconnect: true,
  },
  TSP143III_WIFI: {
    model: "TSP143IIIW" as const,
    connectionType: "wifi" as const,
    ipAddress: "192.168.1.101",
    port: 9100,
    paperWidth: 80,
    characterSet: "CP437" as const,
    density: "medium" as const,
    cutType: "partial" as const,
    cashDrawer: false,
    buzzer: true,
    autoReconnect: true,
  },
}
