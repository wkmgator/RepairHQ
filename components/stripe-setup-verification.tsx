"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StripeCheck {
  id: string
  name: string
  description: string
  status: "pending" | "passed" | "failed" | "warning"
  action?: string
  url?: string
}

const STRIPE_CHECKS: StripeCheck[] = [
  {
    id: "live-keys",
    name: "Live API Keys",
    description: "Stripe live publishable and secret keys configured",
    status: "pending",
    action: "Add live keys to Vercel environment variables",
  },
  {
    id: "webhook-endpoint",
    name: "Webhook Endpoint",
    description: "Webhook endpoint configured in Stripe dashboard",
    status: "pending",
    action: "Add webhook endpoint: https://repairhq.io/api/webhooks/stripe",
    url: "https://dashboard.stripe.com/webhooks",
  },
  {
    id: "subscription-plans",
    name: "Subscription Plans",
    description: "All pricing plans created in Stripe",
    status: "pending",
    action: "Create Starter ($29), Pro ($59), Enterprise ($99), Franchise ($199)",
    url: "https://dashboard.stripe.com/products",
  },
  {
    id: "webhook-events",
    name: "Webhook Events",
    description: "Required webhook events configured",
    status: "pending",
    action:
      "Enable: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed",
  },
  {
    id: "test-mode-off",
    name: "Test Mode Disabled",
    description: "Stripe account switched to live mode",
    status: "pending",
    action: "Switch to live mode in Stripe dashboard",
    url: "https://dashboard.stripe.com/test/dashboard",
  },
]

export default function StripeSetupVerification() {
  const [checks, setChecks] = useState<StripeCheck[]>(STRIPE_CHECKS)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const verifyStripeSetup = async () => {
    setIsVerifying(true)

    // Simulate verification process
    for (let i = 0; i < checks.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedChecks = [...checks]
      // Mock results - in real implementation, these would be actual API calls
      const mockResults: Record<string, "passed" | "failed" | "warning"> = {
        "live-keys": "failed", // Needs to be added
        "webhook-endpoint": "failed", // Needs setup
        "subscription-plans": "warning", // Partially done
        "webhook-events": "failed", // Needs configuration
        "test-mode-off": "warning", // Needs verification
      }

      updatedChecks[i] = {
        ...updatedChecks[i],
        status: mockResults[updatedChecks[i].id] || "failed",
      }

      setChecks(updatedChecks)
    }

    setIsVerifying(false)
  }

  const getStatusIcon = (status: StripeCheck["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: StripeCheck["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500">Ready</Badge>
      case "failed":
        return <Badge variant="destructive">Setup Required</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Needs Review
          </Badge>
        )
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const webhookUrl = "https://repairhq.io/api/webhooks/stripe"
  const webhookEvents = [
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stripe Setup Verification</h2>
          <p className="text-muted-foreground">Verify your Stripe configuration for production launch</p>
        </div>
        <Button onClick={verifyStripeSetup} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Setup"}
        </Button>
      </div>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
          <CardDescription>Follow these steps to complete your Stripe configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Webhook Endpoint URL</h4>
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded font-mono text-sm">
              <span className="flex-1">{webhookUrl}</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Required Webhook Events</h4>
            <div className="space-y-1">
              {webhookEvents.map((event) => (
                <div key={event} className="flex items-center gap-2 p-2 bg-gray-100 rounded font-mono text-sm">
                  <span className="flex-1">{event}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(event)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Environment Variables Needed</h4>
            <div className="space-y-1">
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">STRIPE_SECRET_KEY=sk_live_...</div>
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
              </div>
              <div className="p-2 bg-gray-100 rounded font-mono text-sm">STRIPE_WEBHOOK_SECRET=whsec_...</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      <div className="space-y-4">
        {checks.map((check) => (
          <Card key={check.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <CardTitle className="text-base">{check.name}</CardTitle>
                    <CardDescription>{check.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(check.status)}
              </div>
            </CardHeader>
            {(check.action || check.url) && (
              <CardContent className="pt-0">
                {check.action && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Action:</strong> {check.action}
                  </p>
                )}
                {check.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={check.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Stripe Dashboard
                    </a>
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
