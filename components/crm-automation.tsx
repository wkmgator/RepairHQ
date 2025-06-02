"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2, Save, Edit } from "lucide-react"

interface Automation {
  id: string
  name: string
  trigger: string
  conditions: Condition[]
  actions: Action[]
  isActive: boolean
  lastRun?: string
  createdAt: string
}

interface Condition {
  id: string
  field: string
  operator: string
  value: string
}

interface Action {
  id: string
  type: string
  details: Record<string, any>
}

export default function CRMAutomation() {
  const [activeTab, setActiveTab] = useState("workflows")
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "auto-1",
      name: "New Customer Welcome",
      trigger: "customer_created",
      conditions: [{ id: "cond-1", field: "customer.email", operator: "is_not_empty", value: "" }],
      actions: [
        {
          id: "act-1",
          type: "send_email",
          details: {
            template: "welcome_email",
            subject: "Welcome to RepairHQ!",
            delay: 0,
          },
        },
        {
          id: "act-2",
          type: "create_task",
          details: {
            assignee: "auto",
            title: "Follow up with new customer",
            dueDate: "3_days",
          },
        },
      ],
      isActive: true,
      lastRun: "2023-11-15T14:23:45Z",
      createdAt: "2023-10-01T09:12:33Z",
    },
    {
      id: "auto-2",
      name: "Repair Completion Notification",
      trigger: "ticket_status_changed",
      conditions: [{ id: "cond-2", field: "ticket.status", operator: "equals", value: "completed" }],
      actions: [
        {
          id: "act-3",
          type: "send_sms",
          details: {
            template: "repair_completed",
            delay: 0,
          },
        },
        {
          id: "act-4",
          type: "send_email",
          details: {
            template: "repair_completed_email",
            subject: "Your repair is complete!",
            delay: 0,
          },
        },
      ],
      isActive: true,
      lastRun: "2023-11-16T10:45:12Z",
      createdAt: "2023-10-05T11:34:21Z",
    },
    {
      id: "auto-3",
      name: "Appointment Reminder",
      trigger: "scheduled_trigger",
      conditions: [{ id: "cond-3", field: "appointment.date", operator: "is_tomorrow", value: "" }],
      actions: [
        {
          id: "act-5",
          type: "send_sms",
          details: {
            template: "appointment_reminder",
            delay: 0,
          },
        },
      ],
      isActive: true,
      lastRun: "2023-11-16T08:00:00Z",
      createdAt: "2023-10-10T15:22:18Z",
    },
    {
      id: "auto-4",
      name: "Customer Feedback Request",
      trigger: "invoice_paid",
      conditions: [],
      actions: [
        {
          id: "act-6",
          type: "send_email",
          details: {
            template: "feedback_request",
            subject: "How was your experience?",
            delay: 86400, // 1 day in seconds
          },
        },
      ],
      isActive: false,
      createdAt: "2023-10-15T13:45:56Z",
    },
  ])

  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)

  const triggerOptions = [
    { value: "customer_created", label: "Customer Created" },
    { value: "ticket_created", label: "Ticket Created" },
    { value: "ticket_status_changed", label: "Ticket Status Changed" },
    { value: "invoice_created", label: "Invoice Created" },
    { value: "invoice_paid", label: "Invoice Paid" },
    { value: "appointment_created", label: "Appointment Created" },
    { value: "appointment_updated", label: "Appointment Updated" },
    { value: "scheduled_trigger", label: "Scheduled Trigger" },
  ]

  const fieldOptions = [
    { value: "customer.email", label: "Customer Email" },
    { value: "customer.phone", label: "Customer Phone" },
    { value: "customer.type", label: "Customer Type" },
    { value: "ticket.status", label: "Ticket Status" },
    { value: "ticket.priority", label: "Ticket Priority" },
    { value: "ticket.device_type", label: "Device Type" },
    { value: "invoice.total", label: "Invoice Total" },
    { value: "invoice.status", label: "Invoice Status" },
    { value: "appointment.date", label: "Appointment Date" },
    { value: "appointment.service_type", label: "Service Type" },
  ]

  const operatorOptions = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does Not Equal" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does Not Contain" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "is_empty", label: "Is Empty" },
    { value: "is_not_empty", label: "Is Not Empty" },
    { value: "is_tomorrow", label: "Is Tomorrow" },
    { value: "is_today", label: "Is Today" },
  ]

  const actionTypeOptions = [
    { value: "send_email", label: "Send Email" },
    { value: "send_sms", label: "Send SMS" },
    { value: "create_task", label: "Create Task" },
    { value: "update_field", label: "Update Field" },
    { value: "add_tag", label: "Add Tag" },
    { value: "remove_tag", label: "Remove Tag" },
    { value: "create_note", label: "Create Note" },
    { value: "webhook", label: "Webhook" },
  ]

  const emailTemplateOptions = [
    { value: "welcome_email", label: "Welcome Email" },
    { value: "repair_completed_email", label: "Repair Completed" },
    { value: "appointment_confirmation", label: "Appointment Confirmation" },
    { value: "invoice_reminder", label: "Invoice Reminder" },
    { value: "feedback_request", label: "Feedback Request" },
  ]

  const smsTemplateOptions = [
    { value: "welcome_sms", label: "Welcome SMS" },
    { value: "repair_completed", label: "Repair Completed" },
    { value: "appointment_reminder", label: "Appointment Reminder" },
    { value: "invoice_reminder_sms", label: "Invoice Reminder" },
  ]

  const toggleAutomationStatus = (id: string) => {
    setAutomations(automations.map((auto) => (auto.id === id ? { ...auto, isActive: !auto.isActive } : auto)))
  }

  const deleteAutomation = (id: string) => {
    if (confirm("Are you sure you want to delete this automation?")) {
      setAutomations(automations.filter((auto) => auto.id !== id))
    }
  }

  const editAutomation = (automation: Automation) => {
    setEditingAutomation({ ...automation })
    setActiveTab("editor")
  }

  const createNewAutomation = () => {
    const newAutomation: Automation = {
      id: `auto-${Date.now()}`,
      name: "New Automation",
      trigger: "",
      conditions: [],
      actions: [],
      isActive: false,
      createdAt: new Date().toISOString(),
    }
    setEditingAutomation(newAutomation)
    setActiveTab("editor")
  }

  const addCondition = () => {
    if (!editingAutomation) return

    const newCondition: Condition = {
      id: `cond-${Date.now()}`,
      field: "",
      operator: "",
      value: "",
    }

    setEditingAutomation({
      ...editingAutomation,
      conditions: [...editingAutomation.conditions, newCondition],
    })
  }

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    if (!editingAutomation) return

    setEditingAutomation({
      ...editingAutomation,
      conditions: editingAutomation.conditions.map((cond) => (cond.id === id ? { ...cond, [field]: value } : cond)),
    })
  }

  const removeCondition = (id: string) => {
    if (!editingAutomation) return

    setEditingAutomation({
      ...editingAutomation,
      conditions: editingAutomation.conditions.filter((cond) => cond.id !== id),
    })
  }

  const addAction = () => {
    if (!editingAutomation) return

    const newAction: Action = {
      id: `act-${Date.now()}`,
      type: "",
      details: {},
    }

    setEditingAutomation({
      ...editingAutomation,
      actions: [...editingAutomation.actions, newAction],
    })
  }

  const updateAction = (id: string, field: string, value: any) => {
    if (!editingAutomation) return

    if (field === "type") {
      // Reset details when action type changes
      setEditingAutomation({
        ...editingAutomation,
        actions: editingAutomation.actions.map((act) => (act.id === id ? { ...act, type: value, details: {} } : act)),
      })
    } else {
      // Update a specific detail field
      const [_, detailField] = field.split(".")

      setEditingAutomation({
        ...editingAutomation,
        actions: editingAutomation.actions.map((act) => {
          if (act.id === id) {
            return {
              ...act,
              details: {
                ...act.details,
                [detailField]: value,
              },
            }
          }
          return act
        }),
      })
    }
  }

  const removeAction = (id: string) => {
    if (!editingAutomation) return

    setEditingAutomation({
      ...editingAutomation,
      actions: editingAutomation.actions.filter((act) => act.id !== id),
    })
  }

  const saveAutomation = () => {
    if (!editingAutomation) return

    const isNew = !automations.some((a) => a.id === editingAutomation.id)

    if (isNew) {
      setAutomations([...automations, editingAutomation])
    } else {
      setAutomations(automations.map((auto) => (auto.id === editingAutomation.id ? editingAutomation : auto)))
    }

    setEditingAutomation(null)
    setActiveTab("workflows")
  }

  const cancelEditing = () => {
    if (confirm("Discard changes?")) {
      setEditingAutomation(null)
      setActiveTab("workflows")
    }
  }

  const renderActionDetails = (action: Action) => {
    switch (action.type) {
      case "send_email":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Template</Label>
                <Select
                  value={action.details.template || ""}
                  onValueChange={(value) => updateAction(action.id, "details.template", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  value={action.details.subject || ""}
                  onChange={(e) => updateAction(action.id, "details.subject", e.target.value)}
                  placeholder="Email subject"
                />
              </div>
            </div>
            <div>
              <Label>Delay (seconds)</Label>
              <Input
                type="number"
                value={action.details.delay || 0}
                onChange={(e) => updateAction(action.id, "details.delay", Number.parseInt(e.target.value))}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for immediate sending, or specify delay in seconds</p>
            </div>
          </div>
        )

      case "send_sms":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>SMS Template</Label>
              <Select
                value={action.details.template || ""}
                onValueChange={(value) => updateAction(action.id, "details.template", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {smsTemplateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delay (seconds)</Label>
              <Input
                type="number"
                value={action.details.delay || 0}
                onChange={(e) => updateAction(action.id, "details.delay", Number.parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        )

      case "create_task":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>Task Title</Label>
              <Input
                value={action.details.title || ""}
                onChange={(e) => updateAction(action.id, "details.title", e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div>
              <Label>Assignee</Label>
              <Select
                value={action.details.assignee || "auto"}
                onValueChange={(value) => updateAction(action.id, "details.assignee", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-assign</SelectItem>
                  <SelectItem value="creator">Ticket Creator</SelectItem>
                  <SelectItem value="manager">Shop Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Select
                value={action.details.dueDate || ""}
                onValueChange={(value) => updateAction(action.id, "details.dueDate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same_day">Same Day</SelectItem>
                  <SelectItem value="next_day">Next Day</SelectItem>
                  <SelectItem value="3_days">3 Days</SelectItem>
                  <SelectItem value="1_week">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "update_field":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>Field to Update</Label>
              <Select
                value={action.details.field || ""}
                onValueChange={(value) => updateAction(action.id, "details.field", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>New Value</Label>
              <Input
                value={action.details.value || ""}
                onChange={(e) => updateAction(action.id, "details.value", e.target.value)}
                placeholder="New value"
              />
            </div>
          </div>
        )

      case "add_tag":
      case "remove_tag":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>Tag</Label>
              <Input
                value={action.details.tag || ""}
                onChange={(e) => updateAction(action.id, "details.tag", e.target.value)}
                placeholder="Tag name"
              />
            </div>
          </div>
        )

      case "create_note":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>Note Content</Label>
              <Textarea
                value={action.details.content || ""}
                onChange={(e) => updateAction(action.id, "details.content", e.target.value)}
                placeholder="Note content"
                rows={3}
              />
            </div>
          </div>
        )

      case "webhook":
        return (
          <div className="space-y-4 mt-2 pl-6">
            <div>
              <Label>Webhook URL</Label>
              <Input
                value={action.details.url || ""}
                onChange={(e) => updateAction(action.id, "details.url", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div>
              <Label>Payload (JSON)</Label>
              <Textarea
                value={action.details.payload || ""}
                onChange={(e) => updateAction(action.id, "details.payload", e.target.value)}
                placeholder='{"key": "value"}'
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Automation</h1>
          <p className="text-gray-500">Automate your customer relationship workflows</p>
        </div>
        {activeTab === "workflows" && (
          <Button onClick={createNewAutomation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Automation
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="editor" disabled={!editingAutomation}>
            Workflow Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => (
              <Card key={automation.id} className={automation.isActive ? "" : "opacity-70"}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={automation.isActive}
                        onCheckedChange={() => toggleAutomationStatus(automation.id)}
                      />
                    </div>
                  </div>
                  <CardDescription>
                    Trigger: {triggerOptions.find((t) => t.value === automation.trigger)?.label || automation.trigger}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Conditions:</span>
                      <div className="mt-1">
                        {automation.conditions.length > 0 ? (
                          automation.conditions.map((cond, i) => (
                            <div key={cond.id} className="text-sm text-gray-600">
                              {fieldOptions.find((f) => f.value === cond.field)?.label || cond.field}{" "}
                              {operatorOptions.find((o) => o.value === cond.operator)?.label || cond.operator}{" "}
                              {cond.value || "(empty)"}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-600">No conditions (always runs)</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Actions:</span>
                      <div className="mt-1">
                        {automation.actions.map((action, i) => (
                          <div key={action.id} className="text-sm text-gray-600 flex items-center">
                            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-500 mr-1">
                              {i + 1}
                            </span>
                            {actionTypeOptions.find((a) => a.value === action.type)?.label || action.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="text-xs text-gray-500">
                    {automation.lastRun ? (
                      <>Last run: {new Date(automation.lastRun).toLocaleString()}</>
                    ) : (
                      <>Created: {new Date(automation.createdAt).toLocaleDateString()}</>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => editAutomation(automation)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteAutomation(automation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Tabs defaultValue="email">
            <TabsList>
              <TabsTrigger value="email">Email Templates</TabsTrigger>
              <TabsTrigger value="sms">SMS Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emailTemplateOptions.map((template) => (
                  <Card key={template.value}>
                    <CardHeader>
                      <CardTitle>{template.label}</CardTitle>
                      <CardDescription>Email template</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Subject:</span>
                          <div className="text-sm text-gray-600">
                            {template.value === "welcome_email" && "Welcome to RepairHQ!"}
                            {template.value === "repair_completed_email" && "Your repair is complete!"}
                            {template.value === "appointment_confirmation" && "Your appointment is confirmed"}
                            {template.value === "invoice_reminder" && "Invoice reminder"}
                            {template.value === "feedback_request" && "How was your experience?"}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Preview:</span>
                          <div className="text-sm text-gray-600 border p-2 rounded mt-1">
                            {template.value === "welcome_email" && (
                              <>
                                <p>Hello {"{{customer.first_name}}"},</p>
                                <p>Welcome to RepairHQ! We're excited to have you as a customer.</p>
                                <p>Your account has been created successfully.</p>
                              </>
                            )}
                            {template.value === "repair_completed_email" && (
                              <>
                                <p>Hello {"{{customer.first_name}}"},</p>
                                <p>Great news! Your {"{{ticket.device_type}}"} repair is now complete.</p>
                                <p>You can pick it up at your convenience during our business hours.</p>
                              </>
                            )}
                            {template.value === "appointment_confirmation" && (
                              <>
                                <p>Hello {"{{customer.first_name}}"},</p>
                                <p>
                                  Your appointment for {"{{appointment.service_type}}"} has been confirmed for{" "}
                                  {"{{appointment.date}}"} at {"{{appointment.time}}"}
                                </p>
                              </>
                            )}
                            {template.value === "invoice_reminder" && (
                              <>
                                <p>Hello {"{{customer.first_name}}"},</p>
                                <p>
                                  This is a friendly reminder that invoice #{"{{invoice.number}}"} for{" "}
                                  {"{{invoice.total}}"} is due on {"{{invoice.due_date}}"}
                                </p>
                              </>
                            )}
                            {template.value === "feedback_request" && (
                              <>
                                <p>Hello {"{{customer.first_name}}"},</p>
                                <p>Thank you for choosing RepairHQ for your recent repair.</p>
                                <p>We'd love to hear about your experience. Please take a moment to leave a review.</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {smsTemplateOptions.map((template) => (
                  <Card key={template.value}>
                    <CardHeader>
                      <CardTitle>{template.label}</CardTitle>
                      <CardDescription>SMS template</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Preview:</span>
                          <div className="text-sm text-gray-600 border p-2 rounded mt-1">
                            {template.value === "welcome_sms" &&
                              "Welcome to RepairHQ, {{customer.first_name}}! We're excited to serve you. Save this number for updates on your repairs."}
                            {template.value === "repair_completed" &&
                              "Good news! Your {{ticket.device_type}} repair is complete. You can pick it up at RepairHQ during business hours. Ticket #{{ticket.number}}"}
                            {template.value === "appointment_reminder" &&
                              "Reminder: Your appointment at RepairHQ is tomorrow at {{appointment.time}}. Reply C to confirm or R to reschedule."}
                            {template.value === "invoice_reminder_sms" &&
                              "RepairHQ reminder: Invoice #{{invoice.number}} for {{invoice.total}} is due on {{invoice.due_date}}. Pay online at {{payment_link}}"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {editingAutomation && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Input
                    value={editingAutomation.name}
                    onChange={(e) => setEditingAutomation({ ...editingAutomation, name: e.target.value })}
                    className="text-xl font-bold"
                    placeholder="Automation Name"
                  />
                </CardTitle>
                <CardDescription>Configure your automation workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trigger */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Trigger</h3>
                  <p className="text-sm text-gray-500">When should this automation run?</p>

                  <Select
                    value={editingAutomation.trigger}
                    onValueChange={(value) => setEditingAutomation({ ...editingAutomation, trigger: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Conditions */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Conditions</h3>
                    <Button variant="outline" size="sm" onClick={addCondition}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Condition
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Specify when this automation should run. If no conditions are set, it will always run on trigger.
                  </p>

                  {editingAutomation.conditions.length === 0 ? (
                    <div className="text-center p-4 border border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">
                        No conditions set. This automation will run every time the trigger occurs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingAutomation.conditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-start gap-2 p-4 border rounded-lg">
                          {index > 0 && <div className="pt-2 pr-2 text-sm font-medium text-gray-500">AND</div>}

                          <div className="grid grid-cols-3 gap-2 flex-1">
                            <Select
                              value={condition.field}
                              onValueChange={(value) => updateCondition(condition.id, "field", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={condition.operator}
                              onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {operatorOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {!["is_empty", "is_not_empty", "is_today", "is_tomorrow"].includes(condition.operator) && (
                              <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                placeholder="Value"
                              />
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(condition.id)}
                            className="mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Actions</h3>
                    <Button variant="outline" size="sm" onClick={addAction}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Action
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Define what happens when this automation runs. Actions execute in sequence.
                  </p>

                  {editingAutomation.actions.length === 0 ? (
                    <div className="text-center p-4 border border-dashed rounded-lg">
                      <p className="text-sm text-gray-500">
                        No actions set. Add at least one action for this automation to do something.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingAutomation.actions.map((action, index) => (
                        <div key={action.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <Select
                                value={action.type}
                                onValueChange={(value) => updateAction(action.id, "type", value)}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Select action type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {actionTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {action.type && renderActionDetails(action)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Settings</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active</Label>
                      <p className="text-sm text-gray-500">Enable or disable this automation</p>
                    </div>
                    <Switch
                      checked={editingAutomation.isActive}
                      onCheckedChange={(checked) => setEditingAutomation({ ...editingAutomation, isActive: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={saveAutomation}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Automation
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
