"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Clock, Send, Bell, BellOff, RefreshCw } from "lucide-react"
import usePushNotifications from "@/hooks/usePushNotifications"

interface NotificationHistoryItem {
  id: string
  title: string
  body: string
  sent_at: string
  read: boolean
  data?: Record<string, any>
}

export default function PushNotificationTester({ userId }: { userId: string }) {
  const {
    supported,
    permissionStatus,
    subscription,
    isRegistering,
    error,
    requestPermission,
    registerPushSubscription,
    unregisterPushSubscription,
  } = usePushNotifications(userId)

  const [notificationTitle, setNotificationTitle] = useState("RepairHQ Test Notification")
  const [notificationBody, setNotificationBody] = useState("This is a test notification from RepairHQ")
  const [notificationImage, setNotificationImage] = useState("")
  const [notificationActions, setNotificationActions] = useState(true)
  const [notificationVibrate, setNotificationVibrate] = useState(true)
  const [notificationRequireInteraction, setNotificationRequireInteraction] = useState(false)
  const [notificationSilent, setNotificationSilent] = useState(false)
  const [notificationTag, setNotificationTag] = useState("test")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load notification history
  useEffect(() => {
    if (userId) {
      loadNotificationHistory()
    }
  }, [userId])

  const loadNotificationHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch(`/api/push/history?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setNotificationHistory(data.notifications || [])
      }
    } catch (error) {
      console.error("Error loading notification history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleRegister = async () => {
    const success = await registerPushSubscription()
    if (success) {
      // Show success message
    }
  }

  const handleUnregister = async () => {
    const success = await unregisterPushSubscription()
    if (success) {
      // Show success message
    }
  }

  const handleSendTestNotification = async () => {
    if (!subscription) {
      setSendResult({
        success: false,
        message: "No active subscription. Please register first.",
      })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      const notification = {
        title: notificationTitle,
        body: notificationBody,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        image: notificationImage || undefined,
        vibrate: notificationVibrate ? [100, 50, 100, 50, 100] : undefined,
        requireInteraction: notificationRequireInteraction,
        silent: notificationSilent,
        tag: notificationTag || "test",
        data: {
          url: "/mobile/dashboard",
          timestamp: Date.now(),
        },
        actions: notificationActions
          ? [
              {
                action: "view",
                title: "View Details",
                icon: "/icons/view.png",
              },
              {
                action: "dismiss",
                title: "Dismiss",
                icon: "/icons/dismiss.png",
              },
            ]
          : undefined,
      }

      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          notification,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSendResult({
          success: true,
          message: "Notification sent successfully!",
        })

        // Refresh notification history
        setTimeout(loadNotificationHistory, 1000)
      } else {
        setSendResult({
          success: false,
          message: result.error || "Failed to send notification",
        })
      }
    } catch (error) {
      console.error("Error sending test notification:", error)
      setSendResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSending(false)
    }
  }

  const getStatusIcon = () => {
    if (!supported) return <XCircle className="h-5 w-5 text-red-500" />
    if (permissionStatus === "granted" && subscription) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (permissionStatus === "denied") return <BellOff className="h-5 w-5 text-red-500" />
    return <Bell className="h-5 w-5 text-amber-500" />
  }

  const getStatusText = () => {
    if (!supported) return "Not Supported"
    if (permissionStatus === "granted" && subscription) return "Enabled"
    if (permissionStatus === "denied") return "Blocked"
    if (permissionStatus === "granted") return "Permission Granted (Not Registered)"
    return "Not Enabled"
  }

  const getStatusColor = () => {
    if (!supported) return "bg-red-100 text-red-800"
    if (permissionStatus === "granted" && subscription) return "bg-green-100 text-green-800"
    if (permissionStatus === "denied") return "bg-red-100 text-red-800"
    return "bg-amber-100 text-amber-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Push Notification Testing</CardTitle>
              <CardDescription>Test push notifications on Android devices</CardDescription>
            </div>
            <Badge className={getStatusColor()}>
              <span className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!supported && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Supported</AlertTitle>
              <AlertDescription>Push notifications are not supported in this browser or device.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="register">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="register">Registration</TabsTrigger>
              <TabsTrigger value="test">Send Test</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Browser Support</h3>
                    <p className="text-sm text-muted-foreground">{supported ? "Supported" : "Not Supported"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Permission Status</h3>
                    <p className="text-sm text-muted-foreground">{permissionStatus || "Not Requested"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Subscription Status</h3>
                    <p className="text-sm text-muted-foreground">{subscription ? "Active" : "Not Active"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">User ID</h3>
                    <p className="text-sm text-muted-foreground truncate">{userId || "Not Available"}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={requestPermission}
                  disabled={!supported || permissionStatus === "granted" || permissionStatus === "denied"}
                >
                  Request Permission
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={!supported || permissionStatus !== "granted" || isRegistering || !!subscription}
                >
                  {isRegistering ? "Registering..." : "Register for Notifications"}
                </Button>
                <Button variant="outline" onClick={handleUnregister} disabled={!subscription}>
                  Unregister
                </Button>
              </div>

              {subscription && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Active Subscription Details</h3>
                  <div className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-32">
                    <pre>{JSON.stringify(subscription, null, 2)}</pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="test" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Notification Title</Label>
                    <Input
                      id="title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="body">Notification Body</Label>
                    <Textarea
                      id="body"
                      value={notificationBody}
                      onChange={(e) => setNotificationBody(e.target.value)}
                      placeholder="Enter notification body text"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL (Optional)</Label>
                    <Input
                      id="image"
                      value={notificationImage}
                      onChange={(e) => setNotificationImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tag">Notification Tag</Label>
                    <Input
                      id="tag"
                      value={notificationTag}
                      onChange={(e) => setNotificationTag(e.target.value)}
                      placeholder="notification-tag"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Notification Options</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="actions" className="cursor-pointer">
                      Include Action Buttons
                    </Label>
                    <Switch id="actions" checked={notificationActions} onCheckedChange={setNotificationActions} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="vibrate" className="cursor-pointer">
                      Vibration
                    </Label>
                    <Switch id="vibrate" checked={notificationVibrate} onCheckedChange={setNotificationVibrate} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireInteraction" className="cursor-pointer">
                      Require Interaction
                    </Label>
                    <Switch
                      id="requireInteraction"
                      checked={notificationRequireInteraction}
                      onCheckedChange={setNotificationRequireInteraction}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="silent" className="cursor-pointer">
                      Silent Notification
                    </Label>
                    <Switch id="silent" checked={notificationSilent} onCheckedChange={setNotificationSilent} />
                  </div>
                </div>
              </div>

              {sendResult && (
                <Alert variant={sendResult.success ? "default" : "destructive"}>
                  {sendResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle>{sendResult.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{sendResult.message}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Notification History</h3>
                <Button variant="outline" size="sm" onClick={loadNotificationHistory} disabled={isLoadingHistory}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoadingHistory ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : notificationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No notification history found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {notificationHistory.map((item) => (
                    <Card key={item.id} className={item.read ? "opacity-70" : ""}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.body}</p>
                          </div>
                          <Badge variant={item.read ? "outline" : "default"} className="ml-2">
                            {item.read ? "Read" : "Unread"}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(item.sent_at).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button onClick={handleSendTestNotification} disabled={!supported || !subscription || isSending}>
            {isSending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Notification
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
