import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../supabase-types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from environment variables.")
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

const supabase = createClient()
export { supabase }
