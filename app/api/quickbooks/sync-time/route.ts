import { type NextRequest, NextResponse } from "next/server"
import { QuickBooksAPI } from "@/lib/quickbooks-api"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, companyId, startDate, endDate } = await request.json()

    const supabase = createClient()

    // Get QuickBooks integration
    const { data: integration, error: integrationError } = await supabase
      .from("quickbooks_integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("company_id", companyId)
      .eq("is_active", true)
      .single()

    if (integrationError || !integration) {
      return NextResponse.json({ error: "QuickBooks integration not found" }, { status: 404 })
    }

    // Get time entries to sync
    let query = supabase
      .from("time_entries")
      .select(`
        *,
        employee:employees(id, first_name, last_name, quickbooks_employee_id),
        ticket:tickets(id, title, customer:customers(id, name, quickbooks_customer_id))
      `)
      .eq("company_id", companyId)
      .is("quickbooks_time_activity_id", null)

    if (startDate) query = query.gte("clock_in", startDate)
    if (endDate) query = query.lte("clock_out", endDate)

    const { data: timeEntries, error: timeEntriesError } = await query

    if (timeEntriesError) {
      return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 })
    }

    const qbAPI = new QuickBooksAPI()
    const tokens = {
      access_token: integration.access_token,
      refresh_token: integration.refresh_token,
      expires_in: 3600,
      token_type: integration.token_type,
      scope: integration.scope,
      company_id: integration.qb_company_id,
      created_at: new Date(integration.connected_at).getTime(),
    }

    let syncedCount = 0
    const errors: string[] = []

    for (const timeEntry of timeEntries) {
      try {
        if (!timeEntry.employee?.quickbooks_employee_id) {
          errors.push(
            `Employee ${timeEntry.employee?.first_name} ${timeEntry.employee?.last_name} not linked to QuickBooks`,
          )
          continue
        }

        if (!timeEntry.clock_out) {
          errors.push(`Time entry ${timeEntry.id} is still active (no clock out time)`)
          continue
        }

        const clockIn = new Date(timeEntry.clock_in)
        const clockOut = new Date(timeEntry.clock_out)
        const totalMinutes = Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        const timeActivity = {
          TxnDate: clockIn.toISOString().split("T")[0],
          NameRef: {
            value: timeEntry.employee.quickbooks_employee_id,
            name: `${timeEntry.employee.first_name} ${timeEntry.employee.last_name}`,
          },
          Hours: hours,
          Minutes: minutes,
          Description: timeEntry.notes || `Work on ticket: ${timeEntry.ticket?.title || "General work"}`,
        }

        // Add customer reference if available
        if (timeEntry.ticket?.customer?.quickbooks_customer_id) {
          timeActivity.CustomerRef = {
            value: timeEntry.ticket.customer.quickbooks_customer_id,
            name: timeEntry.ticket.customer.name,
          }
        }

        const createdTimeActivity = await qbAPI.createTimeActivity(tokens, timeActivity)

        // Update time entry with QuickBooks ID
        await supabase
          .from("time_entries")
          .update({
            quickbooks_time_activity_id: createdTimeActivity.Id,
            quickbooks_synced_at: new Date().toISOString(),
          })
          .eq("id", timeEntry.id)

        syncedCount++
      } catch (error) {
        console.error(`Failed to sync time entry ${timeEntry.id}:`, error)
        errors.push(`Failed to sync time entry ${timeEntry.id}: ${error.message}`)
      }
    }

    // Update last sync time
    await supabase
      .from("quickbooks_integrations")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", integration.id)

    return NextResponse.json({
      syncedCount,
      totalEntries: timeEntries.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("QuickBooks sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
