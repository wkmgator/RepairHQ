"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database, ExternalLink } from "lucide-react"
import type { VerificationResult } from "@/lib/supabase-verification" // Assuming this type exists

interface DbStatus {
  configured: boolean
  connected?: boolean // Optional for Supabase as it has sub-checks
  message: string
  details: Record<string, any>
  connection?: VerificationResult // For Supabase
  serviceRole?: VerificationResult // For Supabase
}

interface DbCheckResponse {
  postgresql: DbStatus
  supabase: DbStatus
}

export default function DbStatusChecker() {
  const [dbStatus, setDbStatus] = useState<DbCheckResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null) // 'postgresql' or 'supabase'

  const fetchDbStatus = async (serviceToTest?: string) => {
    if (!serviceToTest) setLoading(true)
    if (serviceToTest) setTesting(serviceToTest)

    try {
      const response = await fetch("/api/admin/db-check")
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      const data: DbCheckResponse = await response.json()
      setDbStatus(data)
    } catch (error: any) {
      console.error("Failed to fetch DB status:", error)
      // Set error state for display
      const errorMsg = `Failed to load status: ${error.message}`
      setDbStatus({
        postgresql: { configured: false, connected: false, message: errorMsg, details: {} },
        supabase: {
          configured: false,
          connection: { success: false, message: errorMsg },
          serviceRole: { success: false, message: errorMsg },
          message: errorMsg,
          details: {},
        },
      })
    } finally {
      if (!serviceToTest) setLoading(false)
      if (serviceToTest) setTesting(null)
    }
  }

  useEffect(() => {
    fetchDbStatus()
  }, [])

  const renderStatusIcon = (success: boolean) =>
    success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />

  const renderStatusBadge = (status: boolean | undefined, configured: boolean) => {
    if (!configured) return <Badge variant="outline">Not Configured</Badge>
    if (status === undefined) return <Badge variant="secondary">Pending</Badge> // For Supabase sub-checks
    return (
      <Badge className={status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {status ? "Connected" : "Error"}
      </Badge>
    )
  }

  if (loading && !dbStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading Database Status...</p>
      </div>
    )
  }

  if (!dbStatus) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not load database status. Please try refreshing the page.</AlertDescription>
      </Alert>
    )
  }

  const overallPostgresStatus = dbStatus.postgresql.configured && dbStatus.postgresql.connected
  const overallSupabaseStatus =
    dbStatus.supabase.configured && dbStatus.supabase.connection?.success && dbStatus.supabase.serviceRole?.success

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Health Check</h1>
          <p className="text-muted-foreground">Verify the status and configuration of your database connections.</p>
        </div>
        <Button onClick={() => fetchDbStatus()} disabled={loading || !!testing}>
          {loading && !testing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PostgreSQL Card */}
        <Card
          className={
            !dbStatus.postgresql.configured || !dbStatus.postgresql.connected ? "border-red-500" : "border-green-500"
          }
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <Database className="h-6 w-6 mr-2" />
                PostgreSQL Status
              </CardTitle>
              {renderStatusBadge(dbStatus.postgresql.connected, dbStatus.postgresql.configured)}
            </div>
            <CardDescription>{dbStatus.postgresql.message}</CardDescription>
          </CardHeader>
          {dbStatus.postgresql.configured && (
            <CardContent className="space-y-3">
              <h4 className="font-semibold text-sm">Configuration:</h4>
              <div className="text-xs font-mono bg-muted p-2 rounded space-y-1">
                <p>Host: {dbStatus.postgresql.details.host || "N/A"}</p>
                <p>Database: {dbStatus.postgresql.details.database || "N/A"}</p>
                <p>User: {dbStatus.postgresql.details.user || "N/A"}</p>
              </div>
              {dbStatus.postgresql.details.error && (
                <Alert variant="destructive" className="mt-2">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription className="text-xs break-all">{dbStatus.postgresql.details.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          )}
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDbStatus("postgresql")}
              disabled={testing === "postgresql" || !dbStatus.postgresql.configured}
            >
              {testing === "postgresql" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test PostgreSQL
            </Button>
          </CardFooter>
        </Card>

        {/* Supabase Card */}
        <Card className={!overallSupabaseStatus ? "border-red-500" : "border-green-500"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-xl">
                <Database className="h-6 w-6 mr-2" />
                Supabase Status
              </CardTitle>
              {renderStatusBadge(overallSupabaseStatus, dbStatus.supabase.configured)}
            </div>
            <CardDescription>
              {dbStatus.supabase.connection?.message || dbStatus.supabase.message}
              {dbStatus.supabase.serviceRole?.message &&
              dbStatus.supabase.connection?.message !== dbStatus.supabase.serviceRole?.message
                ? ` | Service Role: ${dbStatus.supabase.serviceRole.message}`
                : ""}
            </CardDescription>
          </CardHeader>
          {dbStatus.supabase.configured && (
            <CardContent className="space-y-3">
              <h4 className="font-semibold text-sm">Configuration:</h4>
              <div className="text-xs font-mono bg-muted p-2 rounded space-y-1 break-all">
                <p>Project URL: {dbStatus.supabase.details.projectUrl || "N/A"}</p>
                <p>Anon Key: {dbStatus.supabase.details.anonKeyConfigured ? "Configured" : "Missing"}</p>
                <p>Service Role Key: {dbStatus.supabase.details.serviceRoleKeyConfigured ? "Configured" : "Missing"}</p>
              </div>

              <div className="space-y-2 mt-2">
                {dbStatus.supabase.connection && (
                  <Alert variant={dbStatus.supabase.connection.success ? "default" : "destructive"}>
                    {dbStatus.supabase.connection.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>Client Connection</AlertTitle>
                    <AlertDescription className="text-xs break-all">
                      {dbStatus.supabase.connection.message}
                    </AlertDescription>
                  </Alert>
                )}
                {dbStatus.supabase.serviceRole && (
                  <Alert variant={dbStatus.supabase.serviceRole.success ? "default" : "destructive"}>
                    {dbStatus.supabase.serviceRole.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>Service Role Connection</AlertTitle>
                    <AlertDescription className="text-xs break-all">
                      {dbStatus.supabase.serviceRole.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {dbStatus.supabase.details.error && (
                <Alert variant="destructive" className="mt-2">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription className="text-xs break-all">{dbStatus.supabase.details.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          )}
          <CardFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDbStatus("supabase")}
              disabled={testing === "supabase" || !dbStatus.supabase.configured}
            >
              {testing === "supabase" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Supabase
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href={dbStatus.supabase.details.projectUrl || "https://supabase.com/dashboard"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
