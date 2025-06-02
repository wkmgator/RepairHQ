import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Web Push configuration
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ""

export interface PushSubscription {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  vibrate?: number[]
  data?: Record<string, any>
  actions?: {
    action: string
    title: string
    icon?: string
  }[]
  tag?: string
  requireInteraction?: boolean
  renotify?: boolean
  silent?: boolean
  timestamp?: number
}

export async function saveSubscription(
  userId: string,
  subscription: PushSubscription,
  deviceInfo: {
    deviceType: string
    browser: string
    osVersion: string
  },
): Promise<boolean> {
  try {
    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: userId,
      subscription: subscription,
      device_info: deviceInfo,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
    })

    return !error
  } catch (error) {
    console.error("Error saving subscription:", error)
    return false
  }
}

export async function sendNotification(
  userId: string,
  payload: NotificationPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, you would use web-push library
    // This is a simplified version for demonstration

    // Fetch user's subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId)

    if (error || !subscriptions?.length) {
      return {
        success: false,
        error: error?.message || "No subscriptions found",
      }
    }

    // In a real implementation, you would send the notification to each subscription
    // using the web-push library

    // For testing purposes, we'll just log the payload
    console.log("Sending notification to user:", userId)
    console.log("Notification payload:", payload)
    console.log("Subscriptions:", subscriptions.length)

    // Record the notification in the database
    await supabase.from("notifications").insert({
      user_id: userId,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      sent_at: new Date().toISOString(),
      read: false,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getNotificationHistory(userId: string, limit = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching notification history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching notification history:", error)
    return []
  }
}

export function getVapidPublicKey(): string {
  return vapidPublicKey
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    return !error
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}
