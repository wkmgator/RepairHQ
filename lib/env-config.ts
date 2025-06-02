// lib/env-config.ts

import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    SENDGRID_API_KEY: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_PHONE_NUMBER: z.string(),
    OPENAI_API_KEY: z.string(),
    // Add other non-Firebase environment variables here
  },
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export function getEnv() {
  return env
}

export function validateEnv() {
  // Validation happens when `createEnv` is called.
  // This function confirms that `env` object is the validated environment.
  return env
}
