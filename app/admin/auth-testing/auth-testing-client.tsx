"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, Loader2, Shield, User, Lock } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: string
}

export function AuthTestingClient() {
  const { user, userProfile, session, signOut } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTestResult = (name: string, status: TestResult["status"], message: string, details?: string) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.name === name)
      const newResult = { name, status, message, details }

      if (existing) {
        return prev.map((r) => (r.name === name ? newResult : r))
      } else {
        return [...prev, newResult]
      }
    })
  }

  const testProtectedRoute = async (route: string, expectedStatus = 200) => {
    try {
      const response = await fetch(route, {
        method: "GET",
        credentials: "include",
      })

      return {
        status: response.status,
        ok: response.ok,
        redirected: response.redirected,
        url: response.url,
      }
    } catch (error) {
      return {
        status: 0,
        ok: false,
        redirected: false,
        url: route,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const runAuthenticationTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Test 1: Current Authentication State
    updateTestResult(
      "Current Auth State",
      user ? "success" : "warning",
      user ? `Authenticated as ${user.email}` : "Not authenticated",
      user ? `User ID: ${user.id}, Role: ${userProfile?.role || "Unknown"}` : undefined,
    )

    // Test 2: Session Validity
    updateTestResult(
      "Session Validity",
      session ? "success" : "error",
      session ? "Valid session found" : "No valid session",
      session ? `Expires: ${new Date(session.expires_at! * 1000).toLocaleString()}` : undefined,
    )

    // Test 3: User Profile Data
    updateTestResult(
      "User Profile",
      userProfile ? "success" : "warning",
      userProfile ? "Profile loaded successfully" : "No profile data",
      userProfile ? `Plan: ${userProfile.plan}, Trial: ${userProfile.is_trial_active}` : undefined,
    )

    // Test 4: Protected Routes Access
    const protectedRoutes = [
      { path: "/dashboard", name: "Dashboard" },
      { path: "/customers", name: "Customers" },
      { path: "/inventory", name: "Inventory" },
      { path: "/appointments", name: "Appointments" },
      { path: "/settings", name: "Settings" },
    ]

    for (const route of protectedRoutes) {
      const result = await testProtectedRoute(route.path)

      if (user) {
        // Should have access
        updateTestResult(
          `Protected Route: ${route.name}`,
          result.ok ? "success" : "error",
          result.ok ? `Access granted to ${route.path}` : `Access denied to ${route.path}`,
          `Status: ${result.status}, Redirected: ${result.redirected}`,
        )
      } else {
        // Should be redirected to login
        updateTestResult(
          `Protected Route: ${route.name}`,
          result.redirected || result.status === 302 ? "success" : "error",
          result.redirected ? "Correctly redirected to login" : "Should redirect unauthenticated users",
          `Status: ${result.status}, URL: ${result.url}`,
        )
      }
    }

    // Test 5: Admin Routes (if user is admin)
    if (userProfile?.role === "admin") {
      const adminRoutes = [
        { path: "/admin", name: "Admin Dashboard" },
        { path: "/admin/users", name: "User Management" },
      ]

      for (const route of adminRoutes) {
        const result = await testProtectedRoute(route.path)
        updateTestResult(
          `Admin Route: ${route.name}`,
          result.ok ? "success" : "error",
          result.ok ? `Admin access granted to ${route.path}` : `Admin access denied to ${route.path}`,
          `Status: ${result.status}`,
        )
      }
    }

    // Test 6: API Endpoints
    const apiEndpoints = [
      { path: "/api/auth/session", name: "Session API" },
      { path: "/api/user/profile", name: "Profile API" },
    ]

    for (const endpoint of apiEndpoints) {
      const result = await testProtectedRoute(endpoint.path)
      updateTestResult(
        `API: ${endpoint.name}`,
        result.ok ? "success" : "warning",
        result.ok ? `API responding correctly` : `API issue detected`,
        `Status: ${result.status}, Response: ${result.ok ? "OK" : "Error"}`,
      )
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
      pending: "outline",
    } as const

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Current Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">User Status</p>
              <Badge variant={user ? "default" : "secondary"}>{user ? "Authenticated" : "Not Authenticated"}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Role</p>
              <Badge variant="outline">{userProfile?.role || "Unknown"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication Tests
          </CardTitle>
          <CardDescription>Run comprehensive tests to verify authentication flows and route protection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={runAuthenticationTests} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {isRunning ? "Running Tests..." : "Run Authentication Tests"}
            </Button>

            {user && (
              <Button variant="outline" onClick={() => signOut()} className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Sign Out (Test Unauthenticated State)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {testResults.filter((r) => r.status === "success").length} passed,{" "}
              {testResults.filter((r) => r.status === "error").length} failed,{" "}
              {testResults.filter((r) => r.status === "warning").length} warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{result.name}</p>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Tabs defaultValue="routes" className="w-full">
        <TabsList>
          <TabsTrigger value="routes">Test Routes</TabsTrigger>
          <TabsTrigger value="permissions">Test Permissions</TabsTrigger>
          <TabsTrigger value="api">Test APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Protection Tests</CardTitle>
              <CardDescription>Test access to protected routes based on authentication status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["/dashboard", "/customers", "/inventory", "/appointments", "/settings", "/admin"].map((route) => (
                  <Button key={route} variant="outline" size="sm" onClick={() => window.open(route, "_blank")}>
                    Test {route}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Tests</CardTitle>
              <CardDescription>Test role-based access control</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Current role: <strong>{userProfile?.role || "Unknown"}</strong>
                  {userProfile?.role === "admin" && " - You have admin access"}
                  {userProfile?.role === "manager" && " - You have manager access"}
                  {userProfile?.role === "customer" && " - You have customer access"}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Tests</CardTitle>
              <CardDescription>Test API authentication and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetch("/api/auth/session").then((r) => console.log("Session API:", r.status))}
                >
                  Test Session API
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetch("/api/user/profile").then((r) => console.log("Profile API:", r.status))}
                >
                  Test Profile API
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
