"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wifi, Router, Smartphone, CheckCircle, AlertTriangle, Info, ArrowRight, Clock } from "lucide-react"

interface WiFiQuickStartProps {
  onStartSetup: () => void
}

export default function WiFiQuickStart({ onStartSetup }: WiFiQuickStartProps) {
  const [checklist, setChecklist] = useState({
    printerPowered: false,
    wifiCredentials: false,
    printerInRange: false,
    routerBroadcasting: false,
  })

  const updateChecklist = (item: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allChecked = Object.values(checklist).every(Boolean)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Wifi className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Star TSP100 WiFi Setup</h1>
        <p className="text-lg text-gray-600">Let's connect your thermal printer to WiFi in just a few minutes</p>

        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge variant="secondary" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            ~5 minutes
          </Badge>
          <Badge variant="secondary">5 Easy Steps</Badge>
          <Badge variant="secondary">Guided Setup</Badge>
        </div>
      </div>

      {/* Pre-Setup Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Pre-Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 mb-4">
            Before we begin, let's make sure everything is ready for a smooth setup process.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                checklist.printerPowered ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateChecklist("printerPowered")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checklist.printerPowered ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}
                >
                  {checklist.printerPowered && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <h4 className="font-medium">Printer Powered On</h4>
                  <p className="text-sm text-gray-500">Star TSP100 is plugged in and powered on</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                checklist.wifiCredentials ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateChecklist("wifiCredentials")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checklist.wifiCredentials ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}
                >
                  {checklist.wifiCredentials && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <h4 className="font-medium">WiFi Credentials Ready</h4>
                  <p className="text-sm text-gray-500">Network name and password available</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                checklist.printerInRange ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateChecklist("printerInRange")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checklist.printerInRange ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}
                >
                  {checklist.printerInRange && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <h4 className="font-medium">Printer in WiFi Range</h4>
                  <p className="text-sm text-gray-500">Within good signal range of router</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                checklist.routerBroadcasting ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => updateChecklist("routerBroadcasting")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checklist.routerBroadcasting ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}
                >
                  {checklist.routerBroadcasting && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <h4 className="font-medium">Router Broadcasting</h4>
                  <p className="text-sm text-gray-500">Network name is visible to devices</p>
                </div>
              </div>
            </div>
          </div>

          {allChecked && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Great! Everything looks ready. You can now start the WiFi setup process.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Setup Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            What We'll Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Scan", desc: "Find WiFi networks", icon: <Router className="h-5 w-5" /> },
              { step: 2, title: "Select", desc: "Choose your network", icon: <Wifi className="h-5 w-5" /> },
              { step: 3, title: "Secure", desc: "Enter password", icon: <CheckCircle className="h-5 w-5" /> },
              { step: 4, title: "Configure", desc: "Set IP settings", icon: <Smartphone className="h-5 w-5" /> },
              { step: 5, title: "Connect", desc: "Apply & test", icon: <CheckCircle className="h-5 w-5" /> },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Make sure your Star TSP100 model supports WiFi (TSP143IIIW). The setup process
          will configure the printer's internal WiFi module.
        </AlertDescription>
      </Alert>

      {/* Start Button */}
      <div className="text-center">
        <Button onClick={onStartSetup} disabled={!allChecked} size="lg" className="flex items-center px-8 py-3">
          {allChecked ? (
            <>
              <ArrowRight className="h-5 w-5 mr-2" />
              Start WiFi Setup
            </>
          ) : (
            <>Complete checklist to continue</>
          )}
        </Button>

        {!allChecked && (
          <p className="text-sm text-gray-500 mt-2">Please check all items above before starting the setup process</p>
        )}
      </div>
    </div>
  )
}
