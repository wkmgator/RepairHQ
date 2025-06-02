"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface VerificationResult {
  success: boolean
  message: string
  details?: any
}

interface VerificationResponse {
  success: boolean
  timestamp: string
  results: Record<string, VerificationResult>
  environment: Record<string, boolean>
}

export function SupabaseStatusDashboard() {
  const [verification, setVerification] = useState<VerificationResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const runVerification = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/verify-supabase")
      const data = await response.json()
      setVerification(data)
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runVerification()
  }, [])

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? "Healthy" : "Error"}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supabase System Status</h2>
          <p className="text-muted-foreground">Verify that all Supabase services are properly configured</p>
        </div>
        <Button onClick={runVerification} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Status
        </Button>
      </div>

      {verification && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(verification.success)}
                Overall System Status
              </CardTitle>
              <CardDescription>Last checked: {new Date(verification.timestamp).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              {getStatusBadge(verification.success)}
              {verification.success ? (
                <p className="mt-2 text-green-600">All Supabase services are operational</p>
              ) : (
                <p className="mt-2 text-red-600">Some services require attention</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(verification.results).map(([key, result]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getStatusIcon(result.success)}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                  {getStatusBadge(result.success)}
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground">View Details</summary>
                      <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Verify that all required environment variables are configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(verification.environment).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{key}</span>
                    {getStatusIcon(value)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
