"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Star,
  Clock,
  CheckCircle,
  Phone,
  Calendar,
  Wrench,
  DollarSign,
  ThumbsUp,
  Send,
  Smartphone,
  Laptop,
} from "lucide-react"

const customerPortalData = {
  customer: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    loyaltyPoints: 450,
    totalSpent: 1250,
    memberSince: "2022-03-15",
  },
  activeTickets: [
    {
      id: "RHQ-240115-001",
      device: "iPhone 14 Pro",
      issue: "Cracked Screen",
      status: "in_progress",
      progress: 65,
      estimatedCompletion: "2024-01-16 3:00 PM",
      technician: "Mike Johnson",
      updates: [
        {
          timestamp: "2024-01-15 10:30 AM",
          message: "Device received and initial diagnosis completed",
          type: "status_update",
        },
        {
          timestamp: "2024-01-15 2:15 PM",
          message: "Replacement screen ordered - ETA tomorrow morning",
          type: "parts_update",
        },
        {
          timestamp: "2024-01-15 4:45 PM",
          message: "Screen replacement in progress",
          type: "work_update",
        },
      ],
    },
  ],
  recentTickets: [
    {
      id: "RHQ-231220-045",
      device: "iPad Air",
      issue: "Battery Replacement",
      status: "completed",
      completedDate: "2023-12-22",
      rating: 5,
      cost: 89,
    },
    {
      id: "RHQ-231115-032",
      device: "MacBook Pro",
      issue: "Keyboard Repair",
      status: "completed",
      completedDate: "2023-11-18",
      rating: 4,
      cost: 150,
    },
  ],
  appointments: [
    {
      id: "APT-001",
      date: "2024-01-18",
      time: "2:00 PM",
      service: "iPhone 15 Screen Protector Installation",
      status: "confirmed",
    },
  ],
  notifications: [
    {
      id: 1,
      type: "status_update",
      title: "Repair Progress Update",
      message: "Your iPhone 14 Pro screen replacement is 65% complete",
      timestamp: "2024-01-15 4:45 PM",
      read: false,
    },
    {
      id: 2,
      type: "appointment_reminder",
      title: "Upcoming Appointment",
      message: "Reminder: Screen protector installation on Jan 18 at 2:00 PM",
      timestamp: "2024-01-15 9:00 AM",
      read: false,
    },
    {
      id: 3,
      type: "promotion",
      title: "Special Offer",
      message: "20% off all accessories this week - use code SAVE20",
      timestamp: "2024-01-14 10:00 AM",
      read: true,
    },
  ],
}

const satisfactionMetrics = {
  overallRating: 4.8,
  responseTime: 92,
  communicationQuality: 95,
  serviceQuality: 89,
  recentFeedback: [
    {
      rating: 5,
      comment: "Excellent service! My phone was fixed quickly and works perfectly.",
      date: "2024-01-10",
      service: "Screen Repair",
    },
    {
      rating: 4,
      comment: "Good work, but took a bit longer than expected.",
      date: "2024-01-05",
      service: "Battery Replacement",
    },
  ],
}

export function CustomerExperiencePortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [newMessage, setNewMessage] = useState("")
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressIcon = (progress: number) => {
    if (progress === 100) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (progress > 0) return <Clock className="h-4 w-4 text-blue-600" />
    return <Clock className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-gray-600">Welcome back, {customerPortalData.customer.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Loyalty Points</div>
                <div className="font-bold text-blue-600">{customerPortalData.customer.loyaltyPoints}</div>
              </div>
              <Button>
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="repairs">My Repairs</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
                  <Wrench className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerPortalData.activeTickets.length}</div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customerPortalData.customer.loyaltyPoints}</div>
                  <p className="text-xs text-muted-foreground">Earn more with repairs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${customerPortalData.customer.totalSpent}</div>
                  <p className="text-xs text-muted-foreground">Lifetime value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{satisfactionMetrics.overallRating}/5</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Repairs */}
            <Card>
              <CardHeader>
                <CardTitle>Current Repairs</CardTitle>
                <CardDescription>Track your device repairs in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {customerPortalData.activeTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No active repairs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerPortalData.activeTickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{ticket.device}</h3>
                            <p className="text-sm text-gray-600">{ticket.issue}</p>
                            <p className="text-xs text-gray-500">Ticket #{ticket.id}</p>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{ticket.progress}%</span>
                          </div>
                          <Progress value={ticket.progress} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Technician:</span>
                            <span className="ml-1 font-medium">{ticket.technician}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Est. Completion:</span>
                            <span className="ml-1 font-medium">{ticket.estimatedCompletion}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Recent Updates</h4>
                          <div className="space-y-2">
                            {ticket.updates.slice(-2).map((update, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                {getProgressIcon(ticket.progress)}
                                <div>
                                  <p className="text-sm">{update.message}</p>
                                  <p className="text-xs text-gray-500">{update.timestamp}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated with real-time alerts and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerPortalData.notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Bell
                            className={`h-4 w-4 mt-0.5 ${!notification.read ? "text-blue-600" : "text-gray-400"}`}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repairs" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Active Repairs */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Repairs</CardTitle>
                  <CardDescription>Currently in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {customerPortalData.activeTickets.map((ticket) => (
                    <div key={ticket.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{ticket.device}</h3>
                            <p className="text-sm text-gray-600">{ticket.issue}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{ticket.progress}%</span>
                        </div>
                        <Progress value={ticket.progress} />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Timeline</h4>
                        {ticket.updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm">{update.message}</p>
                              <p className="text-xs text-gray-500">{update.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Repair History */}
              <Card>
                <CardHeader>
                  <CardTitle>Repair History</CardTitle>
                  <CardDescription>Previously completed repairs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerPortalData.recentTickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Laptop className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm">{ticket.device}</span>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{ticket.issue}</p>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Completed: {ticket.completedDate}</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < ticket.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">${ticket.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {customerPortalData.appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming appointments</p>
                    <Button className="mt-4">Schedule Appointment</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerPortalData.appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-medium">{appointment.service}</h3>
                              <p className="text-sm text-gray-600">
                                {appointment.date} at {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate directly with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            Hello! Your iPhone screen repair is progressing well. We should have it ready by tomorrow
                            afternoon.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Support Team • 2:15 PM</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">Great! Will I get a notification when it's ready?</p>
                          <p className="text-xs text-blue-200 mt-1">You • 2:18 PM</p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            You'll receive both SMS and email notifications when your device is ready for pickup.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Support Team • 2:20 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input value="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input value="Smith" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={customerPortalData.customer.email} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={customerPortalData.customer.phone} />
                  </div>

                  <Button>Update Information</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>Help us improve our service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rate your experience</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button key={rating} onClick={() => setFeedbackRating(rating)} className="p-1">
                          <Star
                            className={`h-6 w-6 ${rating <= feedbackRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Comments</label>
                    <Textarea
                      placeholder="Tell us about your experience..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button>Submit Feedback</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
