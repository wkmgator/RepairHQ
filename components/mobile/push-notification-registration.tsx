"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import usePushNotifications from "@/hooks/usePushNotifications"

export function PushNotificationRegistration({ userId }: { userId: string }) {
  const {
    supported,
    permissionStatus,
    subscription,
    isRegistering,
    error,
    requestPermission,
    registerPushSubscription,
  } = usePushNotifications(userId)

  const [showBanner, setShowBanner] = useState(true)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  useEffect(() => {
    // Check if already registered
    if (subscription) {
      setRegistrationComplete(true)
    }

    // Check if we should show the banner
    const hideNotificationBanner = localStorage.getItem("hideNotificationBanner")
    if (hideNotificationBanner === "true") {
      setShowBanner(false)
    }
  }, [subscription])

  const handleRegister = async () => {
    const success = await registerPushSubscription()
    if (success) {
      setRegistrationComplete(true)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem("hideNotificationBanner", "true")
  }

  if (!showBanner || !supported || permissionStatus === "denied" || registrationComplete) {
    return null
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Enable Push Notifications
        </CardTitle>
        <CardDescription>Get real-time updates about your tickets and appointments</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          Stay updated with push notifications for new assignments, customer messages, and important alerts.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          Not Now
        </Button>
        <Button onClick={handleRegister} disabled={isRegistering} size="sm">
          {isRegistering ? "Enabling..." : "Enable Notifications"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PushNotificationRegistration
