import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ledvnbrxsrkzoiziyhho.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZHZuYnJ4c3Jrem9peml5aGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzk2ODYsImV4cCI6MjA2Mzg1NTY4Nn0.vq03al0mBqfvooLJv-ACqyUoUYspVz4JP4AKBgPy7XY"

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()

export const getSupabaseClient = () => {
  return supabase
}

// Server-side client for admin operations
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZHZuYnJ4c3Jrem9peml5aGhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI3OTY4NiwiZXhwIjoyMDYzODU1Njg2fQ.c0LxnozhewvQcIXh_H9l4KIB9pSPfcByKZHXh2Zeyb8",
)
