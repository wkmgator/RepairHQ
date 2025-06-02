"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Clock, Mail, MessageSquare, Bell, Settings, Play, Pause, BarChart3 } from "lucide-react"

const workflows = [
  {
    id: 1,
    name: "New Customer Welcome",
    description: "Send welcome email and SMS to new customers",
    trigger: "Customer Registration",
    actions: ["Send Welcome Email", "Send Welcome SMS", "Create Follow-up Task"],
    status: "active",
    executions: 156,
    successRate: 98.7,
    lastRun: "2024-01-15 10:30 AM",
  },
  {
    id: 2,
    name: "Appointment Reminders",
    description: "Automated reminders 24h and 2h before appointments",
    trigger: "Appointment Scheduled",
    actions: ["Schedule 24h Reminder", "Schedule 2h Reminder", "Update Calendar"],
    status: "active",
    executions: 342,
    successRate: 99.1,
    lastRun: "2024-01-15 11:45 AM",
  },
  {
    id: 3,
    name: "Low Inventory Alert",
    description: "Alert when inventory falls below minimum threshold",
    trigger: "Inventory Level Change",
    actions: ["Send Alert Email", "Create Purchase Order", "Notify Manager"],
    status: "active",
    executions: 23,
    successRate: 100,
    lastRun: "2024-01-14 3:20 PM",
  },
  {
    id: 4,
    name: "Repair Completion Follow-up",
    description: "Follow up with customers after repair completion",
    trigger: "Repair Status: Completed",
    actions: ["Send Satisfaction Survey", "Request Review", "Schedule Follow-up Call"],
    status: "paused",
    executions: 89,
    successRate: 94.4,
    lastRun: "2024-01-13 2:15 PM",
  },
]

const triggers = [
  "Customer Registration",
  "Appointment Scheduled",
  "Repair Status Change",
  "Inventory Level Change",
  "Payment Received",
  "Review Submitted",
  "Time-based Schedule",
]

const actions = [
  "Send Email",
  "Send SMS",
  "Create Task",
  "Update Status",
  "Generate Report",
  "Create Notification",
  "Schedule Follow-up",
  "Update Inventory",
]

export function AutomatedWorkflowEngine() {
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false)

  const toggleWorkflow = (id: number) => {
    // Toggle workflow status logic here
    console.log(`Toggling workflow ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflow Automation</h2>
          <p className="text-muted-foreground">Automate repetitive tasks and improve efficiency</p>
        </div>
        <Dialog open={isNewWorkflowOpen} onOpenChange={setIsNewWorkflowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>Set up automated actions based on triggers</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Workflow name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" placeholder="Workflow description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trigger" className="text-right">
                  Trigger
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggers.map((trigger) => (
                      <SelectItem key={trigger} value={trigger}>
                        {trigger}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actions" className="text-right">
                  Actions
                </Label>
                <div className="col-span-3 space-y-2">
                  {actions.slice(0, 3).map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <input type="checkbox" id={action} />
                      <label htmlFor={action} className="text-sm">
                        {action}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewWorkflowOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsNewWorkflowOpen(false)}>Create Workflow</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 paused</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Settings className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
              <CardDescription>Manage your automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">{workflow.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{workflow.trigger}</Badge>
                      </TableCell>
                      <TableCell>{workflow.executions}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-green-600">{workflow.successRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={workflow.status === "active"}
                            onCheckedChange={() => toggleWorkflow(workflow.id)}
                          />
                          <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                            {workflow.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {workflow.status === "active" ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
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

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">Email</Badge>
                </div>
                <h3 className="font-medium mb-1">Customer Onboarding</h3>
                <p className="text-sm text-muted-foreground mb-3">Welcome new customers with email sequence</p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <Badge variant="outline">SMS</Badge>
                </div>
                <h3 className="font-medium mb-1">Appointment Reminders</h3>
                <p className="text-sm text-muted-foreground mb-3">Automated SMS reminders for appointments</p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <Badge variant="outline">Alert</Badge>
                </div>
                <h3 className="font-medium mb-1">Inventory Alerts</h3>
                <p className="text-sm text-muted-foreground mb-3">Low stock notifications and reorder alerts</p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
