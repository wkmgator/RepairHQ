/**
 * SMS Service Configuration
 *
 * This utility provides configuration for SMS services
 * and handles SMS sending through various providers.
 */

import twilio from "twilio"
import { getEnv } from "./env-config"

// Initialize Twilio client
const twilioClient = twilio(getEnv("TWILIO_ACCOUNT_SID"), getEnv("TWILIO_AUTH_TOKEN"))

// SMS template types
export type SmsTemplate =
  | "appointment-confirmation"
  | "appointment-reminder"
  | "repair-status-update"
  | "repair-completed"
  | "verification-code"
  | "password-reset"
  | "payment-confirmation"

// SMS sending parameters
export interface SendSmsParams {
  to: string
  body: string
  from?: string
  mediaUrl?: string[]
  statusCallback?: string
}

/**
 * Sends an SMS using Twilio
 * @param params SMS parameters
 * @returns The Twilio response
 */
export async function sendSms(params: SendSmsParams) {
  return twilioClient.messages.create({
    to: params.to,
    from: params.from || getEnv("TWILIO_FROM_NUMBER"),
    body: params.body,
    mediaUrl: params.mediaUrl,
    statusCallback: params.statusCallback || `${getEnv("WEBHOOK_BASE_URL")}/api/sms/status`,
  })
}

/**
 * Sends an SMS using a template
 * @param template The template to use
 * @param to Recipient phone number
 * @param data Template data
 * @returns The Twilio response
 */
export async function sendTemplateSms(template: SmsTemplate, to: string, data: Record<string, any>) {
  // Template messages
  const templates: Record<SmsTemplate, string> = {
    "appointment-confirmation":
      "Your appointment with RepairHQ is confirmed for {date} at {time}. Reply Y to confirm or call {phone} to reschedule.",
    "appointment-reminder":
      "Reminder: Your RepairHQ appointment is tomorrow at {time}. Reply Y to confirm or call {phone} to reschedule.",
    "repair-status-update": 'RepairHQ update: Your {device} repair status is now "{status}". Track at {tracking_link}',
    "repair-completed":
      "Good news! Your {device} repair is complete and ready for pickup. We're open until {closing_time} today.",
    "verification-code": "Your RepairHQ verification code is {code}. This code expires in 10 minutes.",
    "password-reset": "Your RepairHQ password reset code is {code}. This code expires in 10 minutes.",
    "payment-confirmation": "Payment received: ${amount} for invoice #{invoice_number}. Thank you for your business!",
  }

  // Replace template variables with actual data
  let messageBody = templates[template]
  for (const [key, value] of Object.entries(data)) {
    messageBody = messageBody.replace(`{${key}}`, value)
  }

  // Add company info if not present in data
  messageBody = messageBody
    .replace("{phone}", data.phone || "(555) 123-4567")
    .replace("{tracking_link}", data.tracking_link || "https://repairhq.com/track")

  return sendSms({
    to,
    body: messageBody,
  })
}

/**
 * Sends a verification code SMS
 * @param to Recipient phone number
 * @param code Verification code
 * @returns The Twilio response
 */
export async function sendVerificationCode(to: string, code: string) {
  return sendTemplateSms("verification-code", to, { code })
}

/**
 * Sends a test SMS to verify configuration
 * @param to Recipient phone number
 * @returns The Twilio response
 */
export async function sendTestSms(to: string) {
  return sendSms({
    to,
    body: `RepairHQ SMS Test: Your SMS configuration is working correctly! Time: ${new Date().toISOString()}`,
  })
}

/**
 * Verifies a Twilio webhook signature
 * @param url The full URL of the request
 * @param params The request parameters
 * @param signature The X-Twilio-Signature header
 * @returns Whether the signature is valid
 */
export function verifyTwilioWebhook(url: string, params: Record<string, string>, signature: string): boolean {
  return twilio.validateRequest(getEnv("TWILIO_AUTH_TOKEN"), signature, url, params)
}

// Export the Twilio client for advanced usage
export { twilioClient }
