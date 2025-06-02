/**
 * Environment Variables Export Script
 *
 * This script generates a template .env file with all required variables
 * and their descriptions for easy configuration.
 */

import fs from "fs"
import path from "path"

// Define environment variable schema with descriptions
const envSchema = {
  // Database Configuration
  POSTGRES_URL: { required: true, description: "PostgreSQL connection URL" },
  POSTGRES_PRISMA_URL: { required: true, description: "PostgreSQL URL for Prisma" },
  POSTGRES_URL_NON_POOLING: { required: false, description: "Non-pooling PostgreSQL URL" },
  POSTGRES_USER: { required: true, description: "PostgreSQL username" },
  POSTGRES_PASSWORD: { required: true, description: "PostgreSQL password" },
  POSTGRES_HOST: { required: true, description: "PostgreSQL host" },
  POSTGRES_DATABASE: { required: true, description: "PostgreSQL database name" },

  // Supabase Configuration
  SUPABASE_URL: { required: true, description: "Supabase project URL" },
  NEXT_PUBLIC_SUPABASE_URL: { required: true, description: "Public Supabase URL for client" },
  SUPABASE_ANON_KEY: { required: true, description: "Supabase anonymous key" },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: { required: true, description: "Public Supabase anonymous key for client" },
  SUPABASE_SERVICE_ROLE_KEY: { required: true, description: "Supabase service role key for admin operations" },
  SUPABASE_JWT_SECRET: { required: true, description: "Supabase JWT secret for token verification" },

  // Stripe Configuration
  STRIPE_SECRET_KEY: { required: true, description: "Stripe secret API key" },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: { required: true, description: "Stripe publishable key for client" },
  STRIPE_WEBHOOK_SECRET: { required: true, description: "Stripe webhook signing secret" },

  // Firebase Configuration (for legacy support)
  FIREBASE_PROJECT_ID: { required: false, description: "Firebase project ID" },
  FIREBASE_CLIENT_EMAIL: { required: false, description: "Firebase client email" },
  FIREBASE_PRIVATE_KEY: { required: false, description: "Firebase private key" },

  // Email Configuration
  SENDGRID_API_KEY: { required: true, description: "SendGrid API key for email sending" },
  FROM_EMAIL: { required: true, description: "Default sender email address" },
  FROM_NAME: { required: true, description: "Default sender name" },

  // SMS Configuration
  TWILIO_ACCOUNT_SID: { required: true, description: "Twilio account SID" },
  TWILIO_AUTH_TOKEN: { required: true, description: "Twilio auth token" },
  TWILIO_FROM_NUMBER: { required: true, description: "Twilio sender phone number" },

  // Application Configuration
  NEXT_PUBLIC_BASE_URL: { required: true, description: "Base URL of the application" },
  WEBHOOK_BASE_URL: { required: true, description: "Base URL for webhooks" },

  // API Keys
  OPENAI_API_KEY: { required: false, description: "OpenAI API key for AI features" },
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: { required: false, description: "Google Maps API key" },
  NEXT_PUBLIC_MAPBOX_API_KEY: { required: false, description: "Mapbox API key" },

  // Feature Flags
  ENABLE_LEGACY_FEATURES: { required: false, description: "Enable legacy features", default: "false" },
  ENABLE_AI_FEATURES: { required: false, description: "Enable AI-powered features", default: "true" },
  ENABLE_BETA_FEATURES: { required: false, description: "Enable beta features", default: "false" },
}

// Generate the .env template file
function generateEnvTemplate() {
  let template = "# RepairHQ Environment Variables\n"
  template += "# Generated on: " + new Date().toISOString() + "\n\n"

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

  // Add each category and its variables
  for (const [category, variables] of Object.entries(categories)) {
    template += `\n# ${category}\n`

    for (const varName of variables) {
      const varConfig = envSchema[varName as keyof typeof envSchema]
      if (!varConfig) continue

      template += `# ${varConfig.description}\n`
      if (varConfig.required) {
        template += `# Required: Yes\n`
      } else {
        template += `# Required: No\n`
        if (varConfig.default) {
          template += `# Default: ${varConfig.default}\n`
        }
      }

      template += `${varName}=\n\n`
    }
  }

  return template
}

// Write the template to a file
const template = generateEnvTemplate()
const outputPath = path.join(process.cwd(), ".env.template")

fs.writeFileSync(outputPath, template)
console.log(`Environment template generated at: ${outputPath}`)

// Also generate a production-ready template
const prodOutputPath = path.join(process.cwd(), ".env.production.template")
fs.writeFileSync(prodOutputPath, template)
console.log(`Production environment template generated at: ${prodOutputPath}`)
