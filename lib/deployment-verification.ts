/**
 * Deployment Verification Utility
 *
 * This utility helps verify that all services are properly configured
 * and connected after deployment.
 */

import { getEnv, validateEnv } from "./env-config"
import { getPgPool } from "./db-config"
import { stripe } from "./stripe-config"
import { createClient } from "@supabase/supabase-js"

export interface VerificationResult {
  service: string
  status: "success" | "warning" | "error"
  message: string
  details?: any
  timestamp: string
}

export async function verifyDeployment(): Promise<VerificationResult[]> {
  const results: VerificationResult[] = []
  const timestamp = new Date().toISOString()

  // Verify environment variables
  try {
    const { valid, missing } = validateEnv()
    results.push({
      service: "environment",
      status: valid ? "success" : "error",
      message: valid
        ? "All required environment variables are set"
        : `Missing required environment variables: ${missing.join(", ")}`,
      details: { missingCount: missing.length },
      timestamp,
    })
  } catch (error) {
    results.push({
      service: "environment",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error verifying environment variables",
      timestamp,
    })
  }

  // Verify database connection
  try {
    const pool = getPgPool()
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT NOW()")
      results.push({
        service: "database",
        status: "success",
        message: `Database connection successful. Server time: ${result.rows[0].now}`,
        timestamp,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    results.push({
      service: "database",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error connecting to database",
      timestamp,
    })
  }

  // Verify Supabase connection
  try {
    const supabaseUrl = getEnv("SUPABASE_URL")
    const supabaseKey = getEnv("SUPABASE_ANON_KEY")
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.from("health_check").select("*").limit(1)

    if (error) throw error

    results.push({
      service: "supabase",
      status: "success",
      message: "Supabase connection successful",
      timestamp,
    })
  } catch (error) {
    results.push({
      service: "supabase",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error connecting to Supabase",
      timestamp,
    })
  }

  // Verify Stripe connection
  try {
    const balance = await stripe.balance.retrieve()
    results.push({
      service: "stripe",
      status: "success",
      message: `Stripe connection successful. Available balance: ${balance.available.map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(", ")}`,
      timestamp,
    })
  } catch (error) {
    results.push({
      service: "stripe",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error connecting to Stripe",
      timestamp,
    })
  }

  // Verify SendGrid configuration
  try {
    const apiKey = getEnv("SENDGRID_API_KEY")
    const fromEmail = getEnv("FROM_EMAIL")

    if (apiKey && fromEmail) {
      // We won't actually send an email here, just verify the config
      results.push({
        service: "sendgrid",
        status: "success",
        message: `SendGrid configuration verified. From email: ${fromEmail}`,
        timestamp,
      })
    } else {
      results.push({
        service: "sendgrid",
        status: "warning",
        message: "SendGrid configuration incomplete",
        timestamp,
      })
    }
  } catch (error) {
    results.push({
      service: "sendgrid",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error verifying SendGrid configuration",
      timestamp,
    })
  }

  // Verify Twilio configuration
  try {
    const accountSid = getEnv("TWILIO_ACCOUNT_SID")
    const authToken = getEnv("TWILIO_AUTH_TOKEN")
    const fromNumber = getEnv("TWILIO_FROM_NUMBER")

    if (accountSid && authToken && fromNumber) {
      // We won't actually send an SMS here, just verify the config
      results.push({
        service: "twilio",
        status: "success",
        message: `Twilio configuration verified. From number: ${fromNumber}`,
        timestamp,
      })
    } else {
      results.push({
        service: "twilio",
        status: "warning",
        message: "Twilio configuration incomplete",
        timestamp,
      })
    }
  } catch (error) {
    results.push({
      service: "twilio",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error verifying Twilio configuration",
      timestamp,
    })
  }

  // Verify webhook URL
  try {
    const webhookBaseUrl = getEnv("WEBHOOK_BASE_URL")

    if (webhookBaseUrl) {
      // Test if the webhook URL is reachable
      try {
        const response = await fetch(`${webhookBaseUrl}/api/webhooks/test`, {
          method: "HEAD",
        })

        if (response.ok) {
          results.push({
            service: "webhooks",
            status: "success",
            message: `Webhook URL is reachable: ${webhookBaseUrl}`,
            timestamp,
          })
        } else {
          results.push({
            service: "webhooks",
            status: "warning",
            message: `Webhook URL returned status ${response.status}: ${webhookBaseUrl}`,
            timestamp,
          })
        }
      } catch (error) {
        results.push({
          service: "webhooks",
          status: "warning",
          message: `Could not reach webhook URL: ${webhookBaseUrl}`,
          timestamp,
        })
      }
    } else {
      results.push({
        service: "webhooks",
        status: "warning",
        message: "Webhook base URL not configured",
        timestamp,
      })
    }
  } catch (error) {
    results.push({
      service: "webhooks",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error verifying webhook URL",
      timestamp,
    })
  }

  return results
}

/**
 * Generates a deployment verification report
 */
export async function generateVerificationReport(): Promise<string> {
  const results = await verifyDeployment()
  const timestamp = new Date().toISOString()

  let report = `# Deployment Verification Report\n\n`
  report += `Generated: ${new Date().toLocaleString()}\n\n`

  const successCount = results.filter((r) => r.status === "success").length
  const warningCount = results.filter((r) => r.status === "warning").length
  const errorCount = results.filter((r) => r.status === "error").length

  report += `## Summary\n\n`
  report += `- Total services checked: ${results.length}\n`
  report += `- Success: ${successCount}\n`
  report += `- Warnings: ${warningCount}\n`
  report += `- Errors: ${errorCount}\n\n`

  report += `## Service Details\n\n`

  for (const result of results) {
    const statusEmoji = result.status === "success" ? "✅" : result.status === "warning" ? "⚠️" : "❌"

    report += `### ${statusEmoji} ${result.service}\n\n`
    report += `Status: ${result.status.toUpperCase()}\n\n`
    report += `Message: ${result.message}\n\n`

    if (result.details) {
      report += `Details: ${JSON.stringify(result.details, null, 2)}\n\n`
    }
  }

  report += `## Environment Information\n\n`
  report += `- Node.js Version: ${process.version}\n`
  report += `- Environment: ${process.env.NODE_ENV || "development"}\n`
  report += `- Timestamp: ${timestamp}\n`

  return report
}
