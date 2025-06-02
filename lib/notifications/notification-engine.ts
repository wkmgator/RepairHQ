"use server"

import { createClient } from "@/lib/supabase"
import { SMSService, EmailService } from "@/lib/notification-service"

export interface NotificationRule {
  id: string
  name: string
  trigger: string
  conditions: Record<string, any>
  channels: ("push" | "sms" | "email" | "slack" | "teams")[]
  recipients: ("customer" | "technician" | "manager" | "owner")[]
  template: string
  priority: "low" | "medium" | "high" | "critical"
  active: boolean
  vertical_specific?: string[]
  store_specific?: string[]
}

export interface NotificationTemplate {
  id: string
  name: string
  type: string
  channels: Record<string, any>
  variables: string[]
  vertical_specific?: string
  locale_specific?: string
}

export class GlobalNotificationEngine {
  private supabase = createClient()
  private smsService: SMSService
  private emailService: EmailService

  constructor() {
    this.smsService = new SMSService("twilio", {
      accountSid: process.env.TWILIO_ACCOUNT_SID!,
      authToken: process.env.TWILIO_AUTH_TOKEN!,
      fromNumber: process.env.TWILIO_FROM_NUMBER!,
      webhookUrl: process.env.WEBHOOK_BASE_URL!,
    })

    this.emailService = new EmailService("sendgrid", {
      apiKey: process.env.SENDGRID_API_KEY!,
      fromEmail: process.env.FROM_EMAIL!,
      fromName: process.env.FROM_NAME!,
    })
  }

  async processNotification(trigger: string, data: Record<string, any>) {
    // Get applicable rules
    const { data: rules } = await this.supabase
      .from("notification_rules")
      .select("*")
      .eq("active", true)
      .eq("trigger", trigger)

    if (!rules) return

    for (const rule of rules) {
      // Check conditions
      if (this.evaluateConditions(rule.conditions, data)) {
        await this.executeNotification(rule, data)
      }
    }
  }

  private evaluateConditions(conditions: Record<string, any>, data: Record<string, any>): boolean {
    // Simple condition evaluation - can be enhanced with complex logic
    for (const [key, value] of Object.entries(conditions)) {
      if (data[key] !== value) return false
    }
    return true
  }

  private async executeNotification(rule: NotificationRule, data: Record<string, any>) {
    // Get recipients based on rule
    const recipients = await this.getRecipients(rule, data)

    // Get template
    const { data: template } = await this.supabase
      .from("notification_templates")
      .select("*")
      .eq("id", rule.template)
      .single()

    if (!template) return

    // Send notifications through each channel
    for (const channel of rule.channels) {
      await this.sendThroughChannel(channel, recipients, template, data, rule.priority)
    }
  }

  private async getRecipients(rule: NotificationRule, data: Record<string, any>) {
    const recipients: Array<{ type: string; contact: string; locale?: string }> = []

    for (const recipientType of rule.recipients) {
      switch (recipientType) {
        case "customer":
          if (data.customer_id) {
            const { data: customer } = await this.supabase
              .from("customers")
              .select("email, phone, preferred_locale")
              .eq("id", data.customer_id)
              .single()

            if (customer) {
              recipients.push({
                type: "customer",
                contact: customer.email || customer.phone,
                locale: customer.preferred_locale,
              })
            }
          }
          break

        case "technician":
          if (data.technician_id) {
            const { data: tech } = await this.supabase
              .from("users")
              .select("email, phone, preferred_locale")
              .eq("id", data.technician_id)
              .single()

            if (tech) {
              recipients.push({
                type: "technician",
                contact: tech.email || tech.phone,
                locale: tech.preferred_locale,
              })
            }
          }
          break

        case "manager":
        case "owner":
          const { data: managers } = await this.supabase
            .from("users")
            .select("email, phone, preferred_locale")
            .eq("role", recipientType)
            .eq("store_id", data.store_id)

          if (managers) {
            recipients.push(
              ...managers.map((manager) => ({
                type: recipientType,
                contact: manager.email || manager.phone,
                locale: manager.preferred_locale,
              })),
            )
          }
          break
      }
    }

    return recipients
  }

  private async sendThroughChannel(
    channel: string,
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
    priority: string,
  ) {
    switch (channel) {
      case "push":
        await this.sendPushNotifications(recipients, template, data, priority)
        break
      case "sms":
        await this.sendSMSNotifications(recipients, template, data)
        break
      case "email":
        await this.sendEmailNotifications(recipients, template, data)
        break
      case "slack":
        await this.sendSlackNotifications(recipients, template, data, priority)
        break
      case "teams":
        await this.sendTeamsNotifications(recipients, template, data, priority)
        break
    }
  }

  private async sendPushNotifications(
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
    priority: string,
  ) {
    // Implementation for push notifications
    const payload = {
      title: this.processTemplate(template.channels.push?.title || "Notification", data),
      body: this.processTemplate(template.channels.push?.body || "", data),
      priority: priority === "critical" ? "high" : "normal",
      data: {
        type: template.type,
        ...data,
      },
    }

    // Send to all recipients with push subscriptions
    for (const recipient of recipients) {
      await this.sendPushToUser(recipient.contact, payload)
    }
  }

  private async sendSMSNotifications(
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
  ) {
    const message = this.processTemplate(template.channels.sms || "", data)

    for (const recipient of recipients) {
      if (recipient.contact.includes("@")) continue // Skip email addresses

      await this.smsService.sendSMS(recipient.contact, message, {
        templateId: template.id,
        recipientType: recipient.type,
      })
    }
  }

  private async sendEmailNotifications(
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
  ) {
    const subject = this.processTemplate(template.channels.email?.subject || "Notification", data)
    const body = this.processTemplate(template.channels.email?.body || "", data)

    for (const recipient of recipients) {
      if (!recipient.contact.includes("@")) continue // Skip phone numbers

      await this.emailService.sendEmail(recipient.contact, subject, this.generateEmailHTML(body, data), body, {
        templateId: template.id,
        recipientType: recipient.type,
      })
    }
  }

  private async sendSlackNotifications(
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
    priority: string,
  ) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) return

    const message = {
      text: this.processTemplate(template.channels.slack?.text || "", data),
      attachments: [
        {
          color: priority === "critical" ? "danger" : priority === "high" ? "warning" : "good",
          fields: [
            {
              title: "Ticket ID",
              value: data.ticket_id || "N/A",
              short: true,
            },
            {
              title: "Store",
              value: data.store_name || "N/A",
              short: true,
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  }

  private async sendTeamsNotifications(
    recipients: Array<{ type: string; contact: string; locale?: string }>,
    template: NotificationTemplate,
    data: Record<string, any>,
    priority: string,
  ) {
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL
    if (!webhookUrl) return

    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: priority === "critical" ? "FF0000" : priority === "high" ? "FFA500" : "00FF00",
      summary: this.processTemplate(template.channels.teams?.summary || "", data),
      sections: [
        {
          activityTitle: "RepairHQ Notification",
          activitySubtitle: this.processTemplate(template.channels.teams?.text || "", data),
          facts: [
            {
              name: "Ticket ID",
              value: data.ticket_id || "N/A",
            },
            {
              name: "Store",
              value: data.store_name || "N/A",
            },
            {
              name: "Priority",
              value: priority,
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    let processed = template

    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      processed = processed.replace(new RegExp(placeholder, "g"), String(value))
    })

    return processed
  }

  private generateEmailHTML(textContent: string, data: Record<string, any>): string {
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
              ${data.ticket_id ? `<p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/tickets/${data.ticket_id}" class="button">View Ticket</a></p>` : ""}
            </div>
            <div class="footer">
              <p>RepairHQ - Professional Repair Management</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private async sendPushToUser(userIdentifier: string, payload: any) {
    // Get push subscriptions for user
    const { data: subscriptions } = await this.supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_identifier", userIdentifier)
      .eq("active", true)

    if (!subscriptions) return

    // Send to all user's devices
    for (const subscription of subscriptions) {
      try {
        // Implementation would use web-push library
        console.log("Sending push notification:", payload)
      } catch (error) {
        console.error("Push notification failed:", error)
      }
    }
  }
}

// Pre-defined notification rules for common scenarios
export const defaultNotificationRules: Partial<NotificationRule>[] = [
  {
    name: "Ticket Status Update",
    trigger: "ticket_status_changed",
    channels: ["push", "sms"],
    recipients: ["customer"],
    priority: "medium",
    template: "ticket_status_update",
  },
  {
    name: "Repair Completed",
    trigger: "repair_completed",
    channels: ["push", "sms", "email"],
    recipients: ["customer"],
    priority: "high",
    template: "repair_completed",
  },
  {
    name: "Critical Issue Alert",
    trigger: "critical_issue",
    channels: ["push", "sms", "slack"],
    recipients: ["manager", "owner"],
    priority: "critical",
    template: "critical_alert",
  },
  {
    name: "Low Stock Alert",
    trigger: "low_stock",
    channels: ["push", "email"],
    recipients: ["manager"],
    priority: "medium",
    template: "low_stock_alert",
  },
  {
    name: "New Ticket Assignment",
    trigger: "ticket_assigned",
    channels: ["push"],
    recipients: ["technician"],
    priority: "medium",
    template: "ticket_assignment",
  },
]
