"use client"

import { useState, useEffect } from "react"

interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  currency: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    layout: "grid" | "list"
    widgets: string[]
  }
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  currency: "USD",
  timezone: "America/New_York",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  dashboard: {
    layout: "grid",
    widgets: ["revenue", "tickets", "inventory", "customers"],
  },
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("userPreferences")
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({ ...defaultPreferences, ...parsed })
      } catch (error) {
        console.error("Error parsing user preferences:", error)
      }
    }
    setLoading(false)
  }, [])

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    localStorage.setItem("userPreferences", JSON.stringify(updated))
  }

  const resetPreferences = () => {
    setPreferences(defaultPreferences)
    localStorage.removeItem("userPreferences")
  }

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    loading,
  }
}
