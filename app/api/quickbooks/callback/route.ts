import { type NextRequest, NextResponse } from "next/server"
import { QuickBooksOAuthService } from "@/lib/quickbooks-oauth"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(new URL(`/settings/integrations?error=${error}`, request.url))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/settings/integrations?error=missing_parameters", request.url))
    }

    const oauthService = new QuickBooksOAuthService()
    const tokens = await oauthService.exchangeCodeForTokens(code, state)

    // Decode state to get user and company info
    const stateData = JSON.parse(Buffer.from(state, "base64").toString())
    const { userId, companyId } = stateData

    // Store tokens in database
    const supabase = createClient()

    const { error: dbError } = await supabase.from("quickbooks_integrations").upsert({
      user_id: userId,
      company_id: companyId,
      qb_company_id: tokens.company_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      token_type: tokens.token_type,
      scope: tokens.scope,
      connected_at: new Date().toISOString(),
      is_active: true,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.redirect(new URL("/settings/integrations?error=database_error", request.url))
    }

    return NextResponse.redirect(new URL("/settings/integrations?success=quickbooks_connected", request.url))
  } catch (error) {
    console.error("QuickBooks callback error:", error)
    return NextResponse.redirect(new URL("/settings/integrations?error=callback_failed", request.url))
  }
}
