import { type NextRequest, NextResponse } from "next/server"
import { getWebhookConfigs } from "@/lib/webhook-setup"

export async function GET(request: NextRequest) {
  // This should only be accessible to admins in production
  // Add authentication check here

  try {
    const configs = getWebhookConfigs()

    return NextResponse.json({
      success: true,
      configs,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
