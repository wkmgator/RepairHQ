"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Phone,
  Settings,
  Users,
  FileText,
} from "lucide-react"

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  status: "completed" | "pending" | "failed" | "warning"
  priority: "high" | "medium" | "low"
  icon: any
  action?: () => void
}

const checklistItems: ChecklistItem[] = [
  // Database & Backend
  {
    id: "db-schema",
    category: "Database",
    title: "Database Schema Deployed",
    description: "All tables, indexes, and constraints are properly set up",
    status: "pending",
    priority: "high",
    icon: Database,
  },
  {
    id: "db-migrations",
    category: "Database",
    title: "Run Database Migrations",
    description: "Execute all pending database migrations",
    status: "pending",
    priority: "high",
    icon: Database,
  },
  {
    id: "db-backups",
    category: "Database",
    title: "Backup Strategy Configured",
    description: "Automated backups are set up and tested",
    status: "pending",
    priority: "high",
    icon: Database,
  },

  // Security
  {
    id: "ssl-certificate",
    category: "Security",
    title: "SSL Certificate Installed",
    description: "HTTPS is properly configured with valid SSL certificate",
    status: "pending",
    priority: "high",
    icon: Shield,
  },
  {
    id: "env-variables",
    category: "Security",
    title: "Environment Variables Set",
    description: "All required environment variables are configured",
    status: "pending",
    priority: "high",
    icon: Shield,
  },
  {
    id: "api-security",
    category: "Security",
    title: "API Security Configured",
    description: "Rate limiting, CORS, and authentication are properly set up",
    status: "pending",
    priority: "high",
    icon: Shield,
  },

  // Payments
  {
    id: "stripe-production",
    category: "Payments",
    title: "Stripe Production Keys",
    description: "Production Stripe keys are configured and tested",
    status: "pending",
    priority: "high",
    icon: CreditCard,
  },
  {
    id: "webhook-endpoints",
    category: "Payments",
    title: "Webhook Endpoints",
    description: "Payment webhooks are configured and responding",
    status: "pending",
    priority: "high",
    icon: CreditCard,
  },

  // Communications
  {
    id: "email-service",
    category: "Communications",
    title: "Email Service Configured",
    description: "SendGrid or email service is set up for notifications",
    status: "pending",
    priority: "medium",
    icon: Mail,
  },
  {
    id: "sms-service",
    category: "Communications",
    title: "SMS Service Configured",
    description: "Twilio SMS service is configured for notifications",
    status: "pending",
    priority: "medium",
    icon: Phone,
  },

  // Domain & DNS
  {
    id: "domain-configured",
    category: "Domain",
    title: "Custom Domain Configured",
    description: "Custom domain is pointing to the application",
    status: "pending",
    priority: "medium",
    icon: Globe,
  },
  {
    id: "dns-records",
    category: "Domain",
    title: "DNS Records Set",
    description: "All necessary DNS records are configured",
    status: "pending",
    priority: "medium",
    icon: Globe,
  },

  // Business Setup
  {
    id: "business-info",
    category: "Business",
    title: "Business Information Complete",
    description: "Business details, hours, and contact info are set",
    status: "pending",
    priority: "medium",
    icon: Settings,
  },
  {
    id: "team-setup",
    category: "Business",
    title: "Team Members Added",
    description: "Initial team members are invited and configured",
    status: "pending",
    priority: "low",
    icon: Users,
  },

  // Legal & Compliance
  {
    id: "privacy-policy",
    category: "Legal",
    title: "Privacy Policy Published",
    description: "Privacy policy is accessible and up to date",
    status: "pending",
    priority: "medium",
    icon: FileText,
  },
  {
    id: "terms-of-service",
    category: "Legal",
    title: "Terms of Service Published",
    description: "Terms of service are accessible and up to date",
    status: "pending",
    priority: "medium",
    icon: FileText,
  },
]

export default function DeploymentChecklistPage() {
  const { toast } = useToast()
  const [items, setItems] = useState(checklistItems)
  const [isRunningChecks, setIsRunningChecks] = useState(false)

  const completedItems = items.filter((item) => item.status === "completed").length
  const totalItems = items.length
  const completionPercentage = (completedItems / totalItems) * 100

  const runAutomatedChecks = async () => {
    setIsRunningChecks(true)

    // Simulate running checks
    for (let i = 0; i < items.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setItems((prevItems) => {
        const newItems = [...prevItems]
        // Simulate some checks passing and some failing
        const randomStatus = Math.random() > 0.3 ? "completed" : Math.random() > 0.5 ? "warning" : "failed"
        newItems[i] = { ...newItems[i], status: randomStatus }
        return newItems
      })
    }

    setIsRunningChecks(false)
    toast({
      title: "Checks Complete",
      description: "Automated deployment checks have finished running",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">✓ Complete</Badge>
      case "failed":
        return <Badge variant="destructive">✗ Failed</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠ Warning</Badge>
      default:
        return <Badge variant="secondary">⏳ Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>,
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Deployment Checklist</h1>
          <p className="text-muted-foreground">Ensure your RepairHQ system is ready for production</p>
        </div>
        <Button onClick={runAutomatedChecks} disabled={isRunningChecks}>
          {isRunningChecks ? "Running Checks..." : "Run Automated Checks"}
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Progress</CardTitle>
          <CardDescription>
            {completedItems} of {totalItems} items completed ({completionPercentage.toFixed(0)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{items.filter((i) => i.status === "completed").length} Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>{items.filter((i) => i.status === "warning").length} Warnings</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{items.filter((i) => i.status === "failed").length} Failed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{items.filter((i) => i.status === "pending").length} Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {categoryItems.filter((i) => i.status === "completed").length} of {categoryItems.length} items completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{item.title}</h3>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                        {item.action && (
                          <Button variant="outline" size="sm" onClick={item.action}>
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deployment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Deploy?</CardTitle>
          <CardDescription>Once all high-priority items are completed, you're ready for production</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              size="lg"
              disabled={items.filter((i) => i.priority === "high" && i.status !== "completed").length > 0}
            >
              Deploy to Production
            </Button>
            <Button variant="outline" size="lg">
              Export Checklist
            </Button>
            <Button variant="outline" size="lg">
              Schedule Deployment
            </Button>
          </div>
          {items.filter((i) => i.priority === "high" && i.status !== "completed").length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              ⚠️ Complete all high-priority items before deploying to production
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
