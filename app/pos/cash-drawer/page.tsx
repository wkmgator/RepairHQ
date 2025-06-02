import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase-pos"
import { redirect } from "next/navigation"
import CashDrawerManagement from "@/components/cash-drawer-management"

export const metadata: Metadata = {
  title: "Cash Drawer Management - RepairHQ",
  description: "Manage your POS cash drawer",
}

async function getCashDrawerData() {
  const supabase = createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "unauthorized" }
  }

  // Get active register for current user
  const { data: register, error: registerError } = await supabase
    .from("pos_registers")
    .select("*")
    .eq("status", "active")
    .eq("current_user_id", user.id)
    .maybeSingle()

  if (registerError) {
    console.error("Error fetching register:", registerError)
    return { error: "database_error" }
  }

  if (!register) {
    return { error: "no_register" }
  }

  // Get current cash drawer
  const { data: cashDrawer, error: drawerError } = await supabase
    .from("pos_cash_drawers")
    .select("*")
    .eq("register_id", register.id)
    .eq("status", "open")
    .maybeSingle()

  if (drawerError) {
    console.error("Error fetching cash drawer:", drawerError)
    return { error: "database_error" }
  }

  // Get cash drawer history
  const { data: drawerHistory, error: historyError } = await supabase
    .from("pos_cash_drawers")
    .select("*")
    .eq("register_id", register.id)
    .order("opened_at", { ascending: false })
    .limit(10)

  if (historyError) {
    console.error("Error fetching cash drawer history:", historyError)
    return { error: "database_error" }
  }

  return {
    register,
    cashDrawer,
    drawerHistory: drawerHistory || [],
    user,
  }
}

export default async function CashDrawerPage() {
  const { register, cashDrawer, drawerHistory, error, user } = await getCashDrawerData()

  // Handle errors
  if (error === "unauthorized") {
    redirect("/auth/signin?callbackUrl=/pos/cash-drawer")
  }

  if (error === "no_register") {
    redirect("/pos/settings/registers")
  }

  if (error === "database_error") {
    // Show error page
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Database Error</h1>
        <p>There was an error connecting to the database. Please try again later.</p>
      </div>
    )
  }

  return (
    <CashDrawerManagement register={register} currentDrawer={cashDrawer} drawerHistory={drawerHistory} user={user} />
  )
}
