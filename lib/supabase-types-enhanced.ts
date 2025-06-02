export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: "owner" | "manager" | "technician" | "admin"
          plan: string
          trial_ends_at: string | null
          is_trial_active: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: "owner" | "manager" | "technician" | "admin"
          plan?: string
          trial_ends_at?: string | null
          is_trial_active?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: "owner" | "manager" | "technician" | "admin"
          plan?: string
          trial_ends_at?: string | null
          is_trial_active?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          vertical_group: string
          vertical: string
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          phone: string | null
          email: string | null
          website: string | null
          is_primary: boolean
          settings: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          vertical_group: string
          vertical: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          is_primary?: boolean
          settings?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          vertical_group?: string
          vertical?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          is_primary?: boolean
          settings?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          display_name: string
          description: string | null
          price_monthly: number
          price_yearly: number | null
          max_locations: number | null
          max_users: number | null
          max_customers: number | null
          max_inventory: number | null
          features: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          description?: string | null
          price_monthly: number
          price_yearly?: number | null
          max_locations?: number | null
          max_users?: number | null
          max_customers?: number | null
          max_inventory?: number | null
          features: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          description?: string | null
          price_monthly?: number
          price_yearly?: number | null
          max_locations?: number | null
          max_users?: number | null
          max_customers?: number | null
          max_inventory?: number | null
          features?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      verticals: {
        Row: {
          id: string
          name: string
          group_name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          group_name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          group_name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
