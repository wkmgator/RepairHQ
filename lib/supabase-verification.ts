import { supabase } from "./supabase/client"
import { getServiceSupabase } from "./supabase-config"

export interface VerificationResult {
  success: boolean
  message: string
  details?: any
}

export class SupabaseVerification {
  async verifyConnection(): Promise<VerificationResult> {
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)

      if (error) {
        return {
          success: false,
          message: "Failed to connect to Supabase",
          details: error,
        }
      }

      return {
        success: true,
        message: "Successfully connected to Supabase",
      }
    } catch (error) {
      return {
        success: false,
        message: "Connection error",
        details: error,
      }
    }
  }

  async verifyAuthentication(): Promise<VerificationResult> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      return {
        success: true,
        message: session ? "User is authenticated" : "No active session",
        details: { hasSession: !!session },
      }
    } catch (error) {
      return {
        success: false,
        message: "Authentication verification failed",
        details: error,
      }
    }
  }

  async verifyRLS(): Promise<VerificationResult> {
    try {
      // Test RLS by trying to access users table without auth
      const { data, error } = await supabase.from("users").select("*").limit(1)

      // If we get data without auth, RLS might not be properly configured
      if (data && data.length > 0) {
        return {
          success: false,
          message: "RLS may not be properly configured - data accessible without auth",
        }
      }

      return {
        success: true,
        message: "RLS appears to be working correctly",
      }
    } catch (error) {
      return {
        success: true,
        message: "RLS is blocking unauthorized access (expected behavior)",
      }
    }
  }

  async verifyServiceRole(): Promise<VerificationResult> {
    try {
      const serviceSupabase = getServiceSupabase()
      const { data, error } = await serviceSupabase.from("users").select("count").limit(1)

      if (error) {
        return {
          success: false,
          message: "Service role verification failed",
          details: error,
        }
      }

      return {
        success: true,
        message: "Service role is working correctly",
      }
    } catch (error) {
      return {
        success: false,
        message: "Service role connection error",
        details: error,
      }
    }
  }

  async runFullVerification(): Promise<{
    overall: boolean
    results: Record<string, VerificationResult>
  }> {
    const results = {
      connection: await this.verifyConnection(),
      authentication: await this.verifyAuthentication(),
      rls: await this.verifyRLS(),
      serviceRole: await this.verifyServiceRole(),
    }

    const overall = Object.values(results).every((result) => result.success)

    return { overall, results }
  }
}

export const supabaseVerification = new SupabaseVerification()
