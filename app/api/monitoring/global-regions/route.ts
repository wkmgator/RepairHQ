import { NextResponse } from "next/server"
import { globalCDNManager } from "@/lib/scaling/global-cdn-manager"

export async function GET() {
  try {
    // Monitor edge location health
    await globalCDNManager.monitorEdgeHealth()

    // Get global statistics
    const stats = globalCDNManager.getGlobalStats()

    return NextResponse.json(stats.regions)
  } catch (error) {
    console.error("Error fetching global regions:", error)
    return NextResponse.json({ error: "Failed to fetch global regions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, paths } = await request.json()

    if (action === "purge-cache" && paths) {
      await globalCDNManager.purgeGlobalCache(paths)
      return NextResponse.json({ success: true, message: "Cache purged globally" })
    }

    if (action === "pre-warm-cache") {
      await globalCDNManager.preWarmGlobalCache()
      return NextResponse.json({ success: true, message: "Cache pre-warmed globally" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in global regions API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
