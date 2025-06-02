"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AIErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("AI Component Error:", error, errorInfo)

    // In production, you would send this to your error tracking service
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      // Send to error tracking service
      console.log("Sending error to tracking service:", {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <CardTitle>AI Component Error</CardTitle>
            </div>
            <CardDescription>An error occurred while loading this AI component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription>{this.state.error?.message || "An unexpected error occurred"}</AlertDescription>
            </Alert>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {this.state.error?.stack?.split("\n")[0]}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined })
                  window.location.reload()
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/ai-dashboard"
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>If this error persists, please try:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Clearing your browser cache</li>
                <li>Checking your internet connection</li>
                <li>Contacting support if the issue continues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
