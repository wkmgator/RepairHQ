"use client"

import { useState, useEffect } from "react"
import { getVapidPublicKey } from "@/lib/push-notification-service"

export function usePushNotifications(userId: string) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    const isPushSupported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

    setSupported(isPushSupported)

    if (isPushSupported) {
      // Check permission status
      setPermissionStatus(Notification.permission)

      // Check if service worker is registered
      navigator.serviceWorker.ready
        .then((registration) => {
          // Get existing subscription
          registration.pushManager.getSubscription().then((existingSubscription) => {
            setSubscription(existingSubscription)
          })
        })
        .catch((err) => {
          console.error("Error checking service worker registration:", err)
          setError("Service worker not registered")
        })
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!supported) {
      setError("Push notifications are not supported in this browser")
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
      return permission === "granted"
    } catch (err) {
      console.error("Error requesting notification permission:", err)
      setError("Failed to request notification permission")
      return false
    }
  }

  const registerPushSubscription = async (): Promise<boolean> => {
    if (!supported || !userId) {
      setError("Push notifications not supported or user not logged in")
      return false
    }

    if (permissionStatus !== "granted") {
      const granted = await requestPermission()
      if (!granted) {
        setError("Notification permission denied")
        return false
      }
    }

    setIsRegistering(true)
    setError(null)

    try {
      // Make sure service worker is registered
      const registration = await navigator.serviceWorker.ready

      // Get VAPID public key
      const vapidPublicKey = getVapidPublicKey()

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      setSubscription(newSubscription)

      // Get device info
      const deviceInfo = {
        deviceType: /Android/i.test(navigator.userAgent)
          ? "Android"
          : /iPhone|iPad|iPod/i.test(navigator.userAgent)
            ? "iOS"
            : "Desktop",
        browser: getBrowserInfo(),
        osVersion: getOSVersion(),
      }

      // Send subscription to server
      const response = await fetch("/api/push/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          subscription: newSubscription.toJSON(),
          deviceInfo,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to register subscription")
      }

      return true
    } catch (err) {
      console.error("Error registering push subscription:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    } finally {
      setIsRegistering(false)
    }
  }

  const unregisterPushSubscription = async (): Promise<boolean> => {
    if (!subscription) {
      return true
    }

    try {
      await subscription.unsubscribe()
      setSubscription(null)

      // TODO: Remove subscription from server

      return true
    } catch (err) {
      console.error("Error unregistering push subscription:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      return false
    }
  }

  // Helper function to convert base64 to Uint8Array
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  // Helper function to get browser info
  function getBrowserInfo(): string {
    const userAgent = navigator.userAgent

    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Edge")) return "Edge"
    if (userAgent.includes("Opera")) return "Opera"

    return "Unknown"
  }

  // Helper function to get OS version
  function getOSVersion(): string {
    const userAgent = navigator.userAgent

    if (userAgent.includes("Android")) {
      const match = userAgent.match(/Android (\d+(\.\d+)*)/)
      return match ? match[1] : "Android"
    }

    if (userAgent.includes("iPhone") || userAgent.includes("iPad") || userAgent.includes("iPod")) {
      const match = userAgent.match(/OS (\d+[_]\d+[_]?\d*)/)
      return match ? match[1].replace(/_/g, ".") : "iOS"
    }

    if (userAgent.includes("Windows")) {
      const match = userAgent.match(/Windows NT (\d+\.\d+)/)
      return match ? `Windows ${match[1]}` : "Windows"
    }

    if (userAgent.includes("Mac OS X")) {
      const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/)
      return match ? `macOS ${match[1].replace(/_/g, ".")}` : "macOS"
    }

    if (userAgent.includes("Linux")) return "Linux"

    return "Unknown"
  }

  return {
    supported,
    permissionStatus,
    subscription,
    isRegistering,
    error,
    requestPermission,
    registerPushSubscription,
    unregisterPushSubscription,
  }
}

export default usePushNotifications
