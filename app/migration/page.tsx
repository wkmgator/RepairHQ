"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  Package,
  FileText,
  RefreshCw,
  Download,
} from "lucide-react"
import { createMigrator, type MigrationProgress } from "@/lib/migration-utils"

export default function MigrationPage() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<MigrationProgress | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>("")
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    if (user?.uid) {
      loadMigrationStatus()
    }
  }, [user?.uid])

  const loadMigrationStatus = async () => {
    if (!user?.uid) return

    try {
      const migrator = createMigrator(user.uid)
      const status = await migrator.getMigrationStatus()
      setProgress(status)
    } catch (error) {
      console.error("Failed to load migration status:", error)
    }
  }

  const runMigration = async () => {
    if (!user?.uid) return

    setMigrating(true)
    setCompleted([])
    const migrator = createMigrator(user.uid)

    try {
      // Migrate customers
      setCurrentStep("Migrating customers...")
      const customerResult = await migrator.migrateCustomers()
      setCompleted((prev) => [...prev, `customers:${customerResult.success}:${customerResult.errors.length}`])

      // Migrate inventory
      setCurrentStep("Migrating inventory...")
      const inventoryResult = await migrator.migrateInventory()
      setCompleted((prev) => [...prev, `inventory:${inventoryResult.success}:${inventoryResult.errors.length}`])

      setCurrentStep("Migration completed!")
      await loadMigrationStatus()
    } catch (error) {
      console.error("Migration failed:", error)
      setCurrentStep("Migration failed")
    } finally {
      setMigrating(false)
    }
  }

  const getProgressPercentage = (migrated: number, total: number) => {
    return total > 0 ? Math.round((migrated / total) * 100) : 0
  }

  const getStatusColor = (migrated: number, total: number) => {
    if (total === 0) return "bg-gray-100 text-gray-800"
    if (migrated === total) return "bg-green-100 text-green-800"
    if (migrated > 0) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusText = (migrated: number, total: number) => {
    if (total === 0) return "No Data"
    if (migrated === total) return "Complete"
    if (migrated > 0) return "Partial"
    return "Pending"
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 p-3 bg-orange-100 rounded-lg">
            <Database className="h-6 w-6 text-orange-600" />
            <span className="font-medium text-orange-800">Firebase</span>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400" />
          <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
            <Database className="h-6 w-6 text-green-600" />
            <span className="font-medium text-green-800">Supabase</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Database Migration</h1>
          <p className="text-gray-600">Migrate your data from Firebase to Supabase</p>
        </div>
      </div>

      {/* Migration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Why Migrate to Supabase?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Supabase Benefits</h4>
              <ul className="space-y-1 text-sm">
                <li>• PostgreSQL with complex queries & joins</li>
                <li>• Real-time subscriptions built-in</li>
                <li>• Predictable pricing (no surprise bills)</li>
                <li>• Open source (no vendor lock-in)</li>
                <li>• Better performance for complex data</li>
                <li>• SQL aggregations & analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">⚠️ Firebase Limitations</h4>
              <ul className="space-y-1 text-sm">
                <li>• NoSQL constraints for complex queries</li>
                <li>• Expensive at scale (read/write costs)</li>
                <li>• Limited aggregation capabilities</li>
                <li>• No SQL joins or complex relationships</li>
                <li>• Vendor lock-in with Google</li>
                <li>• Complex security rules</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Status */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progress.customers.migrated}</span>
                  <Badge className={getStatusColor(progress.customers.migrated, progress.customers.total)}>
                    {getStatusText(progress.customers.migrated, progress.customers.total)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.customers.migrated} of {progress.customers.total} migrated
                </div>
                <Progress
                  value={getProgressPercentage(progress.customers.migrated, progress.customers.total)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progress.inventory.migrated}</span>
                  <Badge className={getStatusColor(progress.inventory.migrated, progress.inventory.total)}>
                    {getStatusText(progress.inventory.migrated, progress.inventory.total)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.inventory.migrated} of {progress.inventory.total} migrated
                </div>
                <Progress
                  value={getProgressPercentage(progress.inventory.migrated, progress.inventory.total)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progress.tickets.migrated}</span>
                  <Badge className={getStatusColor(progress.tickets.migrated, progress.tickets.total)}>
                    {getStatusText(progress.tickets.migrated, progress.tickets.total)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.tickets.migrated} of {progress.tickets.total} migrated
                </div>
                <Progress
                  value={getProgressPercentage(progress.tickets.migrated, progress.tickets.total)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migration Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {migrating && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>{currentStep}</AlertDescription>
            </Alert>
          )}

          {completed.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Migration Results:</h4>
              {completed.map((result, index) => {
                const [type, success, errors] = result.split(":")
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {success} migrated
                      </Badge>
                      {Number.parseInt(errors) > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          {errors} errors
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button onClick={runMigration} disabled={migrating || !user} className="flex-1">
              {migrating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Start Migration
                </>
              )}
            </Button>

            <Button variant="outline" onClick={loadMigrationStatus} disabled={migrating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This migration will copy data from Firebase to Supabase. Your Firebase data
              will remain unchanged. You can run this multiple times safely.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>✅ Supabase database schema created</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>✅ Migration tools built</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
              <span>🔄 Data migration (current step)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              <span>⏳ Update components to use Supabase</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              <span>⏳ Switch authentication to Supabase</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              <span>⏳ Decommission Firebase</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
