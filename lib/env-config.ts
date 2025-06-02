/**
 * Environment Configuration Utility
 */

// Define environment variable schema with validation
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
}

type EnvSchemaType = typeof envSchema
type EnvVariables = {
  [K in keyof EnvSchemaType]: string
}

export function validateEnv(): {
  valid: boolean
  missing: string[]
  env: Partial<EnvVariables>
} {
  const missing: string[] = []
  const env: Partial<EnvVariables> = {}

  for (const [key, config] of Object.entries(envSchema)) {
    const value = process.env[key]

    if (config.required && !value) {
      missing.push(key)
    } else {
      // @ts-ignore - Dynamic key assignment
      env[key] = value || ""
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    env,
  }
}

export function getEnv<K extends keyof EnvSchemaType>(key: K): string {
  const value = process.env[key] || ""

  if (envSchema[key].required && !value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }

  return value
}
