import { supabase, supabaseAdmin } from "./supabase"

export interface HealthCheck {
  service: string
  status: "healthy" | "degraded" | "down"
  responseTime: number
  details?: any
}

export interface SystemMetrics {
  cpu: number
  memory: number
  diskSpace: number
  activeConnections: number
  requestsPerMinute: number
}

export class MonitoringService {
  private alertThresholds = {
    responseTime: 3000, // 3 seconds
    errorRate: 0.05, // 5%
    diskSpace: 0.9, // 90% full
    memory: 0.85, // 85% used
  }

  async performHealthCheck(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = []

    // Check database connectivity
    const dbCheck = await this.checkDatabase()
    checks.push(dbCheck)

    // Check storage service
    const storageCheck = await this.checkStorage()
    checks.push(storageCheck)

    // Check authentication service
    const authCheck = await this.checkAuth()
    checks.push(authCheck)

    // Check critical tables
    const tableChecks = await this.checkCriticalTables()
    checks.push(...tableChecks)

    return checks
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now()

    try {
      const { data, error } = await supabase.from("user_profiles").select("count").limit(1).single()

      const responseTime = Date.now() - startTime

      if (error) {
        return {
          service: "database",
          status: "down",
          responseTime,
          details: { error: error.message },
        }
      }

      return {
        service: "database",
        status: responseTime > this.alertThresholds.responseTime ? "degraded" : "healthy",
        responseTime,
      }
    } catch (error) {
      return {
        service: "database",
        status: "down",
        responseTime: Date.now() - startTime,
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      }
    }
  }

  private async checkStorage(): Promise<HealthCheck> {
    const startTime = Date.now()

    try {
      const { data, error } = await supabase.storage.from("backups").list("", { limit: 1 })

      const responseTime = Date.now() - startTime

      if (error) {
        return {
          service: "storage",
          status: "down",
          responseTime,
          details: { error: error.message },
        }
      }

      return {
        service: "storage",
        status: responseTime > this.alertThresholds.responseTime ? "degraded" : "healthy",
        responseTime,
      }
    } catch (error) {
      return {
        service: "storage",
        status: "down",
        responseTime: Date.now() - startTime,
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      }
    }
  }

  private async checkAuth(): Promise<HealthCheck> {
    const startTime = Date.now()

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      const responseTime = Date.now() - startTime

      return {
        service: "authentication",
        status: responseTime > this.alertThresholds.responseTime ? "degraded" : "healthy",
        responseTime,
      }
    } catch (error) {
      return {
        service: "authentication",
        status: "down",
        responseTime: Date.now() - startTime,
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      }
    }
  }

  private async checkCriticalTables(): Promise<HealthCheck[]> {
    const criticalTables = ["customers", "inventory", "tickets", "pos_transactions"]
    const checks: HealthCheck[] = []

    for (const table of criticalTables) {
      const startTime = Date.now()

      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        const responseTime = Date.now() - startTime

        if (error) {
          checks.push({
            service: `table:${table}`,
            status: "down",
            responseTime,
            details: { error: error.message },
          })
        } else {
          checks.push({
            service: `table:${table}`,
            status: responseTime > this.alertThresholds.responseTime ? "degraded" : "healthy",
            responseTime,
            details: { rowCount: count },
          })
        }
      } catch (error) {
        checks.push({
          service: `table:${table}`,
          status: "down",
          responseTime: Date.now() - startTime,
          details: { error: error instanceof Error ? error.message : "Unknown error" },
        })
      }
    }

    return checks
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    // In a real implementation, these would come from actual system monitoring
    // For Supabase, you might use their metrics API or external monitoring tools

    const { data: connections } = await supabaseAdmin.from("active_connections").select("count")

    const { data: requests } = await supabaseAdmin
      .from("performance_metrics")
      .select("metric_value")
      .eq("metric_name", "requests_per_minute")
      .gte("created_at", new Date(Date.now() - 60000).toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return {
      cpu: Math.random() * 0.7, // Mock data - replace with real metrics
      memory: Math.random() * 0.8, // Mock data - replace with real metrics
      diskSpace: Math.random() * 0.6, // Mock data - replace with real metrics
      activeConnections: connections?.length || 0,
      requestsPerMinute: requests?.metric_value || 0,
    }
  }

  async logPerformanceMetric(metricName: string, value: number, unit: string, metadata?: any): Promise<void> {
    await supabaseAdmin.from("performance_metrics").insert({
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
      metadata,
    })
  }

  async getErrorRate(timeWindowMinutes = 60): Promise<number> {
    const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60000).toISOString()

    const { data: totalLogs } = await supabaseAdmin
      .from("application_logs")
      .select("count")
      .gte("created_at", cutoffTime)

    const { data: errorLogs } = await supabaseAdmin
      .from("application_logs")
      .select("count")
      .eq("level", "ERROR")
      .gte("created_at", cutoffTime)

    const total = totalLogs?.[0]?.count || 0
    const errors = errorLogs?.[0]?.count || 0

    return total > 0 ? errors / total : 0
  }

  async checkAlerts(): Promise<void> {
    const metrics = await this.getSystemMetrics()
    const errorRate = await this.getErrorRate()

    // Check memory usage
    if (metrics.memory > this.alertThresholds.memory) {
      await this.sendAlert("HIGH_MEMORY_USAGE", {
        current: metrics.memory,
        threshold: this.alertThresholds.memory,
      })
    }

    // Check disk space
    if (metrics.diskSpace > this.alertThresholds.diskSpace) {
      await this.sendAlert("LOW_DISK_SPACE", {
        current: metrics.diskSpace,
        threshold: this.alertThresholds.diskSpace,
      })
    }

    // Check error rate
    if (errorRate > this.alertThresholds.errorRate) {
      await this.sendAlert("HIGH_ERROR_RATE", {
        current: errorRate,
        threshold: this.alertThresholds.errorRate,
      })
    }
  }

  private async sendAlert(alertType: string, details: any): Promise<void> {
    // In production, this would send alerts via email, SMS, Slack, etc.
    await supabaseAdmin.from("application_logs").insert({
      level: "ERROR",
      category: "monitoring",
      message: `Alert: ${alertType}`,
      metadata: details,
    })

    // You could integrate with services like:
    // - SendGrid for email alerts
    // - Twilio for SMS alerts
    // - Slack webhooks for team notifications
    // - PagerDuty for on-call alerts
  }
}

export const monitoringService = new MonitoringService()
