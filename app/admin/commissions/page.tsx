import { resellerService } from "@/lib/reseller-service"
import { PendingCommissionsTable } from "@/components/admin/pending-commissions-table"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export const dynamic = "force-dynamic" // Ensure fresh data on each request

async function AdminCommissionsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin") // Or your login page
  }

  // Fetch user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from("users") // Or your user_profiles table
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to view this page. Admin access is required.</AlertDescription>
        </Alert>
      </div>
    )
  }

  let pendingCommissions = []
  let fetchError = null
  try {
    pendingCommissions = await resellerService.getPendingCommissions()
  } catch (error: any) {
    console.error("Failed to fetch pending commissions:", error)
    fetchError = error.message
  }

  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Pending Commissions</h1>
        <p className="text-muted-foreground">Review, approve, or reject pending reseller commissions.</p>
      </header>

      {fetchError && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>Could not load pending commissions: {fetchError}</AlertDescription>
        </Alert>
      )}

      <PendingCommissionsTable pendingCommissions={pendingCommissions} />
    </div>
  )
}

export default AdminCommissionsPage
