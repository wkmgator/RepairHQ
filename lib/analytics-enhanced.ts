export interface AnalyticsEvent {
  id: string
  userId: string
  sessionId: string
  eventType: string
  eventData: any
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  location?: {
    country: string
    region: string
    city: string
  }
}

export interface AuditTrail {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  oldValues?: any
  newValues?: any
  timestamp: Date
  ipAddress: string
  success: boolean
  errorMessage?: string
}

export class AnalyticsService {
  static async trackEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    // Store in Supabase
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullEvent),
    })
  }

  static async trackPageView(page: string, userId?: string): Promise<void> {
    await this.trackEvent({
      userId: userId || "anonymous",
      sessionId: this.getSessionId(),
      eventType: "page_view",
      eventData: { page },
    })
  }

  static async trackUserAction(action: string, data: any, userId: string): Promise<void> {
    await this.trackEvent({
      userId,
      sessionId: this.getSessionId(),
      eventType: "user_action",
      eventData: { action, ...data },
    })
  }

  static async createAuditLog(audit: Omit<AuditTrail, "id" | "timestamp">): Promise<void> {
    const fullAudit: AuditTrail = {
      ...audit,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    await fetch("/api/audit/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullAudit),
    })
  }

  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem("analytics_session_id")
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem("analytics_session_id", sessionId)
    }
    return sessionId
  }

  static async getAnalytics(startDate: Date, endDate: Date, filters?: any): Promise<any> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...filters,
    })

    const response = await fetch(`/api/analytics/reports?${params}`)
    return response.json()
  }
}
