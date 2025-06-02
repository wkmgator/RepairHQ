"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DatabaseToggle } from "@/components/database-toggle"
import { Database, ArrowRight, CheckCircle, AlertTriangle, Settings } from "lucide-react"
import Link from "next/link"

export default function DatabaseSettingsPage() {
  const [currentDatabase, setCurrentDatabase] = useState<"firebase" | "supabase">("firebase")

  const handleDatabaseToggle = (database: "firebase" | "supabase") => {
    setCurrentDatabase(database)
    // Here you would implement the actual database switching logic
    console.log(`Switched to ${database}`)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Settings</h1>
          <p className="text-gray-600">Manage your database provider and migration</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="font-semibold">Firebase Firestore</div>
                  <div className="text-sm text-gray-600">NoSQL Document Database</div>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">Active</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Collections:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Documents:</span>
                <span className="font-medium">~1,250</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used:</span>
                <span className="font-medium">45 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-semibold">Supabase PostgreSQL</div>
                  <div className="text-sm text-gray-600">Relational SQL Database</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Ready</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tables:</span>
                <span className="font-medium">9</span>
              </div>
              <div className="flex justify-between">
                <span>Rows:</span>
                <span className="font-medium">~1,250</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used:</span>
                <span className="font-medium">12 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Toggle */}
      <div className="flex justify-center">
        <DatabaseToggle currentDatabase={currentDatabase} onToggle={handleDatabaseToggle} />
      </div>

      {/* Migration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Database schema created in Supabase</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Migration tools configured</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
              <span>Data migration ready to start</span>
            </div>

            <div className="pt-4">
              <Link href="/migration">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Migration Process
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Database Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-left py-2">Firebase</th>
                  <th className="text-left py-2">Supabase</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-2 font-medium">Database Type</td>
                  <td className="py-2">NoSQL Document</td>
                  <td className="py-2">PostgreSQL (SQL)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Complex Queries</td>
                  <td className="py-2">❌ Limited</td>
                  <td className="py-2">✅ Full SQL Support</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Joins & Relations</td>
                  <td className="py-2">❌ Not Supported</td>
                  <td className="py-2">✅ Native Support</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Real-time</td>
                  <td className="py-2">✅ Built-in</td>
                  <td className="py-2">✅ Built-in</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Pricing</td>
                  <td className="py-2">⚠️ Pay per operation</td>
                  <td className="py-2">✅ Predictable monthly</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Vendor Lock-in</td>
                  <td className="py-2">❌ High</td>
                  <td className="py-2">✅ Open Source</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Migration is Safe:</strong> Your Firebase data will remain unchanged during migration. You can test
          Supabase alongside Firebase and switch back anytime.
        </AlertDescription>
      </Alert>
    </div>
  )
}
