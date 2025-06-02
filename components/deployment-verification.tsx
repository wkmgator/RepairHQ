"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Download, ExternalLink } from "lucide-react"

interface VerificationResult {
  service: string
  status: "success" | "warning" | "error"
  message: string
  details?: any
  timestamp: string
}

interface VerificationSummary {
  total: number
  success: number
  warning: number
  error: number
}

export default function DeploymentVerification() {
  const [results, setResults] = useState<VerificationResult[]>([])
  const [summary, setSummary] = useState<VerificationSummary>({ total: 0, success: 0, warning: 0, error: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyDeployment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/verify-deployment")
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        setSummary(data.summary)
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify deployment")
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    window.open("/api/admin/verify-deployment?format=report", "_blank")
  }

  useEffect(() => {
    verifyDeployment()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deployment Verification</h2>
        <div className="flex space-x-2">
          <Button onClick={verifyDeployment} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Verify
          </Button>
          <Button variant="outline" onClick={downloadReport} disabled={loading || results.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Summary</CardTitle>
            <CardDescription>Overall status of your deployment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold">{summary.total}</span>
                <span className="text-sm text-gray-500">Total Services</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                <span className="text-2xl font-bold text-green-600">{summary.success}</span>
                <span className="text-sm text-green-600">Success</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
                <span className="text-2xl font-bold text-yellow-600">{summary.warning}</span>
                <span className="text-sm text-yellow-600">Warnings</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                <span className="text-2xl font-bold text-red-600">{summary.error}</span>
                <span className="text-sm text-red-600">Errors</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="success">Success ({summary.success})</TabsTrigger>
          <TabsTrigger value="warning">Warnings ({summary.warning})</TabsTrigger>
          <TabsTrigger value="error">Errors ({summary.error})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {results.map((result, index) => (
            <Card key={`${result.service}-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  {getStatusIcon(result.status)}
                  <CardTitle className="ml-2">
                    {result.service.charAt(0).toUpperCase() + result.service.slice(1)}
                  </CardTitle>
                </div>
                {getStatusBadge(result.status)}
              </CardHeader>
              <CardContent>
                <p>{result.message}</p>
                {result.details && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="success" className="space-y-4 mt-4">
          {results
            .filter((r) => r.status === "success")
            .map((result, index) => (
              <Card key={`${result.service}-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <CardTitle className="ml-2">
                      {result.service.charAt(0).toUpperCase() + result.service.slice(1)}
                    </CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </CardHeader>
                <CardContent>
                  <p>{result.message}</p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="warning" className="space-y-4 mt-4">
          {results
            .filter((r) => r.status === "warning")
            .map((result, index) => (
              <Card key={`${result.service}-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <CardTitle className="ml-2">
                      {result.service.charAt(0).toUpperCase() + result.service.slice(1)}
                    </CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </CardHeader>
                <CardContent>
                  <p>{result.message}</p>
                  {result.details && (
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="error" className="space-y-4 mt-4">
          {results
            .filter((r) => r.status === "error")
            .map((result, index) => (
              <Card key={`${result.service}-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <CardTitle className="ml-2">
                      {result.service.charAt(0).toUpperCase() + result.service.slice(1)}
                    </CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </CardHeader>
                <CardContent>
                  <p>{result.message}</p>
                  {result.details && (
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/${result.service}`} target="_blank" rel="noopener noreferrer">
                      Configure {result.service}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
