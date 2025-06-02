"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Settings,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Zap,
  Mail,
  MessageSquare,
  BarChart3,
  CreditCard,
  FileText,
  Webhook,
  Key,
  RefreshCw,
  Play,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: "accounting" | "payment" | "marketing" | "automation" | "analytics"
  status: "connected" | "disconnected" | "error" | "syncing"
  icon: any
  features: string[]
  lastSync?: Date
  syncFrequency?: string
  dataPoints?: number
}

export function EnterpriseIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "quickbooks",
      name: "QuickBooks Online",
      description: "Sync invoices, customers, and financial data",
      category: "accounting",
      status: "connected",
      icon: FileText,
      features: ["Invoice sync", "Customer sync", "Financial reporting", "Tax preparation"],
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      syncFrequency: "Every hour",
      dataPoints: 1247,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      category: "payment",
      status: "connected",
      icon: CreditCard,
      features: ["Payment processing", "Subscription management", "Dispute handling", "Analytics"],
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      syncFrequency: "Real-time",
      dataPoints: 892,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and customer communication",
      category: "marketing",
      status: "connected",
      icon: Mail,
      features: ["Email campaigns", "Customer segmentation", "Automation", "Analytics"],
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      syncFrequency: "Daily",
      dataPoints: 3456,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows between apps",
      category: "automation",
      status: "connected",
      icon: Zap,
      features: ["Workflow automation", "Trigger actions", "Data sync", "Custom integrations"],
      lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      syncFrequency: "Real-time",
      dataPoints: 567,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      category: "automation",
      status: "connected",
      icon: MessageSquare,
      features: ["Team notifications", "Status updates", "File sharing", "Bot integration"],
      lastSync: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      syncFrequency: "Real-time",
      dataPoints: 234,
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Website and customer behavior analytics",
      category: "analytics",
      status: "disconnected",
      icon: BarChart3,
      features: ["Website analytics", "Customer insights", "Conversion tracking", "Custom reports"],
    },
    {
      id: "xero",
      name: "Xero",
      description: "Alternative accounting solution",
      category: "accounting",
      status: "disconnected",
      icon: FileText,
      features: ["Invoice management", "Expense tracking", "Financial reporting", "Bank reconciliation"],
    },
    {
      id: "square",
      name: "Square",
      description: "Point of sale and payment processing",
      category: "payment",
      status: "error",
      icon: CreditCard,
      features: ["POS integration", "Payment processing", "Inventory sync", "Sales reporting"],
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    // Generate webhook URL for the current environment
    setWebhookUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/integrations`)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "syncing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "accounting":
        return FileText
      case "payment":
        return CreditCard
      case "marketing":
        return Mail
      case "automation":
        return Zap
      case "analytics":
        return BarChart3
      default:
        return Settings
    }
  }

  const handleConnect = async (integrationId: string) => {
    setIsConfiguring(true)

    // Simulate connection process
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? { ...integration, status: "connected", lastSync: new Date() }
            : integration,
        ),
      )
      setIsConfiguring(false)
    }, 2000)
  }

  const handleDisconnect = async (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "disconnected", lastSync: undefined }
          : integration,
      ),
    )
  }

  const handleSync = async (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, status: "syncing" } : integration,
      ),
    )

    // Simulate sync process
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? { ...integration, status: "connected", lastSync: new Date() }
            : integration,
        ),
      )
    }, 3000)
  }

  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<string, Integration[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Integrations</h2>
          <p className="text-muted-foreground">Connect your repair business with essential tools and services</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{integrations.filter((i) => i.status === "connected").length} Connected</Badge>
          <Button variant="outline">
            <Webhook className="mr-2 h-4 w-4" />
            Webhook Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter((i) => i.status === "connected").length}</div>
                <p className="text-xs text-muted-foreground">Active integrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Synced</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + (i.dataPoints || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Records synchronized</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.filter((i) => i.status === "error").length}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <Settings className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{integrations.length}</div>
                <p className="text-xs text-muted-foreground">Total integrations</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest sync activities across all integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations
                    .filter((i) => i.lastSync)
                    .sort((a, b) => (b.lastSync?.getTime() || 0) - (a.lastSync?.getTime() || 0))
                    .slice(0, 5)
                    .map((integration) => (
                      <div key={integration.id} className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <integration.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Synced {integration.lastSync?.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Health</CardTitle>
                <CardDescription>Overall system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>System Health</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sync Success Rate</span>
                      <span>98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Response Time</span>
                      <span>245ms</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="pt-2 border-t">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh All Integrations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <integration.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                        </div>
                      </div>
                      {integration.status === "connected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                          disabled={integration.status === "syncing"}
                        >
                          <RefreshCw className={`h-4 w-4 ${integration.status === "syncing" ? "animate-spin" : ""}`} />
                        </Button>
                      )}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {integration.status === "connected" && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Sync</span>
                            <span>{integration.lastSync?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Frequency</span>
                            <span>{integration.syncFrequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Data Points</span>
                            <span>{integration.dataPoints?.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDisconnect(integration.id)}>
                              Disconnect
                            </Button>
                          </>
                        ) : integration.status === "error" ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleConnect(integration.id)}
                              disabled={isConfiguring}
                            >
                              {isConfiguring ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Reconnecting...
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Reconnect
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Debug
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => handleConnect(integration.id)}
                            disabled={isConfiguring}
                          >
                            {isConfiguring ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Webhook Configuration Modal */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="mr-2 h-5 w-5" />
            Webhook Configuration
          </CardTitle>
          <CardDescription>Configure webhooks for real-time data synchronization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input id="webhook-url" value={webhookUrl} readOnly className="flex-1" />
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use this URL in your integration settings to receive real-time updates
              </p>
            </div>

            <div>
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="webhook-enabled" />
              <Label htmlFor="webhook-enabled">Enable webhook notifications</Label>
            </div>

            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
