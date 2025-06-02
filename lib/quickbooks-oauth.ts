export interface QuickBooksTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
  company_id: string
  created_at: number
}

export interface QuickBooksCompany {
  id: string
  name: string
  country: string
  currency: string
  fiscal_year_start: string
}

export class QuickBooksOAuthService {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private baseUrl: string
  private discoveryDocument: any

  constructor() {
    this.clientId = process.env.QUICKBOOKS_CLIENT_ID!
    this.clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!
    this.redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!
    this.baseUrl =
      process.env.NODE_ENV === "production" ? "https://appcenter.intuit.com" : "https://appcenter-sandbox.intuit.com"
  }

  async getDiscoveryDocument() {
    if (!this.discoveryDocument) {
      const response = await fetch(`${this.baseUrl}/v1/connection/oauth2/discovery_document`)
      this.discoveryDocument = await response.json()
    }
    return this.discoveryDocument
  }

  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: "com.intuit.quickbooks.accounting",
      redirect_uri: this.redirectUri,
      response_type: "code",
      access_type: "offline",
      state: state,
    })

    return `${this.baseUrl}/connect/oauth2?${params.toString()}`
  }

  async exchangeCodeForTokens(code: string, state: string): Promise<QuickBooksTokens> {
    const discovery = await this.getDiscoveryDocument()

    const response = await fetch(discovery.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.statusText}`)
    }

    const tokens = await response.json()

    return {
      ...tokens,
      created_at: Date.now(),
      company_id: this.extractCompanyId(state),
    }
  }

  async refreshTokens(refreshToken: string): Promise<QuickBooksTokens> {
    const discovery = await this.getDiscoveryDocument()

    const response = await fetch(discovery.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const tokens = await response.json()

    return {
      ...tokens,
      created_at: Date.now(),
    }
  }

  async revokeTokens(refreshToken: string): Promise<void> {
    const discovery = await this.getDiscoveryDocument()

    const response = await fetch(discovery.revocation_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.statusText}`)
    }
  }

  private extractCompanyId(state: string): string {
    try {
      const stateData = JSON.parse(Buffer.from(state, "base64").toString())
      return stateData.companyId || ""
    } catch {
      return ""
    }
  }

  isTokenExpired(tokens: QuickBooksTokens): boolean {
    const expirationTime = tokens.created_at + tokens.expires_in * 1000
    return Date.now() >= expirationTime - 300000 // 5 minutes buffer
  }
}
