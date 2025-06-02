"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { SystemTester } from "@/lib/system-testing"

interface SystemStatus {
  stripe: boolean
  supabase: boolean
  pos: boolean
  email: boolean
  seo: boolean
  pdf: boolean
  ai: boolean
  overall: boolean
}

export default function LaunchReadinessPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [testing, setTesting] = useState(false)

  const runSystemCheck = async () => {
    setTesting(true)
    try {
      const testResults = await SystemTester.runFullSystemTest()

      // Check additional systems
      const seoCheck = await fetch("/api/seo/health").then((r) => r.ok)
      const pdfCheck = await fetch("/api/pdf/health").then((r) => r.ok)
      const aiCheck = await fetch("/api/ai/health").then((r) => r.ok)

      const fullStatus: SystemStatus = {
        ...testResults,
        seo: seoCheck,
        pdf: pdfCheck,
        ai: aiCheck,
        overall: testResults.overall && seoCheck && pdfCheck && aiCheck,
      }

      setStatus(fullStatus)
    } catch (error) {
      console.error("System check failed:", error)
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    runSystemCheck()
  }, [])

  const getStatusIcon = (isReady: boolean) => {
    if (isReady) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (isReady: boolean) => {
    return <Badge variant={isReady ? "default" : "destructive"}>{isReady ? "Ready" : "Needs Work"}</Badge>
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🚀 Launch Readiness Dashboard</h1>
        <p className="text-gray-600">Complete system health check for RepairHQ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stripe Payments</CardTitle>
            {getStatusIcon(status.stripe)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Payments</span>
              {getStatusBadge(status.stripe)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supabase Database</CardTitle>
            {getStatusIcon(status.supabase)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Database</span>
              {getStatusBadge(status.supabase)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">POS System</CardTitle>
            {getStatusIcon(status.pos)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">POS</span>
              {getStatusBadge(status.pos)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email System</CardTitle>
            {getStatusIcon(status.email)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Email</span>
              {getStatusBadge(status.email)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO & Meta</CardTitle>
            {getStatusIcon(status.seo)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">SEO</span>
              {getStatusBadge(status.seo)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF Export</CardTitle>
            {getStatusIcon(status.pdf)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">PDF</span>
              {getStatusBadge(status.pdf)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.overall ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            )}
            Overall System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-4">
              {status.overall ? "🚀 READY TO LAUNCH!" : "⚠️ NEEDS ATTENTION"}
            </div>
            <p className="text-gray-600 mb-6">
              {status.overall
                ? "All systems are operational and ready for production launch."
                : "Some systems need attention before launching to production."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={runSystemCheck} disabled={testing}>
                {testing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Re-run System Check
              </Button>
              {status.overall && (
                <Button variant="default" size="lg">
                  🚀 LAUNCH TO PRODUCTION
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
