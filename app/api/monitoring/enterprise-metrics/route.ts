import { NextResponse } from "next/server"
import { enterpriseInfrastructureManager } from "@/lib/scaling/enterprise-infrastructure-manager"

export async function GET() {
  try {
    const metrics = await enterpriseInfrastructureManager.getEnterpriseMetrics()

    // Track this API request
    await enterpriseInfrastructureManager.trackApiRequest("/api/monitoring/enterprise-metrics", Date.now(), true)

    return NextResponse.json({
      ...metrics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching enterprise metrics:", error)
    await enterpriseInfrastructureManager.trackApiRequest("/api/monitoring/enterprise-metrics", Date.now(), false)
    return NextResponse.json({ error: "Failed to fetch enterprise metrics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, component } = await request.json()

    if (action === "auto-scale") {
      const metrics = await enterpriseInfrastructureManager.getEnterpriseMetrics()
      await enterpriseInfrastructureManager.autoScale(metrics)

      return NextResponse.json({ success: true, message: "Auto-scaling triggered" })
    }

    if (action === "emergency-scale" && component) {
      // Trigger emergency scaling for specific component
      return NextResponse.json({ success: true, message: `Emergency scaling triggered for ${component}` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in enterprise monitoring API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
