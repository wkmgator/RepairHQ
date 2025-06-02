/**
 * Environment Variables Verification Script
 *
 * This script verifies that all required environment variables are set
 * and provides a report on the status of each variable.
 */

import { validateEnv } from "../lib/env-config"

// Run the validation
const { valid, missing, env } = validateEnv()

// Print the results
console.log("\n=== RepairHQ Environment Verification ===\n")

if (valid) {
  console.log("✅ All required environment variables are set.\n")
} else {
  console.error("❌ Missing required environment variables:\n")
  missing.forEach((varName) => {
    console.error(`   - ${varName}`)
  })
  console.error("\n")
}

// Group variables by category
const categories = {
  "Database Configuration": [
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
  "Payment Processing": ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
  "Email Services": ["SENDGRID_API_KEY", "FROM_EMAIL", "FROM_NAME"],
  "SMS Services": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
  "Application Settings": ["NEXT_PUBLIC_BASE_URL", "WEBHOOK_BASE_URL"],
  "External APIs": ["OPENAI_API_KEY", "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", "NEXT_PUBLIC_MAPBOX_API_KEY"],
  "Legacy Support": ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"],
  "Feature Flags": ["ENABLE_LEGACY_FEATURES", "ENABLE_AI_FEATURES", "ENABLE_BETA_FEATURES"],
}

// Print status by category
for (const [category, variables] of Object.entries(categories)) {
  console.log(`\n${category}:`)

  for (const varName of variables) {
    const isSet = Boolean(process.env[varName])
    const status = isSet ? "✅" : missing.includes(varName) ? "❌" : "⚠️"
    console.log(`  ${status} ${varName}`)
  }
}

console.log("\nLegend:")
console.log("  ✅ - Set")
console.log("  ❌ - Missing (Required)")
console.log("  ⚠️ - Missing (Optional)")

// Exit with appropriate code
if (!valid) {
  process.exit(1)
}
