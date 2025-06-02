"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wifi, Search, Router, Lock, Settings, Zap, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface SetupStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "active" | "completed" | "error"
  estimatedTime: string
}

interface WiFiSetupProgressProps {
  currentStep: number
  isScanning?: boolean
  isConnecting?: boolean
  connectionProgress?: number
  error?: string
}

export default function WiFiSetupProgress({
  currentStep,
  isScanning = false,
  isConnecting = false,
  connectionProgress = 0,
  error,
}: WiFiSetupProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  const steps: SetupStep[] = [
    {
      id: "scan",
      title: "Scanning Networks",
      description: "Discovering available WiFi networks in your area",
      icon: <Search className="h-5 w-5" />,
      status: currentStep > 0 ? "completed" : currentStep === 0 ? "active" : "pending",
      estimatedTime: "30 seconds",
    },
    {
      id: "select",
      title: "Select Network",
      description: "Choose your WiFi network from the discovered list",
      icon: <Router className="h-5 w-5" />,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending",
      estimatedTime: "1 minute",
    },
    {
      id: "credentials",
      title: "Enter Credentials",
      description: "Provide your WiFi password and security settings",
      icon: <Lock className="h-5 w-5" />,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending",
      estimatedTime: "1 minute",
    },
    {
      id: "configure",
      title: "Network Settings",
      description: "Configure IP address and DNS settings",
      icon: <Settings className="h-5 w-5" />,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending",
      estimatedTime: "2 minutes",
    },
    {
      id: "connect",
      title: "Connecting",
      description: "Applying settings and establishing WiFi connection",
      icon: <Zap className="h-5 w-5" />,
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "active" : "pending",
      estimatedTime: "1 minute",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "active":
        return "text-blue-600 bg-blue-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (step: SetupStep) => {
    if (error && step.status === "active") {
      return <AlertCircle className="h-5 w-5 text-red-600" />
    }
    if (step.status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    if (step.status === "active") {
      return <div className="animate-pulse">{step.icon}</div>
    }
    return step.icon
  }

  const overallProgress = ((currentStep + 1) / steps.length) * 100

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Wifi className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">WiFi Setup Progress</h3>
            <p className="text-sm text-gray-500">Setting up your Star TSP100 printer</p>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Elapsed: {formatTime(elapsedTime)}</span>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Current Step Details */}
          {isConnecting && currentStep === 4 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Connection Progress</span>
                <span>{Math.round(connectionProgress)}%</span>
              </div>
              <Progress value={connectionProgress} className="w-full" />
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  step.status === "active" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>{getStatusIcon(step)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    {step.status === "active" && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>

                  {/* Special status messages */}
                  {step.status === "active" && index === 0 && isScanning && (
                    <p className="text-xs text-blue-600 mt-1 animate-pulse">Scanning for networks...</p>
                  )}

                  {step.status === "active" && index === 4 && isConnecting && (
                    <p className="text-xs text-blue-600 mt-1 animate-pulse">Establishing connection...</p>
                  )}

                  {error && step.status === "active" && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>

                {step.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 text-sm mb-1">💡 Current Step Tip</h4>
            <p className="text-xs text-yellow-700">
              {currentStep === 0 && "Make sure your router is powered on and broadcasting its network name."}
              {currentStep === 1 &&
                "Look for your network name in the list. If it's hidden, you can enter it manually."}
              {currentStep === 2 && "WiFi passwords are case-sensitive. Double-check your password."}
              {currentStep === 3 && "DHCP (automatic) is recommended unless you need a specific IP address."}
              {currentStep === 4 && "This may take up to 60 seconds. Please don't power off the printer."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
