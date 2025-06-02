"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Copy, ExternalLink, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StripeKey {
  name: string
  envVar: string
  description: string
  example: string
  required: boolean
  isSecret: boolean
}

const STRIPE_KEYS: StripeKey[] = [
  {
    name: "Publishable Key (Live)",
    envVar: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    description: "Client-side key for Stripe Elements and checkout",
    example: "pk_live_51...",
    required: true,
    isSecret: false,
  },
  {
    name: "Secret Key (Live)",
    envVar: "STRIPE_SECRET_KEY",
    description: "Server-side key for API calls and webhook verification",
    example: "sk_live_51...",
    required: true,
    isSecret: true,
  },
  {
    name: "Webhook Secret",
    envVar: "STRIPE_WEBHOOK_SECRET",
    description: "Secret for verifying webhook signatures",
    example: "whsec_...",
    required: true,
    isSecret: true,
  },
]

export default function StripeProductionSetup() {
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const toggleSecretVisibility = (envVar: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [envVar]: !prev[envVar],
    }))
  }

  const validateKey = (key: StripeKey, value: string): boolean => {
    if (!value) return false

    switch (key.envVar) {
      case "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY":
        return value.startsWith("pk_live_") && value.length > 20
      case "STRIPE_SECRET_KEY":
        return value.startsWith("sk_live_") && value.length > 20
      case "STRIPE_WEBHOOK_SECRET":
        return value.startsWith("whsec_") && value.length > 20
      default:
        return false
    }
  }

  const validateAllKeys = async () => {
    setIsValidating(true)
    const results: Record<string, boolean> = {}

    STRIPE_KEYS.forEach((key) => {
      const value = keys[key.envVar] || ""
      results[key.envVar] = validateKey(key, value)
    })

    setValidationResults(results)
    setIsValidating(false)

    const allValid = Object.values(results).every(Boolean)
    if (allValid) {
      toast({
        title: "Validation successful!",
        description: "All Stripe keys are properly formatted.",
      })
    } else {
      toast({
        title: "Validation failed",
        description: "Please check your Stripe keys and try again.",
        variant: "destructive",
      })
    }
  }

  const generateVercelCommand = () => {
    const commands = STRIPE_KEYS.map((key) => {
      const value = keys[key.envVar] || `YOUR_${key.envVar}`
      return `vercel env add ${key.envVar} production`
    }).join("\n")

    return commands
  }

  const generateEnvFile = () => {
    const envContent = STRIPE_KEYS.map((key) => {
      const value = keys[key.envVar] || `YOUR_${key.envVar}`
      return `${key.envVar}=${value}`
    }).join("\n")

    return envContent
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configure Production Stripe API Keys</h2>
        <p className="text-muted-foreground">Set up your live Stripe API keys for production deployment</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Make sure you're using LIVE keys (not test keys) for production. Live keys start
          with <code>pk_live_</code> and <code>sk_live_</code>.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="vercel">Vercel CLI</TabsTrigger>
          <TabsTrigger value="dashboard">Vercel Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Stripe API Keys</CardTitle>
              <CardDescription>
                Get these keys from your{" "}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Stripe Dashboard
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {STRIPE_KEYS.map((key) => (
                <div key={key.envVar} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key.envVar} className="text-sm font-medium">
                      {key.name}
                      {key.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {validationResults[key.envVar] !== undefined && (
                      <div className="flex items-center gap-1">
                        {validationResults[key.envVar] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id={key.envVar}
                      type={key.isSecret && !showSecrets[key.envVar] ? "password" : "text"}
                      placeholder={key.example}
                      value={keys[key.envVar] || ""}
                      onChange={(e) =>
                        setKeys((prev) => ({
                          ...prev,
                          [key.envVar]: e.target.value,
                        }))
                      }
                      className={
                        validationResults[key.envVar] === false
                          ? "border-red-500"
                          : validationResults[key.envVar] === true
                            ? "border-green-500"
                            : ""
                      }
                    />
                    {key.isSecret && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleSecretVisibility(key.envVar)}
                      >
                        {showSecrets[key.envVar] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{key.description}</p>
                </div>
              ))}

              <Button onClick={validateAllKeys} disabled={isValidating} className="w-full">
                {isValidating ? "Validating..." : "Validate Keys"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vercel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vercel CLI Commands</CardTitle>
              <CardDescription>Use these commands to add environment variables via Vercel CLI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">1. Install Vercel CLI (if not installed)</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded font-mono text-sm mt-2">
                  <span className="flex-1">npm install -g vercel</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("npm install -g vercel")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">2. Login to Vercel</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded font-mono text-sm mt-2">
                  <span className="flex-1">vercel login</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("vercel login")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">3. Add Environment Variables</Label>
                <div className="space-y-2 mt-2">
                  {STRIPE_KEYS.map((key) => (
                    <div key={key.envVar} className="flex items-center gap-2 p-3 bg-gray-100 rounded font-mono text-sm">
                      <span className="flex-1">vercel env add {key.envVar} production</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`vercel env add ${key.envVar} production`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  When prompted, enter the corresponding value for each environment variable. The CLI will securely
                  store them in your Vercel project.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vercel Dashboard Setup</CardTitle>
              <CardDescription>Add environment variables through the Vercel web dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                    1
                  </span>
                  <span>Go to your Vercel project dashboard</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Dashboard
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  <span>Navigate to Settings → Environment Variables</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                    3
                  </span>
                  <span>Add each environment variable for Production environment</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Environment Variables to Add:</Label>
                {STRIPE_KEYS.map((key) => (
                  <div key={key.envVar} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">{key.envVar}</span>
                      <Badge variant={key.required ? "default" : "secondary"}>
                        {key.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{key.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Example: {key.example}</p>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertDescription>
                  Make sure to select <strong>"Production"</strong> as the environment when adding these variables. This
                  ensures they're only used in your live deployment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Webhook Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Next Step: Configure Webhooks</CardTitle>
          <CardDescription>
            After adding your API keys, you'll need to set up webhooks in your Stripe dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Webhook Endpoint URL</Label>
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded font-mono text-sm mt-2">
              <span className="flex-1">https://repairhq.io/api/webhooks/stripe</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("https://repairhq.io/api/webhooks/stripe")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Required Events</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {[
                "checkout.session.completed",
                "customer.subscription.updated",
                "customer.subscription.deleted",
                "invoice.payment_succeeded",
                "invoice.payment_failed",
              ].map((event) => (
                <div key={event} className="flex items-center gap-2 p-2 bg-gray-100 rounded font-mono text-sm">
                  <span className="flex-1">{event}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(event)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" asChild>
            <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Configure Webhooks in Stripe
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
