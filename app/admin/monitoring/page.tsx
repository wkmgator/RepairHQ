"use client"

import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { Shield } from "lucide-react"

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-gray-600">Monitor system health, performance, and backups</p>
        </div>
      </div>

      <MonitoringDashboard />
    </div>
  )
}
