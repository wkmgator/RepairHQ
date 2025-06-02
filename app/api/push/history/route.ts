import { NextResponse } from "next/server"
import { getNotificationHistory } from "@/lib/push-notification-service"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 })
    }

    const notifications = await getNotificationHistory(userId)

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Error fetching notification history:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
