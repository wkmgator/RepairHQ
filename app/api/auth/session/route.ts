import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    return NextResponse.json({
      user: session.user,
      expires_at: session.expires_at,
      authenticated: true,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
