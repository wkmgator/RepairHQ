import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./supabase-types"

// For server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// For client components (singleton pattern)
let clientSupabase: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getClientSupabaseClient = () => {
  if (!clientSupabase) {
    clientSupabase = createClientComponentClient<Database>()
  }
  return clientSupabase
}

// Reset client (useful for testing)
export const resetClientSupabase = () => {
  clientSupabase = null
}
