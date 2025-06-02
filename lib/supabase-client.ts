import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./supabase-types"

// Export createClient directly as required by the error message
export { supabaseCreateClient as createClient } from "@supabase/supabase-js"

// For server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseKey)
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
