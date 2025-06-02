"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Smartphone,
  Wrench,
  Clock,
  Camera,
  QrCode,
  Wifi,
  WifiOff,
  Upload,
  CheckCircle,
  Users,
  Package,
  TrendingUp,
} from "lucide-react"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import { OfflineStatusIndicator } from "@/components/offline-status-indicator"
import { PushNotificationRegistration } from "@/components/mobile/push-notification-registration"

interface MobileDashboardProps {
  userId: string
  userRole: string
  storeId: string
}

export function MobileDashboard({ userId, userRole, storeId }: MobileDashboardProps) {
  const isOnline = useOnlineStatus()
  const { data: offlineData, syncStatus, syncOfflineData } = useIndexedDB("repairhq-mobile")
  const [todayStats, setTodayStats] = useState({
    ticketsAssigned: 0,
    ticketsCompleted: 0,
    hoursWorked: 0,
    efficiency: 0,
  })
  const [quickActions, setQuickActions] = useState<any[]>([])
  const [recentTickets, setRecentTickets] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [userId, storeId])

  const loadDashboardData = async () => {
    // Load dashboard data based on user role
    if (userRole === "technician") {
      await loadTechnicianData()
    } else if (userRole === "manager") {
      await loadManagerData()
    }
  }

  const loadTechnicianData = async () => {
    // Mock data - replace with actual API calls
    setTodayStats({
      ticketsAssigned: 8,
      ticketsCompleted: 5,
      hoursWorked: 6.5,
      efficiency: 87,
    })

    setQuickActions([
      { id: 1, title: "Clock In", icon: Clock, action: "clock_in", urgent: false },
      { id: 2, title: "Scan Part", icon: QrCode, action: "scan_part", urgent: false },
      { id: 3, title: "Take Photo", icon: Camera, action: "take_photo", urgent: false },
      { id: 4, title: "Update Status", icon: CheckCircle, action: "update_status", urgent: true },
    ])

    setRecentTickets([
      {
        id: "T-001",
        device: "iPhone 14 Pro",
        issue: "Screen Replacement",
        status: "in_progress",
        priority: "high",
        customer: "John Doe",
        estimatedTime: "45 min",
      },
      {
        id: "T-002",
        device: "Samsung Galaxy S23",
        issue: "Battery Replacement",
        status: "pending",
        priority: "medium",
        customer: "Jane Smith",
        estimatedTime: "30 min",
      },
    ])
  }

  const loadManagerData = async () => {
    // Manager-specific data
    setTodayStats({
      ticketsAssigned: 25,
      ticketsCompleted: 18,
      hoursWorked: 8,
      efficiency: 92,
    })

    setQuickActions([
      { id: 1, title: "Assign Tickets", icon: Users, action: "assign_tickets", urgent: true },
      { id: 2, title: "Check Inventory", icon: Package, action: "check_inventory", urgent: false },
      { id: 3, title: "View Reports", icon: TrendingUp, action: "view_reports", urgent: false },
      { id: 4, title: "Approve Overtime", icon: Clock, action: "approve_overtime", urgent: true },
    ])
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "clock_in":
        // Implement clock in functionality
        break
      case "scan_part":
        // Open barcode scanner
        break
      case "take_photo":
        // Open camera
        break
      case "update_status":
        // Open status update modal
        break
      default:
        console.log("Action not implemented:", action)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">RepairHQ Mobile</h1>
              <p className="text-sm text-gray-500 capitalize">{userRole} Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <OfflineStatusIndicator />
            {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          </div>
        </div>
      </div>

      {/* Push Notification Registration */}
      <div className="p-4">
        <PushNotificationRegistration userId={userId} />
      </div>

      {/* Sync Status */}
      {!isOnline && (
        <div className="mx-4 mb-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <WifiOff className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Offline Mode</span>
                </div>
                <Button size="sm" variant="outline" onClick={syncOfflineData}>
                  <Upload className="h-4 w-4 mr-2" />
                  Sync When Online
                </Button>
              </div>
              {syncStatus && (
                <div className="mt-2">
                  <Progress value={syncStatus.progress} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{syncStatus.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Stats */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Today's Performance</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold">{todayStats.ticketsAssigned}</p>
                </div>
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{todayStats.ticketsCompleted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hours</p>
                  <p className="text-2xl font-bold">{todayStats.hoursWorked}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold">{todayStats.efficiency}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.urgent ? "default" : "outline"}
              className="h-20 flex-col space-y-2"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.title}</span>
              {action.urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Tickets</h2>
        <div className="space-y-3">
          {recentTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{ticket.id}</Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{ticket.device}</p>
                  <p className="text-sm text-gray-600">{ticket.issue}</p>
                  <p className="text-sm text-gray-500">Customer: {ticket.customer}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Est. {ticket.estimatedTime}</span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex-col space-y-1 h-16">
            <Smartphone className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-16">
            <Wrench className="h-5 w-5" />
            <span className="text-xs">Tickets</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-16">
            <QrCode className="h-5 w-5" />
            <span className="text-xs">Scanner</span>
          </Button>
          <Button variant="ghost" className="flex-col space-y-1 h-16">
            <Users className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
