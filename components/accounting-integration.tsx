"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  FolderSyncIcon as Sync,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  FileText,
  Calculator,
  TrendingUp,
  Building,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AccountingProvider {
  id: string
  name: string
  logo: string
  connected: boolean
  lastSync: string
  status: "connected" | "error" | "syncing" | "disconnected"
  features: string[]
}

interface SyncStatus {
  entity_type: string
  total_records: number
  synced_records: number
  failed_records: number
  last_sync: string
  status: string
}

export default function AccountingIntegration() {
  const [loading, setLoading] = useState(true)
  const [providers, setProviders] = useState<AccountingProvider[]>([
    {
      id: "quickbooks",
      name: "QuickBooks Online",
      logo: "/logos/quickbooks.png",
      connected: true,
      lastSync: "2024-01-15T10:30:00Z",
      status: "connected",
      features: ["Invoices", "Customers", "Payments", "Expenses", "Reports"],
    },
    {
      id: "xero",
      name: "Xero",
      logo: "/logos/xero.png",
      connected: false,
      lastSync: "",
      status: "disconnected",
      features: ["Invoices", "Customers", "Payments", "Bank Feeds", "Reports"],
    },
    {
      id: "freshbooks",
      name: "FreshBooks",
      logo: "/logos/freshbooks.png",
      connected: false,
      lastSync: "",
      status: "disconnected",
      features: ["Invoices", "Time Tracking", "Expenses", "Projects", "Reports"],
    },
  ])
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([])
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("hourly")
  const [selectedProvider, setSelectedProvider] = useState("quickbooks")

  useEffect(() => {
    fetchSyncStatuses()
  }, [])

  const fetchSyncStatuses = async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from("accounting_sync").select("*").order("last_synced", { ascending: false })

      // Group by entity type and get latest status
      const statusMap = new Map()
      data?.forEach((record) => {
        if (!statusMap.has(record.entity_type)) {
          statusMap.set(record.entity_type, {
            entity_type: record.entity_type,
            total_records: 0,
            synced_records: 0,
            failed_records: 0,
            last_sync: record.last_synced,
            status: record.sync_status,
          })
        }
      })

      setSyncStatuses(Array.from(statusMap.values()))
    } catch (error) {
      console.error("Error fetching sync statuses:", error)
    } finally {
      setLoading(false)
    }
  }

  const connectProvider = async (providerId: string) => {
    try {
      // In a real app, this would initiate OAuth flow
      const updatedProviders = providers.map((p) =>
        p.id === providerId
          ? { ...p, connected: true, status: "connected" as const, lastSync: new Date().toISOString() }
          : p,
      )
      setProviders(updatedProviders)
      alert(`Connected to ${providers.find((p) => p.id === providerId)?.name} successfully!`)
    } catch (error) {
      console.error("Error connecting provider:", error)
    }
  }

  const disconnectProvider = async (providerId: string) => {
    try {
      const updatedProviders = providers.map((p) =>
        p.id === providerId ? { ...p, connected: false, status: "disconnected" as const } : p,
      )
      setProviders(updatedProviders)
      alert(`Disconnected from ${providers.find((p) => p.id === providerId)?.name}`)
    } catch (error) {
      console.error("Error disconnecting provider:", error)
    }
  }

  const syncData = async (entityType?: string) => {
    try {
      const connectedProvider = providers.find((p) => p.connected)
      if (!connectedProvider) {
        alert("No accounting software connected")
        return
      }

      // Update provider status to syncing
      const updatedProviders = providers.map((p) => (p.connected ? { ...p, status: "syncing" as const } : p))
      setProviders(updatedProviders)

      // Simulate sync process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update sync status
      const { error } = await supabase.from("accounting_sync").insert({
        provider: connectedProvider.id,
        entity_type: entityType || "all",
        entity_id: "bulk-sync",
        sync_status: "completed",
        last_synced: new Date().toISOString(),
      })

      if (error) throw error

      // Update provider status back to connected
      const finalProviders = providers.map((p) =>
        p.connected ? { ...p, status: "connected" as const, lastSync: new Date().toISOString() } : p,
      )
      setProviders(finalProviders)

      alert("Data synced successfully!")
      fetchSyncStatuses()
    } catch (error) {
      console.error("Error syncing data:", error)
      alert("Error syncing data")
    }
  }

  const exportData = async (format: string) => {
    try {
      // In a real app, this would generate and download the export file
      alert(`Exporting data in ${format.toUpperCase()} format...`)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "syncing":
        return <Sync className="w-5 h-5 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "syncing":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounting Integration</h1>
          <p className="text-gray-600">Connect and sync with your accounting software</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => syncData()}>
            <Sync className="w-4 h-4 mr-2" />
            Sync All Data
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className={provider.connected ? "border-green-200 bg-green-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {getStatusIcon(provider.status)}
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {provider.connected && (
                  <div>
                    <span className="text-sm font-medium">Last Sync:</span>
                    <div className="text-sm text-gray-600">{new Date(provider.lastSync).toLocaleString()}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  {provider.connected ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => syncData()}>
                        <Sync className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => disconnectProvider(provider.id)}>
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => connectProvider(provider.id)}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sync-status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync-status">Sync Status</TabsTrigger>
          <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="tax-integration">Tax Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="sync-status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Status</CardTitle>
              <CardDescription>Monitor data sync between RepairHQ and your accounting software</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {syncStatuses.map((status) => (
                  <div key={status.entity_type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium capitalize">{status.entity_type.replace("_", " ")}</h4>
                        <p className="text-sm text-gray-600">
                          Last synced: {new Date(status.last_sync).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(status.status)}>
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </Badge>
                    </div>
                    <Progress
                      value={status.total_records > 0 ? (status.synced_records / status.total_records) * 100 : 0}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {status.synced_records} of {status.total_records} synced
                      </span>
                      {status.failed_records > 0 && (
                        <span className="text-red-600">{status.failed_records} failed</span>
                      )}
                    </div>
                  </div>
                ))}

                {syncStatuses.length === 0 && (
                  <div className="text-center py-12">
                    <Sync className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No sync history</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Connect an accounting provider and sync data to see status here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Mapping Configuration</CardTitle>
              <CardDescription>Configure how RepairHQ data maps to your accounting software</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Customer Mapping</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RepairHQ Customer</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">QB Customer</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Name</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">Display Name</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Email</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">Primary Email</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Invoice Mapping</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RepairHQ Invoice</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">QB Invoice</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Invoice Number</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">Doc Number</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Amount</span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm">Total Amt</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Account Mapping</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Revenue Account</label>
                      <Select defaultValue="sales-revenue">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales-revenue">Sales Revenue</SelectItem>
                          <SelectItem value="service-revenue">Service Revenue</SelectItem>
                          <SelectItem value="repair-revenue">Repair Revenue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expense Account</label>
                      <Select defaultValue="cost-of-goods">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cost-of-goods">Cost of Goods Sold</SelectItem>
                          <SelectItem value="operating-expenses">Operating Expenses</SelectItem>
                          <SelectItem value="parts-expense">Parts Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure automatic synchronization and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-sync</h4>
                  <p className="text-sm text-gray-600">Automatically sync data at regular intervals</p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>

              {autoSync && (
                <div>
                  <label className="text-sm font-medium">Sync Frequency</label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">Automatic Actions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Create customer on first invoice</span>
                      <p className="text-xs text-gray-600">Automatically create customers in accounting software</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Sync payments immediately</span>
                      <p className="text-xs text-gray-600">Sync payment records as soon as they're received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Update inventory levels</span>
                      <p className="text-xs text-gray-600">Keep inventory quantities in sync</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and export financial reports for accounting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Profit & Loss
                    </CardTitle>
                    <CardDescription>Income and expense summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={() => exportData("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportData("excel")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Cash Flow
                    </CardTitle>
                    <CardDescription>Cash inflows and outflows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={() => exportData("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportData("excel")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Tax Summary
                    </CardTitle>
                    <CardDescription>Tax calculations and summaries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={() => exportData("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportData("excel")}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Integration</CardTitle>
              <CardDescription>Automated tax calculation and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Tax Providers</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5" />
                        <span className="font-medium">Avalara</span>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5" />
                        <span className="font-medium">TaxJar</span>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Tax Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Default Tax Rate</label>
                      <Input type="number" step="0.01" placeholder="8.25" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tax Jurisdiction</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Automated Tax Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Auto-calculate sales tax</span>
                      <p className="text-xs text-gray-600">Automatically calculate tax on invoices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Tax exemption handling</span>
                      <p className="text-xs text-gray-600">Handle tax-exempt customers and transactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Generate tax reports</span>
                      <p className="text-xs text-gray-600">Automatically generate tax filing reports</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
