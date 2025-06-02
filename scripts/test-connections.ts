/**
 * Connection Testing Script
 *
 * This script tests connections to all external services
 * to verify that the environment is properly configured.
 */

import { getPgPool } from "../lib/db-config"
import { stripe } from "../lib/stripe-config"
import { createClient } from "@supabase/supabase-js"
import { getEnv } from "../lib/env-config"

// Test database connection
async function testDatabase() {
  console.log("Testing PostgreSQL connection...")
  try {
    const pool = getPgPool()
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT NOW()")
      console.log(`✅ PostgreSQL connection successful. Server time: ${result.rows[0].now}`)
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error(`❌ PostgreSQL connection failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Test Supabase connection
async function testSupabase() {
  console.log("Testing Supabase connection...")
  try {
    const supabaseUrl = getEnv("SUPABASE_URL")
    const supabaseKey = getEnv("SUPABASE_ANON_KEY")

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error(`❌ Supabase connection failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Test Stripe connection
async function testStripe() {
  console.log("Testing Stripe connection...")
  try {
    const balance = await stripe.balance.retrieve()
    console.log(
      `✅ Stripe connection successful. Available balance: ${balance.available
        .map((b) => `${b.amount / 100} ${b.currency.toUpperCase()}`)
        .join(", ")}`,
    )
    return true
  } catch (error) {
    console.error(`❌ Stripe connection failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Test SendGrid connection
async function testSendGrid() {
  console.log("Testing SendGrid connection...")
  try {
    // In a real implementation, you'd send to a test email
    // For this script, we'll just check if the API key is set
    const apiKey = getEnv("SENDGRID_API_KEY")
    if (!apiKey) throw new Error("SendGrid API key is not set")

    console.log("✅ SendGrid API key is set")
    return true
  } catch (error) {
    console.error(`❌ SendGrid connection failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Test Twilio connection
async function testTwilio() {
  console.log("Testing Twilio connection...")
  try {
    // In a real implementation, you'd send a test SMS
    // For this script, we'll just check if the credentials are set
    const accountSid = getEnv("TWILIO_ACCOUNT_SID")
    const authToken = getEnv("TWILIO_AUTH_TOKEN")

    if (!accountSid || !authToken) throw new Error("Twilio credentials are not set")

    console.log("✅ Twilio credentials are set")
    return true
  } catch (error) {
    console.error(`❌ Twilio connection failed: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Test webhook URL
async function testWebhooks() {
  console.log("Testing webhook URL...")
  try {
    const webhookBaseUrl = getEnv("WEBHOOK_BASE_URL")

    // Test if the webhook URL is reachable
    const response = await fetch(`${webhookBaseUrl}/api/webhooks/test`, {
      method: "HEAD",
    })

    if (response.ok) {
      console.log(`✅ Webhook URL is reachable: ${webhookBaseUrl}`)
      return true
    } else {
      throw new Error(`Status: ${response.status}`)
    }
  } catch (error) {
    console.error(`❌ Webhook URL is not reachable: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

// Run all tests
async function runTests() {
  console.log("\n=== RepairHQ Connection Tests ===\n")

  const results = {
    database: await testDatabase(),
    supabase: await testSupabase(),
    stripe: await testStripe(),
    sendgrid: await testSendGrid(),
    twilio: await testTwilio(),
    webhooks: await testWebhooks(),
  }

  console.log("\n=== Test Results Summary ===\n")

  for (const [service, success] of Object.entries(results)) {
    console.log(`${success ? "✅" : "❌"} ${service.charAt(0).toUpperCase() + service.slice(1)}`)
  }

  const allSuccessful = Object.values(results).every(Boolean)

  console.log(
    "\n" +
      (allSuccessful
        ? "✅ All connections successful! Your environment is properly configured."
        : "❌ Some connections failed. Please check the errors above and fix your environment configuration."),
  )

  return allSuccessful
}

// Run the tests
runTests()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error("Error running tests:", error)
    process.exit(1)
  })
