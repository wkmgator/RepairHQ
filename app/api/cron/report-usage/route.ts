import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { usageTrackingService } from "@/lib/usage-tracking-service"

// This route should be protected by a cron secret
// and scheduled to run daily or hourly depending on your needs
export async function GET(request: Request) {
  // Verify the request is from a trusted source
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createClient()

    // Get all users with active Stripe subscriptions
    const { data: users, error } = await supabase.from("users").select("id").not("stripe_subscription_id", "is", null)

    if (error) {
      throw error
    }

    // Report usage for each user
    const results = await Promise.allSettled(users.map((user) => usageTrackingService.reportUsageToStripe(user.id)))

    // Count successes and failures
    const successes = results.filter((r) => r.status === "fulfilled").length
    const failures = results.filter((r) => r.status === "rejected").length

    return NextResponse.json({
      success: true,
      processed: users.length,
      successes,
      failures,
    })
  } catch (error) {
    console.error("Error in usage reporting cron job:", error)
    return NextResponse.json({ error: "Failed to process usage reporting" }, { status: 500 })
  }
}
