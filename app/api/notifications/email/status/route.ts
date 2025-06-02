import { type NextRequest, NextResponse } from "next/server"
import { handleEmailWebhook } from "@/lib/notification-service"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    await handleEmailWebhook(payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
