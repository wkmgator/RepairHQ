/**
 * Email Service Configuration
 *
 * This utility provides configuration for email services
 * and handles email sending through various providers.
 */

import sgMail from "@sendgrid/mail"
import { getEnv } from "./env-config"

// Initialize SendGrid with API key
sgMail.setApiKey(getEnv("SENDGRID_API_KEY"))

// Email template types
export type EmailTemplate =
  | "welcome"
  | "password-reset"
  | "invoice"
  | "appointment-confirmation"
  | "appointment-reminder"
  | "repair-status-update"
  | "repair-completed"
  | "feedback-request"
  | "marketing-newsletter"

// Email sending parameters
export interface SendEmailParams {
  to: string | string[]
  subject: string
  text?: string
  html: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    content: string
    filename: string
    type: string
    disposition: "attachment" | "inline"
    contentId?: string
  }>
  templateId?: string
  dynamicTemplateData?: Record<string, any>
  categories?: string[]
  customArgs?: Record<string, any>
  trackingSettings?: {
    clickTracking?: { enable?: boolean; enableText?: boolean }
    openTracking?: { enable?: boolean }
    subscriptionTracking?: { enable?: boolean }
  }
}

/**
 * Sends an email using SendGrid
 * @param params Email parameters
 * @returns The SendGrid response
 */
export async function sendEmail(params: SendEmailParams) {
  const msg = {
    to: params.to,
    from: params.from || getEnv("FROM_EMAIL"),
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
    attachments: params.attachments,
    templateId: params.templateId,
    dynamicTemplateData: params.dynamicTemplateData,
    categories: params.categories,
    customArgs: params.customArgs,
    trackingSettings: params.trackingSettings,
  }

  return sgMail.send(msg)
}

/**
 * Sends an email using a template
 * @param template The template to use
 * @param to Recipient email address(es)
 * @param data Template data
 * @returns The SendGrid response
 */
export async function sendTemplateEmail(template: EmailTemplate, to: string | string[], data: Record<string, any>) {
  // Map template names to SendGrid template IDs
  const templateIds: Record<EmailTemplate, string> = {
    welcome: "d-123456789",
    "password-reset": "d-987654321",
    invoice: "d-abcdef123",
    "appointment-confirmation": "d-123abc456",
    "appointment-reminder": "d-456def789",
    "repair-status-update": "d-789ghi012",
    "repair-completed": "d-012jkl345",
    "feedback-request": "d-345mno678",
    "marketing-newsletter": "d-678pqr901",
  }

  return sendEmail({
    to,
    subject: "", // Subject is defined in the template
    html: "", // HTML is defined in the template
    templateId: templateIds[template],
    dynamicTemplateData: {
      ...data,
      company_name: "RepairHQ",
      company_address: "123 Repair St, Fixville, CA 94043",
      company_phone: "(555) 123-4567",
      company_email: "support@repairhq.com",
      company_website: "https://repairhq.com",
      current_year: new Date().getFullYear(),
    },
    categories: [template],
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true },
    },
  })
}

/**
 * Sends a test email to verify configuration
 * @param to Recipient email address
 * @returns The SendGrid response
 */
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: "RepairHQ Email Configuration Test",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">RepairHQ Email Test</h1>
        <p>This is a test email to verify that your email configuration is working correctly.</p>
        <p>If you received this email, your email service is properly configured!</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      </div>
    `,
    categories: ["test"],
  })
}
