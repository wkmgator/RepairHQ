"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"

interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  business_name?: string
  phone?: string
  plan?: string
  trial_ends_at?: string
  is_trial_active?: boolean
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: any
  userProfile: UserProfile | null
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider")
  }
  return context
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).maybeSingle()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  const createUserProfile = async (user: any, userData: any) => {
    try {
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30)

      const { data, error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          business_name: userData.businessName,
          phone: userData.phone,
          plan: "starter",
          trial_ends_at: trialEndDate.toISOString(),
          is_trial_active: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating user profile:", error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id)
            if (mounted) {
              setUserProfile(profile)
            }
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        if (mounted) {
          setUserProfile(profile)
        }
      } else {
        if (mounted) {
          setUserProfile(null)
        }
      }

      if (mounted) {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })

    if (result.data.user && !result.error) {
      const profile = await fetchUserProfile(result.data.user.id)
      setUserProfile(profile)
    }

    return result
  }

  const signUp = async (email: string, password: string, userData: any) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          business_name: userData.businessName,
          phone: userData.phone,
        },
      },
    })

    if (result.data.user && !result.error) {
      const profile = await createUserProfile(result.data.user, userData)
      setUserProfile(profile)
    }

    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    setUserProfile(null)
    return result
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    const { error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (!error) {
      const updatedProfile = await fetchUserProfile(user.id)
      setUserProfile(updatedProfile)
    }
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
