"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Wifi, Router, Settings, RefreshCw, Shield, Signal, Globe, Zap } from "lucide-react"

interface TroubleshootingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "easy" | "medium" | "hard"
  category: "connection" | "signal" | "security" | "configuration"
}

export default function WiFiTroubleshootingGuide() {
  const troubleshootingSteps: TroubleshootingStep[] = [
    {
      id: "check-power",
      title: "Check Printer Power",
      description: "Ensure the Star TSP100 printer is powered on and the WiFi indicator light is active.",
      icon: <Zap className="h-5 w-5" />,
      difficulty: "easy",
      category: "connection",
    },
    {
      id: "verify-credentials",
      title: "Verify WiFi Credentials",
      description: "Double-check that the WiFi network name (SSID) and password are correct and case-sensitive.",
      icon: <Shield className="h-5 w-5" />,
      difficulty: "easy",
      category: "security",
    },
    {
      id: "check-signal",
      title: "Check Signal Strength",
      description:
        "Move the printer closer to the router or remove obstacles that might interfere with the WiFi signal.",
      icon: <Signal className="h-5 w-5" />,
      difficulty: "easy",
      category: "signal",
    },
    {
      id: "restart-printer",
      title: "Restart Printer",
      description: "Power cycle the printer by turning it off for 30 seconds, then turning it back on.",
      icon: <RefreshCw className="h-5 w-5" />,
      difficulty: "easy",
      category: "connection",
    },
    {
      id: "check-router",
      title: "Check Router Settings",
      description: "Verify that the router is broadcasting the SSID and not hiding the network name.",
      icon: <Router className="h-5 w-5" />,
      difficulty: "medium",
      category: "configuration",
    },
    {
      id: "mac-filtering",
      title: "Check MAC Address Filtering",
      description: "If your router uses MAC filtering, add the printer's MAC address to the allowed devices list.",
      icon: <Settings className="h-5 w-5" />,
      difficulty: "medium",
      category: "security",
    },
    {
      id: "frequency-band",
      title: "Check Frequency Band",
      description: "Ensure your router's 2.4GHz band is enabled, as some Star TSP100 models only support 2.4GHz.",
      icon: <Wifi className="h-5 w-5" />,
      difficulty: "medium",
      category: "configuration",
    },
    {
      id: "firewall-settings",
      title: "Check Firewall Settings",
      description: "Verify that your router's firewall isn't blocking the printer's connection attempts.",
      icon: <Shield className="h-5 w-5" />,
      difficulty: "hard",
      category: "security",
    },
    {
      id: "ip-conflicts",
      title: "Resolve IP Conflicts",
      description: "Check for IP address conflicts and consider using DHCP reservation for the printer.",
      icon: <Globe className="h-5 w-5" />,
      difficulty: "hard",
      category: "configuration",
    },
  ]

  const commonIssues = [
    {
      issue: "Printer not found during network scan",
      solutions: [
        "Ensure printer is powered on and WiFi is enabled",
        "Check if printer is in setup/pairing mode",
        "Verify printer model supports WiFi (TSP143IIIW)",
        "Try scanning from a device closer to the printer",
      ],
    },
    {
      issue: "Connection fails with correct password",
      solutions: [
        "Verify password is case-sensitive and correct",
        "Check for special characters in password",
        "Try connecting to a different network to test",
        "Reset printer network settings and try again",
      ],
    },
    {
      issue: "Weak or unstable WiFi signal",
      solutions: [
        "Move printer closer to the router",
        "Remove physical obstacles between printer and router",
        "Check for interference from other devices",
        "Consider using a WiFi extender or mesh network",
      ],
    },
    {
      issue: "Printer connects but can't print",
      solutions: [
        "Check if printer has a valid IP address",
        "Verify network allows device-to-device communication",
        "Test with a different device on the same network",
        "Check printer driver and software configuration",
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "default"
      case "medium":
        return "secondary"
      case "hard":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "connection":
        return <Wifi className="h-4 w-4" />
      case "signal":
        return <Signal className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "configuration":
        return <Settings className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Fixes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Quick Fixes (Try These First)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {troubleshootingSteps
              .filter((step) => step.difficulty === "easy")
              .map((step) => (
                <div key={step.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{step.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getDifficultyColor(step.difficulty)} className="text-xs">
                        {step.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        {getCategoryIcon(step.category)}
                        <span className="capitalize">{step.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-orange-600" />
            Advanced Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshootingSteps
              .filter((step) => step.difficulty !== "easy")
              .map((step) => (
                <div key={step.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{step.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{step.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getDifficultyColor(step.difficulty)} className="text-xs">
                          {step.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          {getCategoryIcon(step.category)}
                          <span className="capitalize">{step.category}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Issues & Solutions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {commonIssues.map((item, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-red-700">{item.issue}</h4>
                <div className="space-y-2">
                  {item.solutions.map((solution, solutionIndex) => (
                    <div key={solutionIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{solution}</span>
                    </div>
                  ))}
                </div>
                {index < commonIssues.length - 1 && <hr className="border-gray-200" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* When to Contact Support */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Need Additional Help?</strong> If you've tried all the troubleshooting steps and still can't connect
          your Star TSP100 to WiFi, contact RepairHQ support or your network administrator. Have your printer model
          number, network name, and error messages ready.
        </AlertDescription>
      </Alert>
    </div>
  )
}
