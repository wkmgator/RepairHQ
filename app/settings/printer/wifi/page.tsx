"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StarWiFiSetupWizard from "@/components/star-wifi-setup-wizard"
import StarWiFiMonitor from "@/components/star-wifi-monitor"
import NetworkDiagnostics from "@/components/network-diagnostics"

export default function WiFiSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Star TSP100 WiFi Management</h1>
          <p className="text-gray-600 mt-2">Configure and monitor WiFi connectivity for your Star TSP100 printer</p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">WiFi Setup</TabsTrigger>
            <TabsTrigger value="monitor">Connection Monitor</TabsTrigger>
            <TabsTrigger value="diagnostics">Network Diagnostics</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <StarWiFiSetupWizard />
          </TabsContent>

          <TabsContent value="monitor" className="mt-6">
            <StarWiFiMonitor />
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-6">
            <NetworkDiagnostics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
