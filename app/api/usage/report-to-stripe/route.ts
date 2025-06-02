import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { usageTrackingService } from "@/lib/usage-tracking-service"

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await usageTrackingService.reportUsageToStripe(session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reporting usage to Stripe:", error)
    return NextResponse.json({ error: "Failed to report usage to Stripe" }, { status: 500 })
  }
}
