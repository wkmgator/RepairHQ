import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { usageTrackingService } from "./usage-tracking-service"

export async function usageTrackingMiddleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.user) {
    const userId = session.user.id
    const path = req.nextUrl.pathname

    // Only track API routes
    if (path.startsWith("/api/")) {
      // Track API usage
      await usageTrackingService.trackEvent(userId, "api_calls", {
        path,
        method: req.method,
      })

      // Check if user is over API limit
      const usageReport = await usageTrackingService.getUserUsageReport(userId)

      if (usageReport.limits.maxApiCalls !== null && usageReport.metrics.apiCalls > usageReport.limits.maxApiCalls) {
        // User is over API limit, return 429 Too Many Requests
        return new NextResponse(
          JSON.stringify({
            error: "API rate limit exceeded",
            message: "You have exceeded your plan's API rate limit. Please upgrade your plan.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }
    }
  }

  return res
}
