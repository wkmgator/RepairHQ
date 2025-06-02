import { createClient as createSupabaseLibClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./supabase-types"

// For server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables for server client")
  }

  return createSupabaseLibClient<Database>(supabaseUrl, supabaseKey)
}

// For client components (singleton pattern)
let clientSupabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getClientSupabaseClient = () => {
  if (!clientSupabaseInstance) {
    // NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are used by createClientComponentClient by default
    clientSupabaseInstance = createClientComponentClient<Database>()
  }
  return clientSupabaseInstance
}

export const createClient = () => {
  return getClientSupabaseClient()
}

// Reset client (useful for testing)
export const resetClientSupabase = () => {
  clientSupabaseInstance = null
}
