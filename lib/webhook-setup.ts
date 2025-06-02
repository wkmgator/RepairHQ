/**
 * Webhook Setup Utility
 *
 * This utility helps configure webhooks for various services.
 */

import { getEnv } from "./env-config"

export interface WebhookConfig {
  service: string
  endpoint: string
  events: string[]
  description: string
  setupUrl: string
  setupInstructions: string
  headers?: Record<string, string>
}

/**
 * Gets webhook configuration for all services
 */
export function getWebhookConfigs(): WebhookConfig[] {
  const baseUrl = getEnv("WEBHOOK_BASE_URL")

  return [
    {
      service: "stripe",
      endpoint: `${baseUrl}/api/webhooks/stripe`,
      events: [
        "checkout.session.completed",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "invoice.paid",
        "invoice.payment_failed",
      ],
      description: "RepairHQ payment and subscription webhooks",
      setupUrl: "https://dashboard.stripe.com/webhooks",
      setupInstructions: `
        1. Go to the Stripe Dashboard > Developers > Webhooks
        2. Click "Add endpoint"
        3. Enter the endpoint URL: ${baseUrl}/api/webhooks/stripe
        4. Select the events to listen to (see list above)
        5. Click "Add endpoint"
        6. Copy the signing secret and add it to your environment variables as STRIPE_WEBHOOK_SECRET
      `,
    },
    {
      service: "twilio",
      endpoint: `${baseUrl}/api/webhooks/twilio/status`,
      events: ["message-status-callback"],
      description: "RepairHQ SMS status webhooks",
      setupUrl: "https://console.twilio.com/us1/develop/sms/settings/general",
      setupInstructions: `
        1. Go to the Twilio Console > Messaging > Settings > General
        2. Under "Webhook Configuration", set the status callback URL to: ${baseUrl}/api/webhooks/twilio/status
        3. Save your changes
      `,
    },
    {
      service: "sendgrid",
      endpoint: `${baseUrl}/api/webhooks/sendgrid/status`,
      events: [
        "delivered",
        "opened",
        "clicked",
        "bounced",
        "dropped",
        "spamreport",
        "unsubscribe",
        "group_unsubscribe",
        "group_resubscribe",
      ],
      description: "RepairHQ email status webhooks",
      setupUrl: "https://app.sendgrid.com/settings/mail_settings",
      setupInstructions: `
        1. Go to the SendGrid Dashboard > Settings > Mail Settings > Event Notification
        2. Set the HTTP Post URL to: ${baseUrl}/api/webhooks/sendgrid/status
        3. Select the events you want to track
        4. Save your changes
      `,
    },
    {
      service: "supabase",
      endpoint: `${baseUrl}/api/webhooks/supabase/auth`,
      events: ["auth.signup", "auth.login", "auth.logout", "auth.password_recovery"],
      description: "RepairHQ Supabase auth webhooks",
      setupUrl: "https://supabase.com/dashboard/project/_/database/hooks",
      setupInstructions: `
        1. Go to the Supabase Dashboard > Database > Hooks
        2. Create a new hook for each event you want to track
        3. Set the webhook URL to: ${baseUrl}/api/webhooks/supabase/auth
        4. Save your changes
      `,
    },
  ]
}

/**
 * Gets webhook configuration for a specific service
 */
export function getWebhookConfig(service: string): WebhookConfig | undefined {
  return getWebhookConfigs().find((config) => config.service === service)
}

/**
 * Generates webhook setup instructions for all services
 */
export function generateWebhookSetupInstructions(): string {
  const configs = getWebhookConfigs()
  let instructions = `# Webhook Setup Instructions\n\n`

  for (const config of configs) {
    instructions += `## ${config.service.charAt(0).toUpperCase() + config.service.slice(1)} Webhooks\n\n`
    instructions += `Endpoint: \`${config.endpoint}\`\n\n`
    instructions += `Events:\n`
    for (const event of config.events) {
      instructions += `- ${event}\n`
    }
    instructions += `\n`
    instructions += `Setup URL: [${config.setupUrl}](${config.setupUrl})\n\n`
    instructions += `### Instructions\n\n${config.setupInstructions}\n\n`
    instructions += `---\n\n`
  }

  return instructions
}
