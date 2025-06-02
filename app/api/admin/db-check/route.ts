import { NextResponse, type NextRequest } from "next/server"
import { Pool } from "pg"
import { supabaseVerification } from "@/lib/supabase-verification" // Assuming this is correctly set up
import { databaseConfig } from "@/lib/db-config" // For Supabase config

// Basic PostgreSQL connection pool (adjust config as needed)
let pgPool: Pool | null = null
if (process.env.POSTGRES_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      // Recommended: Add SSL configuration for production
      // ssl: {
      //   rejectUnauthorized: false, // Or configure with CA cert
      // },
      max: 5, // Max number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a client to connect
    })
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool:", error)
  }
}

export async function GET(request: NextRequest) {
  // IMPORTANT: Add authentication/authorization here to protect this route
  // For example, check if the user is an admin

  const results: Record<string, any> = {
    postgresql: {
      configured: false,
      connected: false,
      message: "PostgreSQL URL not configured in environment variables.",
      details: {},
    },
    supabase: {
      configured: false,
      connection: { success: false, message: "Supabase URL not configured." },
      serviceRole: { success: false, message: "Supabase Service Role Key not configured." },
      details: {},
    },
  }

  // --- PostgreSQL Check ---
  if (pgPool && process.env.POSTGRES_URL) {
    results.postgresql.configured = true
    results.postgresql.details = {
      host: process.env.POSTGRES_HOST || "N/A",
      database: process.env.POSTGRES_DATABASE || "N/A",
      user: process.env.POSTGRES_USER || "N/A",
    }
    try {
      const client = await pgPool.connect()
      await client.query("SELECT NOW()") // Simple query to test connection
      client.release()
      results.postgresql.connected = true
      results.postgresql.message = "Successfully connected to PostgreSQL."
    } catch (error: any) {
      results.postgresql.connected = false
      results.postgresql.message = `Failed to connect to PostgreSQL: ${error.message}`
      results.postgresql.details.error = error.toString()
    }
  }

  // --- Supabase Check ---
  if (databaseConfig.supabase.url && databaseConfig.supabase.anonKey) {
    results.supabase.configured = true
    results.supabase.details = {
      projectUrl: databaseConfig.supabase.url,
      anonKeyConfigured: !!databaseConfig.supabase.anonKey,
      serviceRoleKeyConfigured: !!databaseConfig.supabase.serviceRoleKey,
    }
    try {
      const supabaseConnectionResult = await supabaseVerification.verifyConnection()
      results.supabase.connection = supabaseConnectionResult

      if (databaseConfig.supabase.serviceRoleKey) {
        const supabaseServiceRoleResult = await supabaseVerification.verifyServiceRole()
        results.supabase.serviceRole = supabaseServiceRoleResult
      } else {
        results.supabase.serviceRole = { success: false, message: "Supabase Service Role Key not configured." }
      }
    } catch (error: any) {
      results.supabase.connection = { success: false, message: `Error verifying Supabase connection: ${error.message}` }
      results.supabase.serviceRole = {
        success: false,
        message: `Error verifying Supabase service role: ${error.message}`,
      }
      results.supabase.details.error = error.toString()
    }
  }

  return NextResponse.json(results)
}
