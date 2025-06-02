import { NextResponse } from "next/server"
import { supabaseVerification } from "@/lib/supabase-verification"

export async function GET() {
  try {
    const verification = await supabaseVerification.runFullVerification()

    return NextResponse.json({
      success: verification.overall,
      timestamp: new Date().toISOString(),
      results: verification.results,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasJwtSecret: !!process.env.SUPABASE_JWT_SECRET,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        details: error,
      },
      { status: 500 },
    )
  }
}
