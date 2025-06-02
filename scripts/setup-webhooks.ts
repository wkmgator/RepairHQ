/**
 * Webhook Setup Guide Script
 *
 * This script provides instructions for setting up webhooks
 * for various services used by RepairHQ.
 */

import { getEnv } from "../lib/env-config"

// Get the webhook base URL
const webhookBaseUrl = getEnv("WEBHOOK_BASE_URL") || "https://example.com"

// Print the webhook setup guide
console.log("\n=== RepairHQ Webhook Setup Guide ===\n")

console.log("This guide will help you set up webhooks for various services used by RepairHQ.\n")

// Stripe webhooks
console.log("=== Stripe Webhooks ===\n")
console.log(`Webhook URL: ${webhookBaseUrl}/api/webhooks/stripe`)
console.log("Events to enable:")
console.log("  - checkout.session.completed")
console.log("  - payment_intent.succeeded")
console.log("  - payment_intent.failed")
console.log("  - invoice.payment_succeeded")
console.log("  - invoice.payment_failed")
console.log("  - customer.subscription.created")
console.log("  - customer.subscription.updated")
console.log("  - customer.subscription.deleted")
console.log("\nSetup instructions:")
console.log("1. Go to https://dashboard.stripe.com/webhooks")
console.log('2. Click "Add endpoint"')
console.log("3. Enter the webhook URL")
console.log("4. Select the events listed above")
console.log('5. Click "Add endpoint"')
console.log("6. Copy the signing secret")
console.log("7. Add the signing secret to your environment variables as STRIPE_WEBHOOK_SECRET\n")

// Twilio webhooks
console.log("=== Twilio Webhooks ===\n")
console.log(`Status Callback URL: ${webhookBaseUrl}/api/webhooks/twilio/status`)
console.log("\nSetup instructions:")
console.log("1. Go to https://console.twilio.com/us1/develop/sms/settings/general")
console.log('2. Under "Messaging Service", select your messaging service')
console.log('3. Go to "Integration" tab')
console.log("4. Enter the Status Callback URL")
console.log("5. Select the events: delivered, undelivered, failed")
console.log('6. Click "Save"\n')

// SendGrid webhooks
console.log("=== SendGrid Webhooks ===\n")
console.log(`Event Webhook URL: ${webhookBaseUrl}/api/webhooks/sendgrid/status`)
console.log("\nSetup instructions:")
console.log("1. Go to https://app.sendgrid.com/settings/mail_settings")
console.log('2. Find "Event Notification" and click "Edit"')
console.log('3. Toggle "Enabled"')
console.log("4. Enter the Event Webhook URL")
console.log("5. Select the events: delivered, opened, clicked, bounced, spam report")
console.log('6. Click "Save"\n')

// Supabase webhooks
console.log("=== Supabase Webhooks ===\n")
console.log(`Auth Webhook URL: ${webhookBaseUrl}/api/webhooks/supabase/auth`)
console.log("\nSetup instructions:")
console.log("1. Go to https://app.supabase.io/project/_/auth/settings")
console.log('2. Under "Webhooks", enter the Auth Webhook URL')
console.log("3. Select the events: user.created, user.deleted")
console.log('4. Click "Save"\n')

console.log("=== Webhook Testing ===\n")
console.log("To test your webhooks, you can use the following command:")
console.log("  npm run test:webhooks\n")

console.log("This will send test events to your webhook endpoints and verify that they are working correctly.\n")

console.log("=== Webhook Security ===\n")
console.log("Make sure your webhook endpoints validate the signature of incoming requests to prevent spoofing.")
console.log("Each service provides a way to verify the authenticity of webhook requests:")
console.log("  - Stripe: Use the STRIPE_WEBHOOK_SECRET to verify the signature")
console.log("  - Twilio: Use the TWILIO_AUTH_TOKEN to verify the signature")
console.log("  - SendGrid: Use the SENDGRID_API_KEY to verify the signature")
console.log("  - Supabase: Use the SUPABASE_JWT_SECRET to verify the signature\n")

console.log("The webhook handlers in your application already implement these security measures.\n")

console.log("=== Webhook Monitoring ===\n")
console.log("You can monitor webhook deliveries and failures in each service's dashboard:")
console.log("  - Stripe: https://dashboard.stripe.com/webhooks")
console.log("  - Twilio: https://console.twilio.com/us1/monitor/logs")
console.log("  - SendGrid: https://app.sendgrid.com/settings/mail_settings")
console.log("  - Supabase: https://app.supabase.io/project/_/auth/settings\n")

console.log("=== Webhook Troubleshooting ===\n")
console.log("If you encounter issues with webhooks, check the following:")
console.log("1. Ensure your webhook URL is publicly accessible")
console.log("2. Verify that the WEBHOOK_BASE_URL environment variable is set correctly")
console.log("3. Check that the webhook endpoints are properly configured in each service")
console.log("4. Look for errors in your application logs")
console.log("5. Verify that the webhook signatures are being validated correctly\n")

console.log("For more information, refer to the documentation for each service:")
console.log("  - Stripe: https://stripe.com/docs/webhooks")
console.log("  - Twilio: https://www.twilio.com/docs/usage/webhooks")
console.log("  - SendGrid: https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook")
console.log("  - Supabase: https://supabase.com/docs/guides/auth/auth-hooks\n")
