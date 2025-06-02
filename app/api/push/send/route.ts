import { NextResponse } from "next/server"
import { sendNotification } from "@/lib/push-notification-service"

export async function POST(request: Request) {
  try {
    const { userId, notification } = await request.json()

    if (!userId || !notification) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const result = await sendNotification(userId, notification)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send notification" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
