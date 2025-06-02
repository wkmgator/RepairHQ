"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, Bell, Send, CheckCircle, BarChart3, Plus, Edit, Trash2, Play, Pause } from "lucide-react"

const notificationTemplates = [
  {
    id: 1,
    name: "Repair Started",
    type: "status_update",
    channels: ["sms", "email"],
    trigger: "status_change_to_in_progress",
    active: true,
    sentCount: 1247,
    openRate: 94.2,
    clickRate: 67.8,
    template: {
      sms: "Hi {customer_name}! We've started working on your {device_type}. Track progress: {tracking_link}",
      email: {
        subject: "Repair Started - {device_type} #{ticket_number}",
        body: "Your device repair is now in progress...",
      },
    },
  },
  {
    id: 2,
    name: "Parts Ordered",
    type: "parts_update",
    channels: ["sms", "email"],
    trigger: "parts_ordered",
    active: true,
    sentCount: 892,
    openRate: 91.5,
    clickRate: 45.2,
    template: {
      sms: "Parts ordered for your {device_type}. Expected arrival: {parts_eta}. We'll update you soon!",
      email: {
        subject: "Parts Update - {device_type} #{ticket_number}",
        body: "We've ordered the necessary parts for your repair...",
      },
    },
  },
  {
    id: 3,
    name: "Repair Complete",
    type: "completion",
    channels: ["sms", "email"],
    trigger: "status_change_to_completed",
    active: true,
    sentCount: 1156,
    openRate: 98.7,
    clickRate: 89.3,
    template: {
      sms: "Great news! Your {device_type} is ready for pickup. Store hours: {store_hours}",
      email: {
        subject: "Repair Complete - {device_type} Ready for Pickup",
        body: "Your device has been successfully repaired...",
      },
    },
  },
  {
    id: 4,
    name: "Appointment Reminder",
    type: "appointment",
    channels: ["sms", "email"],
    trigger: "appointment_24h_before",
    active: true,
    sentCount: 2341,
    openRate: 96.1,
    clickRate: 78.4,
    template: {
      sms: "Reminder: {service_type} appointment tomorrow at {appointment_time}. Reply CONFIRM or RESCHEDULE",
      email: {
        subject: "Appointment Reminder - Tomorrow at {appointment_time}",
        body: "This is a friendly reminder about your upcoming appointment...",
      },
    },
  },
  {
    id: 5,
    name: "Delay Notification",
    type: "delay_alert",
    channels: ["sms", "email"],
    trigger: "estimated_completion_delayed",
    active: true,
    sentCount: 234,
    openRate: 89.7,
    clickRate: 56.8,
    template: {
      sms: "Update: Your {device_type} repair will take a bit longer. New ETA: {new_eta}. Sorry for the delay!",
      email: {
        subject: "Repair Update - Revised Timeline",
        body: "We wanted to keep you informed about a change to your repair timeline...",
      },
    },
  },
]

const automationRules = [
  {
    id: 1,
    name: "Welcome Series",
    description: "New customer onboarding sequence",
    trigger: "customer_registration",
    active: true,
    steps: [
      { delay: 0, action: "send_welcome_email" },
      { delay: 60, action: "send_welcome_sms" },
      { delay: 1440, action: "send_first_repair_discount" },
    ],
  },
  {
    id: 2,
    name: "Repair Journey",
    description: "Automated updates throughout repair process",
    trigger: "ticket_created",
    active: true,
    steps: [
      { delay: 0, action: "send_confirmation" },
      { delay: 30, action: "send_diagnosis_update" },
      { delay: 0, action: "send_completion_notification", condition: "status_completed" },
    ],
  },
  {
    id: 3,
    name: "Follow-up Campaign",
    description: "Post-repair satisfaction and retention",
    trigger: "repair_completed",
    active: true,
    steps: [
      { delay: 60, action: "send_satisfaction_survey" },
      { delay: 10080, action: "send_maintenance_tips" },
      { delay: 43200, action: "send_loyalty_offer" },
    ],
  },
]

const recentNotifications = [
  {
    id: 1,
    customer: "John Smith",
    phone: "(555) 123-4567",
    email: "john@email.com",
    type: "Repair Started",
    channel: "SMS + Email",
    status: "delivered",
    timestamp: "2024-01-15 10:30 AM",
    openTime: "2024-01-15 10:32 AM",
  },
  {
    id: 2,
    customer: "Sarah Davis",
    phone: "(555) 234-5678",
    email: "sarah@email.com",
    type: "Appointment Reminder",
    channel: "SMS",
    status: "delivered",
    timestamp: "2024-01-15 9:00 AM",
    openTime: "2024-01-15 9:05 AM",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    phone: "(555) 345-6789",
    email: "mike@email.com",
    type: "Repair Complete",
    channel: "Email",
    status: "opened",
    timestamp: "2024-01-15 8:45 AM",
    openTime: "2024-01-15 8:47 AM",
  },
]

const analytics = {
  totalSent: 15847,
  deliveryRate: 98.2,
  openRate: 94.7,
  clickRate: 67.3,
  unsubscribeRate: 0.8,
  monthlyGrowth: 23.5,
  topPerformingTemplate: "Repair Complete",
  peakSendTime: "10:00 AM",
}

export function NotificationAutomation() {
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false)
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "opened":
        return "bg-blue-100 text-blue-800"
      case "clicked":
        return "bg-purple-100 text-purple-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    if (channel.includes("SMS")) return <MessageSquare className="h-4 w-4" />
    if (channel.includes("Email")) return <Mail className="h-4 w-4" />
    return <Bell className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Automation</h2>
          <p className="text-muted-foreground">Automated SMS and email customer communications</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isNewRuleOpen} onOpenChange={setIsNewRuleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>Set up automated notification sequences</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rule-name" className="text-right">
                    Rule Name
                  </Label>
                  <Input id="rule-name" placeholder="Enter rule name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="trigger" className="text-right">
                    Trigger
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select trigger event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ticket_created">Ticket Created</SelectItem>
                      <SelectItem value="status_change">Status Change</SelectItem>
                      <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                      <SelectItem value="customer_registration">Customer Registration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Describe the automation rule" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewRuleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewRuleOpen(false)}>Create Rule</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Notification Template</DialogTitle>
                <DialogDescription>Design SMS and email templates for customer notifications</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="template-name" className="text-right">
                    Template Name
                  </Label>
                  <Input id="template-name" placeholder="Enter template name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="template-type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status_update">Status Update</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Channels</Label>
                  <div className="col-span-3 flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms" defaultChecked />
                      <label htmlFor="sms">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email" defaultChecked />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sms-message" className="text-right">
                    SMS Message
                  </Label>
                  <Textarea
                    id="sms-message"
                    placeholder="Enter SMS message (160 chars max)"
                    className="col-span-3"
                    maxLength={160}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-subject" className="text-right">
                    Email Subject
                  </Label>
                  <Input id="email-subject" placeholder="Enter email subject" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-body" className="text-right">
                    Email Body
                  </Label>
                  <Textarea id="email-body" placeholder="Enter email content" className="col-span-3" rows={4} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewTemplateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewTemplateOpen(false)}>Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics.monthlyGrowth}% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Excellent delivery performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openRate}%</div>
            <p className="text-xs text-muted-foreground">Above industry average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickRate}%</div>
            <p className="text-xs text-muted-foreground">High engagement rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Manage SMS and email templates for automated notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">Trigger: {template.trigger}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {template.channels.map((channel) => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{template.sentCount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-green-600 font-medium">{template.openRate}%</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={template.active} />
                          <Badge variant={template.active ? "default" : "secondary"}>
                            {template.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Configure automated notification sequences and workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{rule.name}</h3>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.active} />
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Trigger: {rule.trigger.replace("_", " ")}</div>
                      <div className="text-sm">
                        <span className="font-medium">Steps:</span>
                        <div className="mt-1 space-y-1">
                          {rule.steps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>
                                {step.delay > 0 ? `Wait ${step.delay} minutes, then ` : ""}
                                {step.action.replace("_", " ")}
                                {step.condition && ` (when ${step.condition})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        {rule.active ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                        {rule.active ? "Pause" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Track recent notification deliveries and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Opened</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.customer}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{notification.phone}</div>
                          <div className="text-muted-foreground">{notification.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{notification.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getChannelIcon(notification.channel)}
                          <span className="text-sm">{notification.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(notification.status)}>{notification.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{notification.timestamp}</TableCell>
                      <TableCell className="text-sm">
                        {notification.openTime ? (
                          <span className="text-green-600">{notification.openTime}</span>
                        ) : (
                          <span className="text-gray-400">Not opened</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>SMS Settings</CardTitle>
                <CardDescription>Configure SMS notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS updates to customers</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>SMS Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>From Number</Label>
                  <Input defaultValue="+1 (555) 123-REPAIR" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delivery Reports</Label>
                    <p className="text-sm text-muted-foreground">Track message delivery status</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email updates to customers</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Email Provider</Label>
                  <Select defaultValue="sendgrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="aws-ses">AWS SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>From Email</Label>
                  <Input defaultValue="notifications@repairhq.com" />
                </div>

                <div>
                  <Label>From Name</Label>
                  <Input defaultValue="RepairHQ Support" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Open Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track email open rates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timing Settings</CardTitle>
                <CardDescription>Configure when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Business Hours</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input placeholder="9:00 AM" />
                    <Input placeholder="6:00 PM" />
                  </div>
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="cst">Central Time</SelectItem>
                      <SelectItem value="mst">Mountain Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Respect Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">Don't send notifications outside business hours</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekend Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications on weekends</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Settings</CardTitle>
                <CardDescription>Manage opt-out and compliance preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Opt-out Handling</Label>
                    <p className="text-sm text-muted-foreground">Automatically process STOP requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">Include unsubscribe links in emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Opt-out Message</Label>
                  <Textarea defaultValue="Reply STOP to unsubscribe from SMS notifications." rows={2} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Editor Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Template: {selectedTemplate.name}</DialogTitle>
              <DialogDescription>Modify SMS and email content for this notification template</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SMS Message</Label>
                  <Textarea defaultValue={selectedTemplate.template.sms} rows={4} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedTemplate.template.sms.length}/160 characters
                  </p>
                </div>
                <div>
                  <Label>Email Subject</Label>
                  <Input defaultValue={selectedTemplate.template.email.subject} className="mt-1" />
                  <Label className="mt-3">Email Body</Label>
                  <Textarea defaultValue={selectedTemplate.template.email.body} rows={6} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Available Variables</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    "{customer_name}",
                    "{device_type}",
                    "{ticket_number}",
                    "{tracking_link}",
                    "{store_hours}",
                    "{appointment_time}",
                  ].map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
