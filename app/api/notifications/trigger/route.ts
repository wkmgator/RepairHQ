import { type NextRequest, NextResponse } from "next/server"
import { GlobalNotificationEngine } from "@/lib/notifications/notification-engine"

export async function POST(request: NextRequest) {
  try {
    const { trigger, data } = await request.json()

    const notificationEngine = new GlobalNotificationEngine()
    await notificationEngine.processNotification(trigger, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification trigger error:", error)
    return NextResponse.json({ error: "Failed to trigger notification" }, { status: 500 })
  }
}
