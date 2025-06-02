"use client"

import { createClient } from "@supabase/supabase-js"
import { toast } from "@/components/ui/use-toast"

// Create a single supabase client for client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern for client-side Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Server-side Supabase client (for server components and actions)
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// POS Transaction Types
export interface POSTransaction {
  id?: string
  transaction_number: string
  customer_id?: string
  employee_id: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  payment_method: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  items: POSTransactionItem[]
  created_at?: string
  location_id?: string
  register_id?: string
  shift_id?: string
}

export interface POSTransactionItem {
  id?: string
  transaction_id?: string
  inventory_id: string
  name: string
  quantity: number
  unit_price: number
  discount: number
  tax_rate: number
  total: number
}

export interface CashDrawer {
  id?: string
  register_id: string
  employee_id: string
  opening_amount: number
  closing_amount: number
  expected_amount: number
  difference: number
  status: "open" | "closed"
  opened_at: string
  closed_at?: string
  notes?: string
}

// POS Supabase Functions
export const posSupabase = {
  // Transactions
  async createTransaction(transaction: POSTransaction) {
    try {
      const supabase = getSupabaseClient()

      // First create the transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from("pos_transactions")
        .insert({
          transaction_number: transaction.transaction_number,
          customer_id: transaction.customer_id,
          employee_id: transaction.employee_id,
          total_amount: transaction.total_amount,
          tax_amount: transaction.tax_amount,
          discount_amount: transaction.discount_amount,
          payment_method: transaction.payment_method,
          payment_status: transaction.payment_status,
          location_id: transaction.location_id,
          register_id: transaction.register_id,
          shift_id: transaction.shift_id,
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Then create all transaction items
      const transactionItems = transaction.items.map((item) => ({
        transaction_id: transactionData.id,
        inventory_id: item.inventory_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        tax_rate: item.tax_rate,
        total: item.total,
      }))

      const { error: itemsError } = await supabase.from("pos_transaction_items").insert(transactionItems)

      if (itemsError) throw itemsError

      // Update inventory quantities
      for (const item of transaction.items) {
        const { error: inventoryError } = await supabase.rpc("decrease_inventory_quantity", {
          inventory_id_param: item.inventory_id,
          quantity_param: item.quantity,
        })

        if (inventoryError) {
          console.error("Error updating inventory:", inventoryError)
          // Continue processing other items even if one fails
        }
      }

      return { ...transactionData, items: transaction.items }
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast({
        title: "Transaction Failed",
        description: "There was an error processing the transaction.",
        variant: "destructive",
      })
      throw error
    }
  },

  async getTransactions(limit = 50, page = 1) {
    try {
      const supabase = getSupabaseClient()
      const { data, error, count } = await supabase
        .from("pos_transactions")
        .select("*, pos_transaction_items(*)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return {
        transactions: data,
        count: count || 0,
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Failed to Load Transactions",
        description: "There was an error loading the transaction history.",
        variant: "destructive",
      })
      throw error
    }
  },

  async getTransactionById(id: string) {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("pos_transactions")
        .select("*, pos_transaction_items(*)")
        .eq("id", id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error fetching transaction:", error)
      toast({
        title: "Failed to Load Transaction",
        description: "There was an error loading the transaction details.",
        variant: "destructive",
      })
      throw error
    }
  },

  // Cash Drawer Management
  async openCashDrawer(drawerData: Omit<CashDrawer, "id" | "closed_at" | "status" | "difference" | "expected_amount">) {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("pos_cash_drawers")
        .insert({
          register_id: drawerData.register_id,
          employee_id: drawerData.employee_id,
          opening_amount: drawerData.opening_amount,
          status: "open",
          opened_at: new Date().toISOString(),
          expected_amount: drawerData.opening_amount,
          notes: drawerData.notes,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error opening cash drawer:", error)
      toast({
        title: "Failed to Open Cash Drawer",
        description: "There was an error opening the cash drawer.",
        variant: "destructive",
      })
      throw error
    }
  },

  async closeCashDrawer(id: string, closingData: { closing_amount: number; notes?: string }) {
    try {
      const supabase = getSupabaseClient()

      // First get the drawer to calculate the difference
      const { data: drawer, error: fetchError } = await supabase
        .from("pos_cash_drawers")
        .select("expected_amount")
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      const difference = closingData.closing_amount - drawer.expected_amount

      // Update the drawer
      const { data, error } = await supabase
        .from("pos_cash_drawers")
        .update({
          closing_amount: closingData.closing_amount,
          difference,
          status: "closed",
          closed_at: new Date().toISOString(),
          notes: closingData.notes,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error closing cash drawer:", error)
      toast({
        title: "Failed to Close Cash Drawer",
        description: "There was an error closing the cash drawer.",
        variant: "destructive",
      })
      throw error
    }
  },

  async getCurrentCashDrawer(registerId: string) {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("pos_cash_drawers")
        .select("*")
        .eq("register_id", registerId)
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") throw error // PGRST116 is "No rows returned" error

      return data || null
    } catch (error) {
      console.error("Error fetching current cash drawer:", error)
      return null
    }
  },

  // End of Day Reports
  async generateEndOfDayReport(date: string, registerId?: string) {
    try {
      const supabase = getSupabaseClient()
      let query = supabase
        .from("pos_transactions")
        .select(`
          id,
          transaction_number,
          total_amount,
          tax_amount,
          discount_amount,
          payment_method,
          payment_status,
          created_at
        `)
        .gte("created_at", `${date}T00:00:00`)
        .lte("created_at", `${date}T23:59:59`)

      if (registerId) {
        query = query.eq("register_id", registerId)
      }

      const { data: transactions, error } = await query

      if (error) throw error

      // Get cash drawer activity
      let drawerQuery = supabase
        .from("pos_cash_drawers")
        .select("*")
        .or(`opened_at.gte.${date}T00:00:00,closed_at.gte.${date}T00:00:00`)
        .or(`opened_at.lte.${date}T23:59:59,closed_at.lte.${date}T23:59:59`)

      if (registerId) {
        drawerQuery = drawerQuery.eq("register_id", registerId)
      }

      const { data: cashDrawers, error: drawerError } = await drawerQuery

      if (drawerError) throw drawerError

      // Calculate totals
      const totals = transactions.reduce(
        (acc, transaction) => {
          if (transaction.payment_status === "completed") {
            acc.totalSales += transaction.total_amount
            acc.totalTax += transaction.tax_amount
            acc.totalDiscounts += transaction.discount_amount

            // Count by payment method
            acc.paymentMethods[transaction.payment_method] =
              (acc.paymentMethods[transaction.payment_method] || 0) + transaction.total_amount
          }
          return acc
        },
        {
          totalSales: 0,
          totalTax: 0,
          totalDiscounts: 0,
          transactionCount: transactions.length,
          paymentMethods: {} as Record<string, number>,
        },
      )

      return {
        date,
        transactions,
        cashDrawers,
        totals,
      }
    } catch (error) {
      console.error("Error generating end of day report:", error)
      toast({
        title: "Failed to Generate Report",
        description: "There was an error generating the end of day report.",
        variant: "destructive",
      })
      throw error
    }
  },
}
