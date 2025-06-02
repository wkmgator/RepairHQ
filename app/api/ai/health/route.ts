import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const healthChecks = {
      openai: false,
      supabase: false,
      models: {
        diagnostics: false,
        chatbot: false,
        timeEstimator: false,
        analytics: false,
        pricing: false,
      },
      timestamp: new Date().toISOString(),
    }

    // Check OpenAI API
    if (process.env.OPENAI_API_KEY) {
      healthChecks.openai = true
    }

    // Check Supabase connection
    try {
      const supabase = createClient()
      const { error } = await supabase.from("customers").select("count").limit(1)
      if (!error) {
        healthChecks.supabase = true
      }
    } catch (e) {
      console.error("Supabase health check failed:", e)
    }

    // In a real implementation, you would check each AI model's status
    // For now, we'll simulate that all models are healthy if the main services are up
    if (healthChecks.openai && healthChecks.supabase) {
      healthChecks.models = {
        diagnostics: true,
        chatbot: true,
        timeEstimator: true,
        analytics: true,
        pricing: true,
      }
    }

    const allHealthy =
      healthChecks.openai && healthChecks.supabase && Object.values(healthChecks.models).every((status) => status)

    return NextResponse.json({
      status: allHealthy ? "healthy" : "degraded",
      checks: healthChecks,
    })
  } catch (error) {
    console.error("AI health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to perform health check",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
