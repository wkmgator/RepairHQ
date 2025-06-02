"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickBooksIntegration } from "@/components/quickbooks-integration"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { CustomerPortal } from "@/components/customer-portal"
import { LoyaltyRewards } from "@/components/loyalty-rewards"
import { APIIntegration } from "@/components/api-integration"

export default function IntegrationsPage() {
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const searchParams = useSearchParams()

  const success = searchParams.get("success")
  const error = searchParams.get("error")

  useEffect(() => {
    // Fetch user and company data
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Replace with your actual user/company fetching logic
      setUser({ id: "user-123" })
      setCompany({ id: "company-456" })
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect RepairHQ with your favorite business tools</p>
      </div>

      {success === "quickbooks_connected" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            QuickBooks has been successfully connected! You can now sync employee time tracking data.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error === "callback_failed" && "Failed to complete QuickBooks connection. Please try again."}
            {error === "database_error" && "Database error occurred. Please contact support."}
            {error === "missing_parameters" && "Missing required parameters. Please try again."}
            {error &&
              !["callback_failed", "database_error", "missing_parameters"].includes(error) &&
              `Connection error: ${error}`}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounting & Payroll</CardTitle>
            <CardDescription>Integrate with accounting software for seamless financial management</CardDescription>
          </CardHeader>
          <CardContent>
            {user && company && <QuickBooksIntegration userId={user.id} companyId={company.id} />}
          </CardContent>
        </Card>

        <CustomerPortal />
        <LoyaltyRewards />
        <APIIntegration />

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>More integrations are on the way</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg opacity-50">
                <h3 className="font-medium">Xero</h3>
                <p className="text-sm text-muted-foreground">Accounting integration</p>
              </div>
              <div className="p-4 border rounded-lg opacity-50">
                <h3 className="font-medium">Sage</h3>
                <p className="text-sm text-muted-foreground">Business management</p>
              </div>
              <div className="p-4 border rounded-lg opacity-50">
                <h3 className="font-medium">ADP</h3>
                <p className="text-sm text-muted-foreground">Payroll processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
