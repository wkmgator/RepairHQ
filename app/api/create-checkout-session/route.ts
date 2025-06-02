import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const { planId, planName, billingCycle, businessName } = await request.json()

    // Get plan details from database
    const { data: plan, error: planError } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Determine the price ID based on billing cycle
    const priceId =
      billingCycle === "yearly" && plan.stripe_price_id_yearly
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding?step=2`,
      metadata: {
        planName: plan.name,
        planId: plan.id,
        billingCycle,
        businessName,
      },
      subscription_data: {
        metadata: {
          planName: plan.name,
          planId: plan.id,
          businessName,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
