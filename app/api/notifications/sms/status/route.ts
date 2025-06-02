import { type NextRequest, NextResponse } from "next/server"
import { handleSMSWebhook } from "@/lib/notification-service"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    await handleSMSWebhook(payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("SMS webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
