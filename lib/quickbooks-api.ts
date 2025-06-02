import { QuickBooksOAuthService, type QuickBooksTokens } from "./quickbooks-oauth"

export interface QuickBooksEmployee {
  Id: string
  Name: string
  Active: boolean
  EmployeeNumber?: string
  SSN?: string
  PrimaryAddr?: any
  PrimaryPhone?: any
  Mobile?: any
  PrimaryEmailAddr?: any
  BillRate?: number
  BirthDate?: string
  HiredDate?: string
  ReleasedDate?: string
}

export interface QuickBooksTimeActivity {
  Id?: string
  TxnDate: string
  NameRef: {
    value: string
    name: string
  }
  CustomerRef?: {
    value: string
    name: string
  }
  ItemRef?: {
    value: string
    name: string
  }
  Hours: number
  Minutes: number
  Description?: string
  HourlyRate?: number
  BreakHours?: number
  BreakMinutes?: number
}

export class QuickBooksAPI {
  private oauthService: QuickBooksOAuthService
  private baseUrl: string

  constructor() {
    this.oauthService = new QuickBooksOAuthService()
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://quickbooks-api.intuit.com"
        : "https://sandbox-quickbooks.api.intuit.com"
  }

  async makeAuthenticatedRequest(
    tokens: QuickBooksTokens,
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> {
    // Check if token needs refresh
    if (this.oauthService.isTokenExpired(tokens)) {
      tokens = await this.oauthService.refreshTokens(tokens.refresh_token)
      // You should save the new tokens to your database here
    }

    const url = `${this.baseUrl}/v3/company/${tokens.company_id}/${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    return response
  }

  async getCompanyInfo(tokens: QuickBooksTokens): Promise<any> {
    const response = await this.makeAuthenticatedRequest(tokens, "companyinfo/1")

    if (!response.ok) {
      throw new Error(`Failed to get company info: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.CompanyInfo?.[0]
  }

  async getEmployees(tokens: QuickBooksTokens): Promise<QuickBooksEmployee[]> {
    const response = await this.makeAuthenticatedRequest(tokens, "query?query=SELECT * FROM Employee")

    if (!response.ok) {
      throw new Error(`Failed to get employees: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.Employee || []
  }

  async createEmployee(tokens: QuickBooksTokens, employee: Partial<QuickBooksEmployee>): Promise<QuickBooksEmployee> {
    const response = await this.makeAuthenticatedRequest(tokens, "employee", {
      method: "POST",
      body: JSON.stringify({ Employee: employee }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create employee: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.Employee?.[0]
  }

  async getTimeActivities(
    tokens: QuickBooksTokens,
    startDate?: string,
    endDate?: string,
  ): Promise<QuickBooksTimeActivity[]> {
    let query = "SELECT * FROM TimeActivity"

    if (startDate && endDate) {
      query += ` WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}'`
    }

    const response = await this.makeAuthenticatedRequest(tokens, `query?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Failed to get time activities: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.TimeActivity || []
  }

  async createTimeActivity(
    tokens: QuickBooksTokens,
    timeActivity: QuickBooksTimeActivity,
  ): Promise<QuickBooksTimeActivity> {
    const response = await this.makeAuthenticatedRequest(tokens, "timeactivity", {
      method: "POST",
      body: JSON.stringify({ TimeActivity: timeActivity }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to create time activity: ${response.statusText} - ${errorData}`)
    }

    const data = await response.json()
    return data.QueryResponse?.TimeActivity?.[0]
  }

  async updateTimeActivity(
    tokens: QuickBooksTokens,
    timeActivity: QuickBooksTimeActivity,
  ): Promise<QuickBooksTimeActivity> {
    const response = await this.makeAuthenticatedRequest(tokens, "timeactivity", {
      method: "POST",
      body: JSON.stringify({ TimeActivity: timeActivity }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update time activity: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.TimeActivity?.[0]
  }

  async deleteTimeActivity(tokens: QuickBooksTokens, id: string, syncToken: string): Promise<void> {
    const timeActivity = {
      Id: id,
      SyncToken: syncToken,
      Active: false,
    }

    const response = await this.makeAuthenticatedRequest(tokens, "timeactivity", {
      method: "POST",
      body: JSON.stringify({ TimeActivity: timeActivity }),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete time activity: ${response.statusText}`)
    }
  }

  async getItems(tokens: QuickBooksTokens): Promise<any[]> {
    const response = await this.makeAuthenticatedRequest(
      tokens,
      "query?query=SELECT * FROM Item WHERE Type = 'Service'",
    )

    if (!response.ok) {
      throw new Error(`Failed to get items: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.Item || []
  }

  async getCustomers(tokens: QuickBooksTokens): Promise<any[]> {
    const response = await this.makeAuthenticatedRequest(tokens, "query?query=SELECT * FROM Customer")

    if (!response.ok) {
      throw new Error(`Failed to get customers: ${response.statusText}`)
    }

    const data = await response.json()
    return data.QueryResponse?.Customer || []
  }
}
