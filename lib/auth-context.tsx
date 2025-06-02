"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { resellerService } from "./reseller-service" // Import resellerService
import type { UserProfile as SupabaseUserProfile } from "./supabase-types" // Use the generated type

// Combine UserProfile with reseller specific fields and industry vertical
export interface UserProfile extends SupabaseUserProfile {
  is_reseller?: boolean
  reseller_id?: string | null
  selected_industry_vertical?: string | null // Added
  // custom_fields and payout_details might already be in SupabaseUserProfile if you updated it
  // If not, add them here:
  // custom_fields?: Record<string, any> | null;
  // payout_details?: Record<string, any> | null;
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (
    email: string,
    password: string,
    userData: any,
    referralCode?: string, // Added referralCode
  ) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfileAndResellerStatus = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("Fetching user profile for:", userId)
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*, selected_industry_vertical") // Ensure selected_industry_vertical is fetched
        .eq("id", userId)
        .single<SupabaseUserProfile>() // Use the specific type

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile:", profileError)
        return null
      }

      let userProfileResult: UserProfile | null = profileData ? { ...profileData } : null

      if (!profileData && profileError?.code === "PGRST116") {
        console.log("User profile not found, creating new basic profile...")
        const basicProfile = await createBasicUserProfile(userId)
        if (basicProfile) {
          userProfileResult = { ...basicProfile }
        }
      }

      if (userProfileResult) {
        // Check reseller status
        const { data: resellerData, error: resellerError } = await supabase
          .from("resellers")
          .select("id")
          .eq("user_id", userId)
          .single()

        if (resellerError && resellerError.code !== "PGRST116") {
          console.error("Error checking reseller status:", resellerError)
        }
        if (resellerData) {
          userProfileResult.is_reseller = true
          userProfileResult.reseller_id = resellerData.id
        } else {
          userProfileResult.is_reseller = false
          userProfileResult.reseller_id = null
        }
      }

      console.log("User profile (with reseller status) fetched successfully:", userProfileResult)
      return userProfileResult
    } catch (error) {
      console.error("Error in fetchUserProfileAndResellerStatus:", error)
      return null
    }
  }

  const createBasicUserProfile = async (userId: string): Promise<SupabaseUserProfile | null> => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      const email = authUser.user?.email || ""
      console.log("Creating basic user profile for:", userId, email)
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30)

      const { data, error } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: email,
          role: "customer",
          plan: "starter",
          trial_ends_at: trialEndDate.toISOString(),
          selected_industry_vertical: "general-repair", // Example default
          is_trial_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single<SupabaseUserProfile>()

      if (error) {
        console.error("Error creating basic user profile:", error)
        return null
      }
      console.log("Basic user profile created:", data)
      return data
    } catch (error) {
      console.error("Error in createBasicUserProfile:", error)
      return null
    }
  }

  const createUserProfileInDb = async (user: User, userData: any): Promise<SupabaseUserProfile | null> => {
    try {
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30)
      console.log("Creating user profile in DB with data:", userData)

      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email || "",
          first_name: userData.firstName || null,
          last_name: userData.lastName || null,
          business_name: userData.businessName || null,
          phone: userData.phone || null,
          role: "customer",
          plan: "starter",
          trial_ends_at: trialEndDate.toISOString(),
          selected_industry_vertical: userData.selected_industry_vertical || "general-repair", // Example
          is_trial_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single<SupabaseUserProfile>()

      if (error) {
        console.error("Error creating user profile in DB:", error)
        return null
      }
      console.log("User profile created successfully in DB:", data)
      return data
    } catch (error) {
      console.error("Error in createUserProfileInDb:", error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    const getSession = async () => {
      try {
        console.log("Getting initial session...")
        const { data, error } = await supabase.auth.getSession()
        if (error) console.error("Error getting session:", error)

        if (mounted) {
          setSession(data.session)
          setUser(data.session?.user ?? null)
          if (data.session?.user) {
            console.log("Session found, fetching user profile with reseller status...")
            const profile = await fetchUserProfileAndResellerStatus(data.session.user.id)
            if (mounted) setUserProfile(profile)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) setLoading(false)
      }
    }
    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      console.log("Auth state changed:", event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log("User authenticated, fetching profile with reseller status...")
        const profile = await fetchUserProfileAndResellerStatus(session.user.id)
        if (mounted) setUserProfile(profile)
      } else {
        if (mounted) setUserProfile(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email)
      const result = await supabase.auth.signInWithPassword({ email, password })
      if (result.error) {
        console.error("Sign in error:", result.error)
        return result
      }
      if (result.data.user) {
        console.log("Sign in successful, fetching profile with reseller status...")
        const profile = await fetchUserProfileAndResellerStatus(result.data.user.id)
        setUserProfile(profile)
      }
      return result
    } catch (error) {
      console.error("Error in signIn:", error)
      return { error }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    userData: any,
    referralCode?: string, // Added referralCode
  ) => {
    try {
      console.log("Signing up user:", email, "Referral Code:", referralCode)
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

      if (result.error) {
        console.error("Sign up error:", result.error)
        return result
      }

      if (result.data.user) {
        console.log("Sign up successful, creating profile in DB...")
        const dbProfile = await createUserProfileInDb(result.data.user, userData)

        if (dbProfile) {
          const fullProfile: UserProfile = { ...dbProfile, is_reseller: false, reseller_id: null }
          // Check reseller status (new user won't be a reseller yet unless specific logic is added)
          const { data: resellerData } = await supabase
            .from("resellers")
            .select("id")
            .eq("user_id", result.data.user.id)
            .single()
          if (resellerData) {
            fullProfile.is_reseller = true
            fullProfile.reseller_id = resellerData.id
          }
          setUserProfile(fullProfile)

          // If referral code is present, record the referral
          if (referralCode && result.data.user.id) {
            console.log(`Recording referral for user ${result.data.user.id} with code ${referralCode}`)
            try {
              const recordedReferral = await resellerService.recordReferral(
                referralCode,
                result.data.user.id,
                "signup", // conversion_type
                { plan: "starter" }, // conversion_details (example)
                // commissionAmount can be calculated or fixed, e.g., 5 for signup
                // Using default from resellerService for now
              )
              if (recordedReferral) {
                console.log("Referral recorded successfully:", recordedReferral)
              } else {
                console.warn("Failed to record referral or invalid referral code.")
              }
            } catch (referralError) {
              console.error("Error recording referral:", referralError)
              // Decide if this error should be surfaced to the user or just logged
            }
          }
        } else {
          console.error("Failed to create user profile in DB after signup.")
          // This is a critical issue, user auth exists but no DB profile.
          // Potentially return an error to the signup page.
          return { error: { message: "Failed to finalize account setup. Please contact support." } }
        }
      }
      return result
    } catch (error: any) {
      console.error("Error in signUp:", error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out user...")
      const result = await supabase.auth.signOut()
      setUserProfile(null) // Clear profile on sign out
      return result
    } catch (error) {
      console.error("Error in signOut:", error)
      return { error }
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return
    try {
      console.log("Updating user profile:", data)
      // Separate reseller fields from user fields
      const { is_reseller, reseller_id, ...userFieldsToUpdate } = data

      const { error } = await supabase
        .from("users")
        .update({
          ...userFieldsToUpdate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        return
      }
      const updatedProfile = await fetchUserProfileAndResellerStatus(user.id) // Re-fetch to get latest
      setUserProfile(updatedProfile)
    } catch (error) {
      console.error("Error in updateProfile:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log("Resetting password for:", email)
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/reset-password`,
      })
    } catch (error) {
      console.error("Error in resetPassword:", error)
      return { error }
    }
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
