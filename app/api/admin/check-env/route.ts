import { type NextRequest, NextResponse } from "next/server"
import { validateEnv } from "@/lib/env-config"

export async function GET(request: NextRequest) {
  // This should only be accessible to admins in production
  // Add authentication check here

  try {
    const { env } = validateEnv()

    // Create a map of environment variables that are set
    const variables: Record<string, boolean> = {}

    // Check each environment variable
    for (const key in process.env) {
      variables[key] = Boolean(process.env[key])
    }

    return NextResponse.json({
      success: true,
      variables,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
