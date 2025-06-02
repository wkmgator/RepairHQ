import { type NextRequest, NextResponse } from "next/server"
import { getPgPool } from "@/lib/db-config"
import { stripe } from "@/lib/stripe-config"
import { sendTestEmail } from "@/lib/email-config"
import { sendTestSms } from "@/lib/sms-config"
import { getEnv } from "@/lib/env-config"

export async function GET(request: NextRequest) {
  // This should only be accessible to admins in production
  // Add authentication check here

  const service = request.nextUrl.searchParams.get("service")

  try {
    switch (service) {
      case "database":
        return await testDatabase()
      case "stripe":
        return await testStripe()
      case "email":
        return await testEmail()
      case "sms":
        return await testSms()
      case "webhooks":
        return await testWebhooks()
      default:
        return NextResponse.json(
          {
            success: false,
            message: `Unknown service: ${service}`,
          },
          { status: 400 },
        )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function testDatabase() {
  const pool = getPgPool()
  const client = await pool.connect()

  try {
    const result = await client.query("SELECT NOW()")
    return NextResponse.json({
      success: true,
      message: `Database connection successful. Server time: ${result.rows[0].now}`,
    })
  } finally {
    client.release()
  }
}

async function testStripe() {
  const balance = await stripe.balance.retrieve()

  return NextResponse.json({
    success: true,
    message: `Stripe connection successful. Available balance: ${balance.available.map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(", ")}`,
  })
}

async function testEmail() {
  // In a real implementation, you'd send to the admin's email
  // For demo purposes, we'll just check the configuration
  const adminEmail = "admin@example.com" // Replace with actual admin email

  await sendTestEmail(adminEmail)

  return NextResponse.json({
    success: true,
    message: `Test email sent to ${adminEmail}. Please check your inbox.`,
  })
}

async function testSms() {
  // In a real implementation, you'd send to the admin's phone
  // For demo purposes, we'll just check the configuration
  const adminPhone = "+15551234567" // Replace with actual admin phone

  await sendTestSms(adminPhone)

  return NextResponse.json({
    success: true,
    message: `Test SMS sent to ${adminPhone}. Please check your phone.`,
  })
}

async function testWebhooks() {
  const webhookBaseUrl = getEnv("WEBHOOK_BASE_URL")

  // Test if the webhook URL is reachable
  const response = await fetch(`${webhookBaseUrl}/api/webhooks/test`, {
    method: "HEAD",
  })

  if (response.ok) {
    return NextResponse.json({
      success: true,
      message: `Webhook URL is reachable: ${webhookBaseUrl}`,
    })
  } else {
    return NextResponse.json({
      success: false,
      message: `Webhook URL is not reachable: ${webhookBaseUrl}. Status: ${response.status}`,
    })
  }
}
