/**
 * Stripe Configuration Utility
 *
 * This utility provides configuration for Stripe payment processing
 * and handles webhook verification.
 */

import Stripe from "stripe"
import { getEnv } from "./env-config"

// Initialize Stripe with the secret key
const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2023-10-16",
  appInfo: {
    name: "RepairHQ",
    version: "1.0.0",
  },
})

/**
 * Verifies a Stripe webhook signature
 * @param body The raw request body as a string
 * @param signature The Stripe signature from the request header
 * @returns The verified Stripe event
 */
export function verifyStripeWebhook(body: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, getEnv("STRIPE_WEBHOOK_SECRET"))
}

/**
 * Creates a Stripe checkout session
 * @param params Checkout session parameters
 * @returns The created checkout session
 */
export async function createCheckoutSession(
  params: Stripe.Checkout.SessionCreateParams,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    ...params,
    success_url: `${getEnv("NEXT_PUBLIC_BASE_URL")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getEnv("NEXT_PUBLIC_BASE_URL")}/checkout/cancel`,
  })
}

/**
 * Creates a Stripe customer
 * @param params Customer creation parameters
 * @returns The created customer
 */
export async function createCustomer(params: Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
  return stripe.customers.create(params)
}

/**
 * Creates a Stripe subscription
 * @param params Subscription creation parameters
 * @returns The created subscription
 */
export async function createSubscription(params: Stripe.SubscriptionCreateParams): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create(params)
}

/**
 * Retrieves a Stripe checkout session
 * @param sessionId The session ID to retrieve
 * @returns The checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer", "subscription"],
  })
}

/**
 * Creates a Stripe payment intent
 * @param params Payment intent creation parameters
 * @returns The created payment intent
 */
export async function createPaymentIntent(params: Stripe.PaymentIntentCreateParams): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create(params)
}

// Export the Stripe instance for advanced usage
export { stripe }
