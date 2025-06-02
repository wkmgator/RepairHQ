export class SystemTester {
  static async testStripeIntegration(): Promise<boolean> {
    try {
      const response = await fetch("/api/stripe/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100, currency: "usd" }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  static async testSupabaseConnection(): Promise<boolean> {
    try {
      const response = await fetch("/api/supabase/health")
      return response.ok
    } catch {
      return false
    }
  }

  static async testPOSFlow(): Promise<boolean> {
    try {
      // Test creating a transaction
      const transaction = await fetch("/api/pos/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "test", quantity: 1, price: 10 }],
          total: 10,
        }),
      })
      return transaction.ok
    } catch {
      return false
    }
  }

  static async testEmailSystem(): Promise<boolean> {
    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "Test Email",
          body: "This is a test",
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  static async runFullSystemTest(): Promise<{
    stripe: boolean
    supabase: boolean
    pos: boolean
    email: boolean
    overall: boolean
  }> {
    const results = {
      stripe: await this.testStripeIntegration(),
      supabase: await this.testSupabaseConnection(),
      pos: await this.testPOSFlow(),
      email: await this.testEmailSystem(),
      overall: false,
    }

    results.overall = Object.values(results).every(Boolean)
    return results
  }
}
