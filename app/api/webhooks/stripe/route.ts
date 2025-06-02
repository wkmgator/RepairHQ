import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      console.log("Payment successful:", session.id)
      await handleSuccessfulPayment(session)
      break

    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription
      console.log("Subscription created:", subscription.id)
      await handleSubscriptionCreated(subscription)
      break

    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.log("Subscription updated:", updatedSubscription.id)
      await handleSubscriptionUpdated(updatedSubscription)
      break

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.log("Subscription cancelled:", deletedSubscription.id)
      await handleSubscriptionCancelled(deletedSubscription)
      break

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice
      console.log("Payment succeeded:", invoice.id)
      await handlePaymentSucceeded(invoice)
      break

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice
      console.log("Payment failed:", failedInvoice.id)
      await handlePaymentFailed(failedInvoice)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const { planName, countryCode } = session.metadata || {}
    const customerEmail = session.customer_details?.email

    if (!customerEmail) {
      console.error("No customer email found in session")
      return
    }

    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", customerEmail)
      .single()

    if (userError || !user) {
      console.error("User not found:", userError)
      return
    }

    // Update user with subscription details
    const { error: updateError } = await supabase
      .from("users")
      .update({
        plan: planName?.toLowerCase() || "starter",
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        is_trial_active: false,
        trial_ends_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating user:", updateError)
      return
    }

    // Create default store for the user
    await createDefaultStore(user.id, user.business_name || `${user.first_name}'s Repair Shop`)

    console.log("Successfully set up account for:", customerEmail)
  } catch (error) {
    console.error("Error handling successful payment:", error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        stripe_subscription_id: subscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_customer_id", subscription.customer as string)

    if (error) {
      console.error("Error updating subscription:", error)
    }
  } catch (error) {
    console.error("Error handling subscription created:", error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Update plan based on subscription
    const planName = getPlanNameFromSubscription(subscription)

    const { error } = await supabase
      .from("users")
      .update({
        plan: planName,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("Error updating subscription:", error)
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error)
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        plan: "cancelled",
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("Error handling subscription cancellation:", error)
    }
  } catch (error) {
    console.error("Error handling subscription cancelled:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Handle successful recurring payments
  console.log("Payment succeeded for customer:", invoice.customer)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Handle failed payments - maybe send notification
  console.log("Payment failed for customer:", invoice.customer)
}

async function createDefaultStore(userId: string, storeName: string) {
  try {
    const { error } = await supabase.from("stores").insert({
      user_id: userId,
      name: storeName,
      address: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      phone: "",
      email: "",
      is_default: true,
    })

    if (error) {
      console.error("Error creating default store:", error)
    }
  } catch (error) {
    console.error("Error creating default store:", error)
  }
}

function getPlanNameFromSubscription(subscription: Stripe.Subscription): string {
  // Extract plan name from subscription metadata or price ID
  const metadata = subscription.metadata
  if (metadata?.planName) {
    return metadata.planName.toLowerCase()
  }

  // Fallback to extracting from price ID or other methods
  return "starter"
}
