import { type NextRequest, NextResponse } from "next/server"
import { SMSService, EmailService, NotificationAutomation } from "@/lib/notification-service"

export async function POST(request: NextRequest) {
  try {
    const { trigger, data, templates } = await request.json()

    // Initialize services with configuration
    const smsService = new SMSService("twilio", {
      accountSid: process.env.TWILIO_ACCOUNT_SID!,
      authToken: process.env.TWILIO_AUTH_TOKEN!,
      fromNumber: process.env.TWILIO_FROM_NUMBER!,
      webhookUrl: process.env.WEBHOOK_BASE_URL!,
    })

    const emailService = new EmailService("sendgrid", {
      apiKey: process.env.SENDGRID_API_KEY!,
      fromEmail: process.env.FROM_EMAIL!,
      fromName: process.env.FROM_NAME!,
    })

    const automation = new NotificationAutomation(smsService, emailService)

    await automation.triggerNotification(trigger, data, templates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification sending error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
