import { supabase } from "./supabase/client"

export interface User {
  id: string
  email: string
  role: "admin" | "manager" | "technician" | "customer"
  shopId?: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export class AuthService {
  private supabase = supabase

  async signUp(email: string, password: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await this.supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          return { user: null, error: profileError.message }
        }

        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as User,
          error: null,
        }
      }

      return { user: null, error: "Failed to create user" }
    } catch (error) {
      return { user: null, error: (error as Error).message }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        // Get user profile from database
        const { data: profile, error: profileError } = await this.supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          return { user: null, error: profileError.message }
        }

        return {
          user: {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            shopId: profile.shop_id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            phone: profile.phone,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
          },
          error: null,
        }
      }

      return { user: null, error: "Failed to sign in" }
    } catch (error) {
      return { user: null, error: (error as Error).message }
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: (error as Error).message }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) return null

      const { data: profile, error } = await this.supabase.from("users").select("*").eq("id", user.id).single()

      if (error) return null

      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        shopId: profile.shop_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      }
    } catch (error) {
      return null
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      return {
        user: {
          id: data.id,
          email: data.email,
          role: data.role,
          shopId: data.shop_id,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      }
    } catch (error) {
      return { user: null, error: (error as Error).message }
    }
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email)
      return { error: error?.message || null }
    } catch (error) {
      return { error: (error as Error).message }
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
