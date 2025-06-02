"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, Unlink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickBooksIntegration {
  id: string
  qb_company_id: string
  company_name?: string
  is_active: boolean
  connected_at: string
  last_sync_at?: string
  expires_at: string
}

interface QuickBooksIntegrationProps {
  userId: string
  companyId: string
}

export function QuickBooksIntegration({ userId, companyId }: QuickBooksIntegrationProps) {
  const [integration, setIntegration] = useState<QuickBooksIntegration | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchIntegration()
  }, [userId, companyId])

  const fetchIntegration = async () => {
    try {
      const response = await fetch(`/api/quickbooks/integration?user_id=${userId}&company_id=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setIntegration(data.integration)
      }
    } catch (error) {
      console.error("Failed to fetch integration:", error)
    } finally {
      setLoading(false)
    }
  }

  const connectQuickBooks = async () => {
    setConnecting(true)
    try {
      const response = await fetch(`/api/quickbooks/auth?user_id=${userId}&company_id=${companyId}`)
      const data = await response.json()

      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        throw new Error("Failed to get auth URL")
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to QuickBooks. Please try again.",
        variant: "destructive",
      })
      setConnecting(false)
    }
  }

  const disconnectQuickBooks = async () => {
    try {
      const response = await fetch("/api/quickbooks/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, companyId }),
      })

      if (response.ok) {
        setIntegration(null)
        toast({
          title: "Disconnected",
          description: "QuickBooks integration has been disconnected.",
        })
      }
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect QuickBooks. Please try again.",
        variant: "destructive",
      })
    }
  }

  const syncTimeEntries = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/quickbooks/sync-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, companyId }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Sync Complete",
          description: `Synced ${data.syncedCount} time entries to QuickBooks.`,
        })
        fetchIntegration()
      } else {
        throw new Error("Sync failed")
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync time entries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const isTokenExpiring = (expiresAt: string) => {
    const expirationTime = new Date(expiresAt).getTime()
    const now = Date.now()
    const daysUntilExpiry = (expirationTime - now) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry < 7
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          QuickBooks Integration
          {integration?.is_active && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>Sync employee time tracking data with QuickBooks for payroll processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integration?.is_active ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connected to QuickBooks</p>
                <p className="text-sm text-muted-foreground">Company ID: {integration.qb_company_id}</p>
                <p className="text-sm text-muted-foreground">
                  Connected: {new Date(integration.connected_at).toLocaleDateString()}
                </p>
                {integration.last_sync_at && (
                  <p className="text-sm text-muted-foreground">
                    Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                  </p>
                )}
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            {isTokenExpiring(integration.expires_at) && (
              <Alert>
                <AlertDescription>
                  Your QuickBooks connection will expire soon. Please reconnect to continue syncing.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={syncTimeEntries} disabled={syncing} className="flex-1">
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Time Entries
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={disconnectQuickBooks}>
                <Unlink className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Not Connected</p>
              <p className="text-sm text-muted-foreground">Connect to QuickBooks to sync employee time tracking data</p>
            </div>
            <Button onClick={connectQuickBooks} disabled={connecting} className="w-full">
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect to QuickBooks"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
