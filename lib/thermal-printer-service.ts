export interface ThermalPrinterConfig {
  model: string
  connectionType: "usb" | "ethernet" | "bluetooth"
  ipAddress?: string
  port?: number
  paperWidth: number // in mm
  characterSet: string
  density: "light" | "medium" | "dark"
  cutType: "full" | "partial"
}

export interface PrintJob {
  id: string
  type: "receipt" | "report" | "test"
  data: any
  status: "pending" | "printing" | "completed" | "failed"
  timestamp: Date
  retryCount: number
}

export class ThermalPrinterService {
  private config: ThermalPrinterConfig
  private printQueue: PrintJob[] = []
  private isProcessing = false

  constructor(config: ThermalPrinterConfig) {
    this.config = config
  }

  // ESC/POS Command Constants
  private readonly ESC = "\x1B"
  private readonly GS = "\x1D"
  private readonly LF = "\x0A"
  private readonly CR = "\x0D"

  // Initialize printer
  async initialize(): Promise<boolean> {
    try {
      const commands = this.ESC + "@" // Initialize printer
      await this.sendToPrinter(commands)
      return true
    } catch (error) {
      console.error("Printer initialization failed:", error)
      return false
    }
  }

  // Print receipt
  async printReceipt(receiptData: any): Promise<boolean> {
    const printJob: PrintJob = {
      id: `job-${Date.now()}`,
      type: "receipt",
      data: receiptData,
      status: "pending",
      timestamp: new Date(),
      retryCount: 0,
    }

    this.printQueue.push(printJob)
    return this.processQueue()
  }

  // Generate ESC/POS commands for receipt
  private generateReceiptCommands(receiptData: any): string {
    let commands = ""

    // Initialize and set character set
    commands += this.ESC + "@" // Initialize
    commands += this.ESC + "t" + "\x00" // Character set

    // Store header (centered, double size)
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += this.ESC + "!" + "\x30" // Double height/width
    commands += receiptData.storeInfo.name + this.LF
    commands += this.ESC + "!" + "\x00" // Normal size

    // Store address and contact
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
      commands += "Loyalty Points: " + receiptData.customer.loyaltyPoints + this.LF + this.LF
    }

    // Items section
    commands += this.printLine("-", 32) + this.LF
    commands += "ITEMS" + this.LF
    commands += this.printLine("-", 32) + this.LF

    receiptData.items.forEach((item: any) => {
      commands += item.name + this.LF
      commands += "  " + item.sku + this.LF
      commands +=
        this.formatItemLine(
          `  ${item.quantity} x $${item.unitPrice.toFixed(2)}`,
          `$${item.totalPrice.toFixed(2)}`,
          32,
        ) +
        this.LF +
        this.LF
    })

    // Totals section
    commands += this.printLine("-", 32) + this.LF
    commands += this.formatItemLine("Subtotal:", `$${receiptData.subtotal.toFixed(2)}`, 32) + this.LF

    if (receiptData.discount > 0) {
      commands += this.formatItemLine("Discount:", `-$${receiptData.discount.toFixed(2)}`, 32) + this.LF
    }

    commands += this.formatItemLine("Tax:", `$${receiptData.tax.toFixed(2)}`, 32) + this.LF
    commands += this.printLine("-", 32) + this.LF

    // Total (emphasized)
    commands += this.ESC + "!" + "\x20" // Double width
    commands += this.formatItemLine("TOTAL:", `$${receiptData.total.toFixed(2)}`, 16) + this.LF
    commands += this.ESC + "!" + "\x00" // Normal size
    commands += this.printLine("-", 32) + this.LF + this.LF

    // Payment information
    commands += "Payment Method: " + receiptData.paymentMethod + this.LF
    if (receiptData.cashReceived) {
      commands += this.formatItemLine("Cash Received:", `$${receiptData.cashReceived.toFixed(2)}`, 32) + this.LF
      commands += this.formatItemLine("Change:", `$${receiptData.change?.toFixed(2)}`, 32) + this.LF
    }
    commands += this.LF

    // Loyalty points
    if (receiptData.loyaltyPointsEarned > 0) {
      commands += "Points Earned: " + receiptData.loyaltyPointsEarned + this.LF + this.LF
    }

    // Footer (centered)
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += "Thank you for your business!" + this.LF
    commands += receiptData.storeInfo.website + this.LF

    if (receiptData.promotionalMessage) {
      commands += this.LF + receiptData.promotionalMessage + this.LF
    }

    // QR Code for digital receipt (if supported)
    if (receiptData.digitalReceiptUrl) {
      commands += this.LF + "Scan for digital receipt:" + this.LF
      commands += this.generateQRCode(receiptData.digitalReceiptUrl)
    }

    // Feed and cut
    commands += this.LF + this.LF + this.LF
    commands += this.GS + "V" + "B" + "\x00" // Full cut

    return commands
  }

  // Helper function to print a line of characters
  private printLine(char: string, length: number): string {
    return char.repeat(length)
  }

  // Helper function to format item lines with proper spacing
  private formatItemLine(left: string, right: string, totalWidth: number): string {
    const spaces = totalWidth - left.length - right.length
    return left + " ".repeat(Math.max(1, spaces)) + right
  }

  // Generate QR code commands (if printer supports it)
  private generateQRCode(data: string): string {
    // QR Code commands for ESC/POS printers that support it
    let commands = ""
    commands += this.GS + "(k" // QR Code command
    // Add QR code data encoding here
    return commands
  }

  // Process print queue
  private async processQueue(): Promise<boolean> {
    if (this.isProcessing || this.printQueue.length === 0) {
      return true
    }

    this.isProcessing = true

    while (this.printQueue.length > 0) {
      const job = this.printQueue[0]

      try {
        job.status = "printing"

        let commands = ""
        switch (job.type) {
          case "receipt":
            commands = this.generateReceiptCommands(job.data)
            break
          case "test":
            commands = this.generateTestReceiptCommands()
            break
          default:
            throw new Error(`Unknown job type: ${job.type}`)
        }

        await this.sendToPrinter(commands)
        job.status = "completed"
        this.printQueue.shift()
      } catch (error) {
        console.error("Print job failed:", error)
        job.status = "failed"
        job.retryCount++

        if (job.retryCount < 3) {
          job.status = "pending"
          // Move to end of queue for retry
          this.printQueue.push(this.printQueue.shift()!)
        } else {
          // Remove failed job after 3 retries
          this.printQueue.shift()
        }
      }
    }

    this.isProcessing = false
    return true
  }

  // Generate test receipt commands
  private generateTestReceiptCommands(): string {
    let commands = ""

    commands += this.ESC + "@" // Initialize
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += this.ESC + "!" + "\x30" // Double size
    commands += "REPAIRHQ TEST" + this.LF
    commands += this.ESC + "!" + "\x00" // Normal size
    commands += this.LF

    commands += "Printer Test Receipt" + this.LF
    commands += "Date: " + new Date().toLocaleString() + this.LF
    commands += this.LF

    commands += this.ESC + "a" + "\x00" // Left alignment
    commands += this.printLine("-", 32) + this.LF
    commands += "PRINTER STATUS CHECK" + this.LF
    commands += this.printLine("-", 32) + this.LF

    commands += "✓ Connection: OK" + this.LF
    commands += "✓ Paper: OK" + this.LF
    commands += "✓ Print Quality: OK" + this.LF
    commands += "✓ Cut Function: OK" + this.LF

    commands += this.LF + this.LF
    commands += this.ESC + "a" + "\x01" // Center alignment
    commands += "Test completed successfully!" + this.LF
    commands += this.LF + this.LF + this.LF

    commands += this.GS + "V" + "B" + "\x00" // Full cut

    return commands
  }

  // Send commands to printer
  private async sendToPrinter(commands: string): Promise<void> {
    // In a real implementation, this would send to the actual printer
    // via USB, network, or Bluetooth connection

    switch (this.config.connectionType) {
      case "usb":
        await this.sendViaUSB(commands)
        break
      case "ethernet":
        await this.sendViaNetwork(commands)
        break
      case "bluetooth":
        await this.sendViaBluetooth(commands)
        break
    }
  }

  private async sendViaUSB(commands: string): Promise<void> {
    // USB printer communication
    console.log("Sending via USB:", commands.length, "bytes")
    // Simulate printing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private async sendViaNetwork(commands: string): Promise<void> {
    // Network printer communication
    if (!this.config.ipAddress) {
      throw new Error("IP address not configured")
    }

    console.log(`Sending to ${this.config.ipAddress}:${this.config.port || 9100}`)
    // Simulate network printing
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  private async sendViaBluetooth(commands: string): Promise<void> {
    // Bluetooth printer communication
    console.log("Sending via Bluetooth:", commands.length, "bytes")
    // Simulate Bluetooth printing
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  // Open cash drawer
  async openCashDrawer(): Promise<boolean> {
    try {
      const commands = this.ESC + "p" + "\x00" + "\x19" + "\xFA" // Open drawer command
      await this.sendToPrinter(commands)
      return true
    } catch (error) {
      console.error("Failed to open cash drawer:", error)
      return false
    }
  }

  // Get printer status
  async getStatus(): Promise<any> {
    // In real implementation, query printer status
    return {
      connected: true,
      paperStatus: "ok",
      temperature: "normal",
      errors: [],
    }
  }

  // Print test page
  async printTestPage(): Promise<boolean> {
    const testJob: PrintJob = {
      id: `test-${Date.now()}`,
      type: "test",
      data: {},
      status: "pending",
      timestamp: new Date(),
      retryCount: 0,
    }

    this.printQueue.push(testJob)
    return this.processQueue()
  }
}

// Default printer configurations
export const PRINTER_CONFIGS = {
  EPSON_TM_T88VI: {
    model: "Epson TM-T88VI",
    connectionType: "usb" as const,
    paperWidth: 80,
    characterSet: "CP437",
    density: "medium" as const,
    cutType: "full" as const,
  },
  STAR_TSP143III: {
    model: "Star TSP143III",
    connectionType: "ethernet" as const,
    paperWidth: 80,
    characterSet: "CP437",
    density: "medium" as const,
    cutType: "partial" as const,
  },
}
