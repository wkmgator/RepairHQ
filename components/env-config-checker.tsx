"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

// Environment variable categories
const ENV_CATEGORIES = {
  database: [
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
    "POSTGRES_DATABASE",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
  ],
  payment: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
  communication: [
    "SENDGRID_API_KEY",
    "FROM_EMAIL",
    "FROM_NAME",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_FROM_NUMBER",
  ],
  application: ["NEXT_PUBLIC_BASE_URL", "WEBHOOK_BASE_URL"],
  integrations: [
    "OPENAI_API_KEY",
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    "NEXT_PUBLIC_MAPBOX_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ],
}

// Required environment variables
const REQUIRED_ENV_VARS = [
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_HOST",
  "POSTGRES_DATABASE",
  "SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SENDGRID_API_KEY",
  "FROM_EMAIL",
  "FROM_NAME",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_FROM_NUMBER",
  "NEXT_PUBLIC_BASE_URL",
  "WEBHOOK_BASE_URL",
]

export default function EnvConfigChecker() {
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [testingService, setTestingService] = useState<string | null>(null)

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/check-env")
      const data = await response.json()
      setEnvStatus(data.variables || {})
    } catch (error) {
      console.error("Failed to check environment variables:", error)
    } finally {
      setLoading(false)
    }
  }

  const testService = async (service: string) => {
    setTestingService(service)
    try {
      const response = await fetch(`/api/admin/test-service?service=${service}`)
      const data = await response.json()

      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: data.success,
          message: data.message,
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    } finally {
      setTestingService(null)
    }
  }

  const getMissingRequiredVars = () => {
    return REQUIRED_ENV_VARS.filter((varName) => !envStatus[varName])
  }

  const getCategoryStatus = (category: string) => {
    const vars = ENV_CATEGORIES[category as keyof typeof ENV_CATEGORIES] || []
    const requiredVars = vars.filter((v) => REQUIRED_ENV_VARS.includes(v))
    const configuredVars = vars.filter((v) => envStatus[v])
    const requiredConfigured = requiredVars.filter((v) => envStatus[v])

    if (requiredVars.length === requiredConfigured.length) {
      return "complete"
    } else if (requiredConfigured.length > 0) {
      return "partial"
    } else {
      return "missing"
    }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case "missing":
        return <Badge className="bg-red-100 text-red-800">Missing</Badge>
      default:
        return null
    }
  }

  const renderCategoryVars = (category: string) => {
    const vars = ENV_CATEGORIES[category as keyof typeof ENV_CATEGORIES] || []

    return (
      <div className="space-y-2 mt-4">
        {vars.map((varName) => (
          <div key={varName} className="flex items-center justify-between">
            <div className="flex items-center">
              {envStatus[varName] ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : REQUIRED_ENV_VARS.includes(varName) ? (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              )}
              <span className="text-sm font-mono">{varName}</span>
            </div>
            <Badge variant={envStatus[varName] ? "default" : "outline"}>
              {envStatus[varName] ? "Configured" : REQUIRED_ENV_VARS.includes(varName) ? "Required" : "Optional"}
            </Badge>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Environment Configuration</h2>
        <Button onClick={checkEnvironmentVariables} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {getMissingRequiredVars().length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Required Environment Variables</AlertTitle>
          <AlertDescription>
            The following required environment variables are missing:
            <ul className="mt-2 list-disc list-inside">
              {getMissingRequiredVars().map((varName) => (
                <li key={varName} className="font-mono">
                  {varName}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>PostgreSQL and Supabase settings</CardDescription>
            </div>
            {renderStatusBadge(getCategoryStatus("database"))}
          </CardHeader>
          <CardContent>{renderCategoryVars("database")}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testService("database")}
              disabled={testingService === "database" || getCategoryStatus("database") !== "complete"}
            >
              {testingService === "database" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                Supabase Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardFooter>
          {testResults.database && (
            <div className="px-6 pb-4">
              <Alert variant={testResults.database.success ? "default" : "destructive"}>
                {testResults.database.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>{testResults.database.message}</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>

        {/* Payment Processing */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>Stripe payment gateway settings</CardDescription>
            </div>
            {renderStatusBadge(getCategoryStatus("payment"))}
          </CardHeader>
          <CardContent>{renderCategoryVars("payment")}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testService("stripe")}
              disabled={testingService === "stripe" || getCategoryStatus("payment") !== "complete"}
            >
              {testingService === "stripe" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Stripe
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                Stripe Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardFooter>
          {testResults.stripe && (
            <div className="px-6 pb-4">
              <Alert variant={testResults.stripe.success ? "default" : "destructive"}>
                {testResults.stripe.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>{testResults.stripe.message}</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>

        {/* Communication Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Communication Services</CardTitle>
              <CardDescription>Email and SMS service settings</CardDescription>
            </div>
            {renderStatusBadge(getCategoryStatus("communication"))}
          </CardHeader>
          <CardContent>{renderCategoryVars("communication")}</CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testService("email")}
                disabled={testingService === "email" || !envStatus.SENDGRID_API_KEY}
              >
                {testingService === "email" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Test Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testService("sms")}
                disabled={testingService === "sms" || !envStatus.TWILIO_ACCOUNT_SID}
              >
                {testingService === "sms" ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Test SMS
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://app.sendgrid.com" target="_blank" rel="noopener noreferrer">
                  SendGrid
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer">
                  Twilio
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </CardFooter>
          {(testResults.email || testResults.sms) && (
            <div className="px-6 pb-4 space-y-2">
              {testResults.email && (
                <Alert variant={testResults.email.success ? "default" : "destructive"}>
                  {testResults.email.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertDescription>Email: {testResults.email.message}</AlertDescription>
                </Alert>
              )}
              {testResults.sms && (
                <Alert variant={testResults.sms.success ? "default" : "destructive"}>
                  {testResults.sms.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertDescription>SMS: {testResults.sms.message}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Core application configuration</CardDescription>
            </div>
            {renderStatusBadge(getCategoryStatus("application"))}
          </CardHeader>
          <CardContent>{renderCategoryVars("application")}</CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testService("webhooks")}
              disabled={testingService === "webhooks" || !envStatus.WEBHOOK_BASE_URL}
            >
              {testingService === "webhooks" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Webhooks
            </Button>
          </CardFooter>
          {testResults.webhooks && (
            <div className="px-6 pb-4">
              <Alert variant={testResults.webhooks.success ? "default" : "destructive"}>
                {testResults.webhooks.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertDescription>{testResults.webhooks.message}</AlertDescription>
              </Alert>
            </div>
          )}
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>Third-party service integrations</CardDescription>
            </div>
            {renderStatusBadge(getCategoryStatus("integrations"))}
          </CardHeader>
          <CardContent>{renderCategoryVars("integrations")}</CardContent>
          <CardFooter>
            <div className="text-sm text-gray-500">These integrations are optional but enhance functionality</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
