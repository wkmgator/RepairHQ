import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are present
    const requiredVars = ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"]

    const missing = requiredVars.filter((varName) => !process.env[varName])

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing environment variables",
          missing,
        },
        { status: 400 },
      )
    }

    // Verify Stripe connection
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // Test the connection by retrieving account info
    const account = await stripe.accounts.retrieve()

    // Check if account is in live mode
    const isLiveMode = !account.livemode ? false : true

    // Get webhook endpoints
    const webhooks = await stripe.webhookEndpoints.list()
    const repairHQWebhook = webhooks.data.find(
      (webhook) => webhook.url.includes("repairhq.io") || webhook.url.includes("api/webhooks/stripe"),
    )

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        country: account.country,
        email: account.email,
        livemode: account.livemode,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
      webhook: repairHQWebhook
        ? {
            id: repairHQWebhook.id,
            url: repairHQWebhook.url,
            enabled_events: repairHQWebhook.enabled_events,
            status: repairHQWebhook.status,
          }
        : null,
      recommendations: [
        ...(!isLiveMode ? ["Switch to live mode in Stripe dashboard"] : []),
        ...(!repairHQWebhook ? ["Configure webhook endpoint"] : []),
        ...(!account.charges_enabled ? ["Complete account verification"] : []),
      ],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify Stripe configuration",
      },
      { status: 500 },
    )
  }
}
