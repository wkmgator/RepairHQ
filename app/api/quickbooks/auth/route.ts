import { type NextRequest, NextResponse } from "next/server"
import { QuickBooksOAuthService } from "@/lib/quickbooks-oauth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const companyId = searchParams.get("company_id")

    if (!userId || !companyId) {
      return NextResponse.json({ error: "Missing user_id or company_id" }, { status: 400 })
    }

    const oauthService = new QuickBooksOAuthService()

    // Create state parameter with user and company info
    const state = Buffer.from(JSON.stringify({ userId, companyId })).toString("base64")

    const authUrl = oauthService.generateAuthUrl(state)

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("QuickBooks auth error:", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}
