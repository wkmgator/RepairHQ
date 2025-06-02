"use server"

import type { Timestamp } from "firebase/firestore"

// Types for notification system
export interface NotificationTemplate {
  id: string
  name: string
  type: "status_update" | "appointment" | "completion" | "promotional" | "delay_alert"
  channels: ("sms" | "email")[]
  trigger: string
  active: boolean
  template: {
    sms?: string
    email?: {
      subject: string
      body: string
    }
  }
}

export interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: string
  active: boolean
  conditions?: Record<string, any>
  steps: NotificationStep[]
}

export interface NotificationStep {
  delay: number // minutes
  action: string
  template?: string
  condition?: string
}

export interface NotificationLog {
  id: string
  customerId: string
  templateId: string
  channel: "sms" | "email"
  status: "sent" | "delivered" | "opened" | "clicked" | "failed"
  sentAt: Timestamp
  deliveredAt?: Timestamp
  openedAt?: Timestamp
  clickedAt?: Timestamp
  content: {
    subject?: string
    message: string
  }
  metadata: Record<string, any>
}

// SMS Service Integration
export class SMSService {
  private provider: "twilio" | "aws-sns" | "messagebird"
  private config: Record<string, string>

  constructor(provider: "twilio" | "aws-sns" | "messagebird", config: Record<string, string>) {
    this.provider = provider
    this.config = config
  }

  async sendSMS(
    to: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      switch (this.provider) {
        case "twilio":
          return await this.sendTwilioSMS(to, message, metadata)
        case "aws-sns":
          return await this.sendAWSSMS(to, message, metadata)
        case "messagebird":
          return await this.sendMessageBirdSMS(to, message, metadata)
        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`)
      }
    } catch (error) {
      console.error("SMS sending failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async sendTwilioSMS(to: string, message: string, metadata?: Record<string, any>) {
    // Twilio integration
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: this.config.fromNumber,
        To: to,
        Body: message,
        StatusCallback: `${this.config.webhookUrl}/sms/status`,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        messageId: data.sid,
      }
    } else {
      return {
        success: false,
        error: data.message,
      }
    }
  }

  private async sendAWSSMS(to: string, message: string, metadata?: Record<string, any>) {
    // AWS SNS integration would go here
    return {
      success: true,
      messageId: `aws-${Date.now()}`,
    }
  }

  private async sendMessageBirdSMS(to: string, message: string, metadata?: Record<string, any>) {
    // MessageBird integration would go here
    return {
      success: true,
      messageId: `mb-${Date.now()}`,
    }
  }
}

// Email Service Integration
export class EmailService {
  private provider: "sendgrid" | "mailgun" | "aws-ses"
  private config: Record<string, string>

  constructor(provider: "sendgrid" | "mailgun" | "aws-ses", config: Record<string, string>) {
    this.provider = provider
    this.config = config
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    metadata?: Record<string, any>,
  ): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      switch (this.provider) {
        case "sendgrid":
          return await this.sendSendGridEmail(to, subject, htmlContent, textContent, metadata)
        case "mailgun":
          return await this.sendMailgunEmail(to, subject, htmlContent, textContent, metadata)
        case "aws-ses":
          return await this.sendAWSEmail(to, subject, htmlContent, textContent, metadata)
        default:
          throw new Error(`Unsupported email provider: ${this.provider}`)
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async sendSendGridEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    metadata?: Record<string, any>,
  ) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        content: [
          {
            type: "text/html",
            value: htmlContent,
          },
          ...(textContent
            ? [
                {
                  type: "text/plain",
                  value: textContent,
                },
              ]
            : []),
        ],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
        custom_args: metadata,
      }),
    })

    if (response.ok) {
      const messageId = response.headers.get("x-message-id")
      return {
        success: true,
        messageId: messageId || `sg-${Date.now()}`,
      }
    } else {
      const error = await response.json()
      return {
        success: false,
        error: error.errors?.[0]?.message || "SendGrid error",
      }
    }
  }

  private async sendMailgunEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    metadata?: Record<string, any>,
  ) {
    // Mailgun integration would go here
    return {
      success: true,
      messageId: `mg-${Date.now()}`,
    }
  }

  private async sendAWSEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    metadata?: Record<string, any>,
  ) {
    // AWS SES integration would go here
    return {
      success: true,
      messageId: `aws-${Date.now()}`,
    }
  }
}

// Template Processing
export class TemplateProcessor {
  static processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      processed = processed.replace(new RegExp(placeholder, "g"), String(value))
    })

    return processed
  }

  static getAvailableVariables(): string[] {
    return [
      "customer_name",
      "customer_first_name",
      "customer_last_name",
      "customer_phone",
      "customer_email",
      "device_type",
      "device_brand",
      "device_model",
      "ticket_number",
      "ticket_status",
      "issue_description",
      "estimated_cost",
      "estimated_completion",
      "technician_name",
      "store_name",
      "store_phone",
      "store_address",
      "store_hours",
      "tracking_link",
      "appointment_date",
      "appointment_time",
      "service_type",
      "parts_eta",
      "new_eta",
      "completion_date",
      "pickup_instructions",
    ]
  }
}

// Notification Automation Engine
export class NotificationAutomation {
  private smsService: SMSService
  private emailService: EmailService

  constructor(smsService: SMSService, emailService: EmailService) {
    this.smsService = smsService
    this.emailService = emailService
  }

  async triggerNotification(
    trigger: string,
    data: Record<string, any>,
    templates: NotificationTemplate[],
  ): Promise<void> {
    const matchingTemplates = templates.filter((template) => template.active && template.trigger === trigger)

    for (const template of matchingTemplates) {
      await this.sendNotification(template, data)
    }
  }

  private async sendNotification(template: NotificationTemplate, data: Record<string, any>): Promise<void> {
    const variables = this.extractVariables(data)

    // Send SMS if enabled
    if (template.channels.includes("sms") && template.template.sms && data.customer_phone) {
      const smsMessage = TemplateProcessor.processTemplate(template.template.sms, variables)
      await this.smsService.sendSMS(data.customer_phone, smsMessage, {
        templateId: template.id,
        customerId: data.customer_id,
        ticketId: data.ticket_id,
      })
    }

    // Send Email if enabled
    if (template.channels.includes("email") && template.template.email && data.customer_email) {
      const emailSubject = TemplateProcessor.processTemplate(template.template.email.subject, variables)
      const emailBody = TemplateProcessor.processTemplate(template.template.email.body, variables)

      await this.emailService.sendEmail(
        data.customer_email,
        emailSubject,
        this.generateEmailHTML(emailBody, variables),
        emailBody,
        {
          templateId: template.id,
          customerId: data.customer_id,
          ticketId: data.ticket_id,
        },
      )
    }
  }

  private extractVariables(data: Record<string, any>): Record<string, any> {
    // Extract and format variables from the data object
    return {
      customer_name: `${data.customer_first_name || ""} ${data.customer_last_name || ""}`.trim(),
      customer_first_name: data.customer_first_name || "",
      customer_last_name: data.customer_last_name || "",
      customer_phone: data.customer_phone || "",
      customer_email: data.customer_email || "",
      device_type: data.device_type || "",
      device_brand: data.device_brand || "",
      device_model: data.device_model || "",
      ticket_number: data.ticket_number || "",
      ticket_status: data.ticket_status || "",
      issue_description: data.issue_description || "",
      estimated_cost: data.estimated_cost ? `$${data.estimated_cost}` : "",
      estimated_completion: data.estimated_completion || "",
      technician_name: data.technician_name || "",
      store_name: data.store_name || "RepairHQ",
      store_phone: data.store_phone || "",
      store_address: data.store_address || "",
      store_hours: data.store_hours || "9 AM - 6 PM",
      tracking_link: data.tracking_link || "",
      appointment_date: data.appointment_date || "",
      appointment_time: data.appointment_time || "",
      service_type: data.service_type || "",
      parts_eta: data.parts_eta || "",
      new_eta: data.new_eta || "",
      completion_date: data.completion_date || "",
      pickup_instructions: data.pickup_instructions || "",
    }
  }

  private generateEmailHTML(textContent: string, variables: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RepairHQ Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RepairHQ</h1>
            </div>
            <div class="content">
              ${textContent.replace(/\n/g, "<br>")}
              ${variables.tracking_link ? `<p><a href="${variables.tracking_link}" class="button">Track Your Repair</a></p>` : ""}
            </div>
            <div class="footer">
              <p>${variables.store_name}<br>
              ${variables.store_address}<br>
              ${variables.store_phone}</p>
              <p><a href="{unsubscribe_link}">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Webhook handlers for delivery status
export async function handleSMSWebhook(payload: any): Promise<void> {
  // Handle SMS delivery status updates from providers
  console.log("SMS webhook received:", payload)

  // Update notification log in database
  // await updateNotificationStatus(payload.MessageSid, payload.MessageStatus)
}

export async function handleEmailWebhook(payload: any): Promise<void> {
  // Handle email delivery status updates from providers
  console.log("Email webhook received:", payload)

  // Update notification log in database
  // await updateNotificationStatus(payload.sg_message_id, payload.event)
}
