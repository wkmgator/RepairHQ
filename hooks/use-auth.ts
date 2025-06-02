"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase-client"

export interface UserProfile {
  id: string
  email: string
  role: "admin" | "owner" | "employee" | "customer"
  business_id?: string
  plan: "starter" | "pro" | "enterprise" | "franchise"
  subscription_status: "active" | "canceled" | "past_due" | "trial"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getClientSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const hasRole = (requiredRole: UserProfile["role"]) => {
    if (!profile) return false

    const roleHierarchy = {
      customer: 1,
      employee: 2,
      owner: 3,
      admin: 4,
    }

    return roleHierarchy[profile.role] >= roleHierarchy[requiredRole]
  }

  const hasPlan = (requiredPlan: UserProfile["plan"]) => {
    if (!profile) return false

    const planHierarchy = {
      starter: 1,
      pro: 2,
      enterprise: 3,
      franchise: 4,
    }

    return planHierarchy[profile.plan] >= planHierarchy[requiredPlan]
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    hasPlan,
    isAuthenticated: !!user,
    isAdmin: profile?.role === "admin",
    isOwner: profile?.role === "owner",
    isEmployee: profile?.role === "employee",
  }
}
