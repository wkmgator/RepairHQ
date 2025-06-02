import { NextResponse } from "next/server"
import { infrastructureManager } from "@/lib/scaling/infrastructure-manager"

export async function GET() {
  try {
    const metrics = await infrastructureManager.getSystemMetrics()

    // Track this API request
    await infrastructureManager.trackApiRequest("/api/monitoring/metrics", Date.now())

    return NextResponse.json({
      ...metrics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === "auto-scale") {
      const metrics = await infrastructureManager.getSystemMetrics()
      await infrastructureManager.autoScale(metrics)

      return NextResponse.json({ success: true, message: "Auto-scaling triggered" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in monitoring API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
