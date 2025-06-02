import { supabase, supabaseAdmin } from "./supabase"

export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG"
export type LogCategory =
  | "auth"
  | "payment"
  | "inventory"
  | "pos"
  | "ticket"
  | "system"
  | "api"
  | "backup"
  | "monitoring"

export interface LogEntry {
  level: LogLevel
  category: LogCategory
  message: string
  metadata?: any
  userId?: string
  storeId?: string
  errorStack?: string
}

export class LoggingService {
  private isDevelopment = process.env.NODE_ENV === "development"
  private logQueue: LogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private maxBatchSize = 100
  private flushIntervalMs = 5000 // 5 seconds

  constructor() {
    // Start the flush interval
    this.startFlushInterval()
  }

  async log(entry: LogEntry): Promise<void> {
    // Always log to console in development
    if (this.isDevelopment) {
      this.consoleLog(entry)
    }

    // Add to queue for batch processing
    this.logQueue.push({
      ...entry,
      userId: entry.userId || (await this.getCurrentUserId()),
    })

    // Flush if queue is full
    if (this.logQueue.length >= this.maxBatchSize) {
      await this.flush()
    }
  }

  async error(category: LogCategory, message: string, error?: Error, metadata?: any): Promise<void> {
    await this.log({
      level: "ERROR",
      category,
      message,
      metadata: {
        ...metadata,
        error: error?.message,
      },
      errorStack: error?.stack,
    })
  }

  async warn(category: LogCategory, message: string, metadata?: any): Promise<void> {
    await this.log({
      level: "WARN",
      category,
      message,
      metadata,
    })
  }

  async info(category: LogCategory, message: string, metadata?: any): Promise<void> {
    await this.log({
      level: "INFO",
      category,
      message,
      metadata,
    })
  }

  async debug(category: LogCategory, message: string, metadata?: any): Promise<void> {
    // Only log debug messages in development
    if (this.isDevelopment) {
      await this.log({
        level: "DEBUG",
        category,
        message,
        metadata,
      })
    }
  }

  async logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
    metadata?: any,
  ): Promise<void> {
    const level: LogLevel = statusCode >= 500 ? "ERROR" : statusCode >= 400 ? "WARN" : "INFO"

    await this.log({
      level,
      category: "api",
      message: `${method} ${path} - ${statusCode}`,
      metadata: {
        ...metadata,
        method,
        path,
        statusCode,
        responseTime,
      },
    })
  }

  async logPaymentEvent(event: string, amount: number, currency: string, metadata?: any): Promise<void> {
    await this.log({
      level: "INFO",
      category: "payment",
      message: `Payment event: ${event}`,
      metadata: {
        ...metadata,
        event,
        amount,
        currency,
      },
    })
  }

  async logSecurityEvent(event: string, severity: "low" | "medium" | "high", metadata?: any): Promise<void> {
    const level: LogLevel = severity === "high" ? "ERROR" : severity === "medium" ? "WARN" : "INFO"

    await this.log({
      level,
      category: "auth",
      message: `Security event: ${event}`,
      metadata: {
        ...metadata,
        event,
        severity,
      },
    })
  }

  private async flush(): Promise<void> {
    if (this.logQueue.length === 0) return

    const logsToFlush = [...this.logQueue]
    this.logQueue = []

    try {
      const { error } = await supabaseAdmin.from("application_logs").insert(logsToFlush)

      if (error) {
        console.error("Failed to flush logs:", error)
        // Re-add logs to queue if flush failed
        this.logQueue.unshift(...logsToFlush)
      }
    } catch (error) {
      console.error("Failed to flush logs:", error)
      // Re-add logs to queue if flush failed
      this.logQueue.unshift(...logsToFlush)
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, this.flushIntervalMs)
  }

  private stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }

  private consoleLog(entry: LogEntry): void {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${entry.level}] [${entry.category}]`

    switch (entry.level) {
      case "ERROR":
        console.error(prefix, entry.message, entry.metadata)
        if (entry.errorStack) {
          console.error(entry.errorStack)
        }
        break
      case "WARN":
        console.warn(prefix, entry.message, entry.metadata)
        break
      case "INFO":
        console.info(prefix, entry.message, entry.metadata)
        break
      case "DEBUG":
        console.debug(prefix, entry.message, entry.metadata)
        break
    }
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user?.id
    } catch {
      return undefined
    }
  }

  // Cleanup method to be called on app shutdown
  async cleanup(): Promise<void> {
    this.stopFlushInterval()
    await this.flush()
  }
}

export const logger = new LoggingService()

// Ensure logs are flushed on app shutdown
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    logger.cleanup()
  })
} else if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    await logger.cleanup()
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    await logger.cleanup()
    process.exit(0)
  })
}
