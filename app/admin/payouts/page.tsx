import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PayoutProcessor from "@/components/admin/payout-processor"
import { resellerService } from "@/lib/reseller-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPayoutsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  let initialResellersData = null
  let initialError = null

  try {
    initialResellersData = await resellerService.getResellersWithPayableCommissions()
  } catch (error: any) {
    console.error("Error fetching initial payout data:", error)
    initialError = error.message || "Failed to load initial payout data."
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Process Commission Payouts</h1>
      <PayoutProcessor initialResellersData={initialResellersData} initialError={initialError} />
    </div>
  )
}
