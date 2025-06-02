import { supabase } from "@/lib/supabase"

export interface POSTransaction {
  id?: string
  customer_id?: string
  employee_id: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  payment_method: "cash" | "card" | "digital"
  cash_received?: number
  change_amount?: number
  status: "pending" | "completed" | "refunded" | "voided"
  created_at?: string
  updated_at?: string
  items: POSTransactionItem[]
}

export interface POSTransactionItem {
  id?: string
  transaction_id?: string
  item_id: string
  name: string
  sku: string
  quantity: number
  unit_price: number
  total_price: number
  category?: "repair" | "accessory" | "device" | "service"
}

export interface PaymentResult {
  success: boolean
  transaction_id?: string
  message: string
  receipt_data?: any
}

export class POSService {
  static async processTransaction(transaction: POSTransaction): Promise<PaymentResult> {
    try {
      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          customer_id: transaction.customer_id,
          employee_id: transaction.employee_id,
          subtotal: transaction.subtotal,
          discount_amount: transaction.discount_amount,
          tax_amount: transaction.tax_amount,
          total_amount: transaction.total_amount,
          payment_method: transaction.payment_method,
          cash_received: transaction.cash_received,
          change_amount: transaction.change_amount,
          status: transaction.status,
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      const transaction_id = transactionData.id

      // Create transaction items
      const transactionItems = transaction.items.map((item) => ({
        transaction_id,
        item_id: item.item_id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        category: item.category,
      }))

      const { error: itemsError } = await supabase.from("transaction_items").insert(transactionItems)

      if (itemsError) throw itemsError

      // Update inventory quantities
      for (const item of transaction.items) {
        const { data: inventoryItem, error: getError } = await supabase
          .from("inventory_items")
          .select("quantity_in_stock")
          .eq("id", item.item_id)
          .single()

        if (getError) throw getError

        const newQuantity = (inventoryItem.quantity_in_stock || 0) - item.quantity

        const { error: updateError } = await supabase
          .from("inventory_items")
          .update({
            quantity_in_stock: newQuantity >= 0 ? newQuantity : 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.item_id)

        if (updateError) throw updateError
      }

      // Update customer loyalty points if applicable
      if (transaction.customer_id) {
        const loyaltyPointsEarned = Math.floor(transaction.total_amount / 10)

        const { data: customerData, error: getCustomerError } = await supabase
          .from("customers")
          .select("loyalty_points")
          .eq("id", transaction.customer_id)
          .single()

        if (getCustomerError) throw getCustomerError

        const { error: updateCustomerError } = await supabase
          .from("customers")
          .update({
            loyalty_points: (customerData.loyalty_points || 0) + loyaltyPointsEarned,
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.customer_id)

        if (updateCustomerError) throw updateCustomerError
      }

      // Generate receipt data
      const receiptData = this.generateReceiptData(transaction, transaction_id)

      return {
        success: true,
        transaction_id,
        message: "Transaction processed successfully",
        receipt_data: receiptData,
      }
    } catch (error) {
      console.error("Transaction processing error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      }
    }
  }

  static async voidTransaction(transactionId: string): Promise<boolean> {
    try {
      // Get transaction items to restore inventory
      const { data: items, error: itemsError } = await supabase
        .from("transaction_items")
        .select("*")
        .eq("transaction_id", transactionId)

      if (itemsError) throw itemsError

      // Restore inventory quantities
      for (const item of items || []) {
        const { data: inventoryItem, error: getError } = await supabase
          .from("inventory_items")
          .select("quantity_in_stock")
          .eq("id", item.item_id)
          .single()

        if (getError && getError.code !== "PGRST116") continue // Skip if item doesn't exist

        const newQuantity = (inventoryItem?.quantity_in_stock || 0) + item.quantity

        await supabase
          .from("inventory_items")
          .update({
            quantity_in_stock: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.item_id)
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: "voided",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error("Error voiding transaction:", error)
      return false
    }
  }

  static async refundTransaction(transactionId: string, items?: POSTransactionItem[]): Promise<boolean> {
    try {
      // Get original transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single()

      if (transactionError) throw transactionError

      // Get transaction items if not provided
      let refundItems = items
      if (!refundItems) {
        const { data: originalItems, error: itemsError } = await supabase
          .from("transaction_items")
          .select("*")
          .eq("transaction_id", transactionId)

        if (itemsError) throw itemsError
        refundItems = originalItems
      }

      // Restore inventory quantities
      for (const item of refundItems || []) {
        const { data: inventoryItem, error: getError } = await supabase
          .from("inventory_items")
          .select("quantity_in_stock")
          .eq("id", item.item_id)
          .single()

        if (getError && getError.code !== "PGRST116") continue // Skip if item doesn't exist

        const newQuantity = (inventoryItem?.quantity_in_stock || 0) + item.quantity

        await supabase
          .from("inventory_items")
          .update({
            quantity_in_stock: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.item_id)
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          status: "refunded",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error("Error refunding transaction:", error)
      return false
    }
  }

  static generateReceiptData(transaction: POSTransaction, transactionId: string) {
    return {
      receipt_number: transactionId.substring(0, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      items: transaction.items,
      subtotal: transaction.subtotal,
      discount: transaction.discount_amount,
      tax: transaction.tax_amount,
      total: transaction.total_amount,
      payment_method: transaction.payment_method,
      cash_received: transaction.cash_received,
      change: transaction.change_amount,
    }
  }

  static async getTransactionHistory(
    customerId?: string,
    employeeId?: string,
    startDate?: string,
    endDate?: string,
    limit = 50,
    offset = 0,
  ): Promise<{ transactions: any[]; count: number }> {
    try {
      let query = supabase
        .from("transactions")
        .select(
          `
          *,
          customer:customers(id, first_name, last_name, phone),
          employee:employees(id, first_name, last_name),
          items:transaction_items(*)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (customerId) {
        query = query.eq("customer_id", customerId)
      }

      if (employeeId) {
        query = query.eq("employee_id", employeeId)
      }

      if (startDate) {
        query = query.gte("created_at", startDate)
      }

      if (endDate) {
        query = query.lte("created_at", endDate)
      }

      const { data, count, error } = await query

      if (error) throw error

      return {
        transactions: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      return { transactions: [], count: 0 }
    }
  }

  static calculateTax(subtotal: number, taxRate: number): number {
    return subtotal * taxRate
  }

  static calculateDiscount(subtotal: number, discountPercent: number): number {
    return subtotal * (discountPercent / 100)
  }
}

export const TAX_RATES = {
  DEFAULT: 0.0875, // 8.75%
  FOOD: 0.0, // Tax-exempt
  SERVICES: 0.0875,
}

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  DIGITAL: "digital",
} as const

export const PRODUCT_CATEGORIES = {
  REPAIR: "repair",
  ACCESSORY: "accessory",
  DEVICE: "device",
  SERVICE: "service",
} as const
