import { NextResponse } from "next/server"
import { saveSubscription } from "@/lib/push-notification-service"

export async function POST(request: Request) {
  try {
    const { userId, subscription, deviceInfo } = await request.json()

    if (!userId || !subscription || !deviceInfo) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const success = await saveSubscription(userId, subscription, deviceInfo)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Failed to save subscription" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in push registration:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
