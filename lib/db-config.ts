import { Pool } from "pg"
import { getEnv } from "./env-config"

// PostgreSQL connection pool configuration
const pgPoolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

// Create a singleton PostgreSQL connection pool
let pgPool: Pool | null = null

export function getPgPool(): Pool {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: getEnv("POSTGRES_URL"),
      ...pgPoolConfig,
    })

    pgPool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err)
      process.exit(-1)
    })
  }

  return pgPool
}

export const databaseConfig = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
}
