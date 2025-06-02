import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Webhook Configuration | RepairHQ Admin",
  description: "Configure and test webhooks for RepairHQ",
}

export default function WebhooksPage() {
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || "https://example.com"

  const webhooks = [
    {
      name: "Stripe Payment Webhook",
      url: `${webhookBaseUrl}/api/webhooks/stripe`,
      description: "Handles Stripe payment events",
      events: ["payment_intent.succeeded", "payment_intent.failed", "checkout.session.completed"],
      provider: "Stripe",
    },
    {
      name: "Twilio SMS Status Webhook",
      url: `${webhookBaseUrl}/api/webhooks/twilio/status`,
      description: "Handles Twilio SMS delivery status updates",
      events: ["delivered", "failed", "undelivered"],
      provider: "Twilio",
    },
    {
      name: "SendGrid Email Status Webhook",
      url: `${webhookBaseUrl}/api/webhooks/sendgrid/status`,
      description: "Handles SendGrid email delivery status updates",
      events: ["delivered", "opened", "clicked", "bounced", "spam_report"],
      provider: "SendGrid",
    },
    {
      name: "Supabase Auth Webhook",
      url: `${webhookBaseUrl}/api/webhooks/supabase/auth`,
      description: "Handles Supabase authentication events",
      events: ["user.created", "user.deleted"],
      provider: "Supabase",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Webhook Configuration</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Webhook Base URL</CardTitle>
          <CardDescription>
            This is the base URL used for all webhooks. Make sure it's publicly accessible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm bg-gray-100 p-3 rounded">{webhookBaseUrl}</div>
          <p className="text-sm text-gray-500 mt-2">Set the WEBHOOK_BASE_URL environment variable to change this.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>Configure these webhook URLs in their respective service dashboards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.name}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="font-mono text-sm">{webhook.url}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{webhook.provider}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
