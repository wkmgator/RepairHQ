import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { usageTrackingService } from "@/lib/usage-tracking-service"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const usageReport = await usageTrackingService.getUserUsageReport(session.user.id)
    return NextResponse.json(usageReport)
  } catch (error) {
    console.error("Error getting usage metrics:", error)
    return NextResponse.json({ error: "Failed to get usage metrics" }, { status: 500 })
  }
}
