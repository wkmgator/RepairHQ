import { createClient } from "@supabase/supabase-js"

// Advanced POS Service with comprehensive functionality
export class AdvancedPOSService {
  private supabase: ReturnType<typeof createClient>

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  // Split Payment Processing
  async processSplitPayment(transaction: any, payments: SplitPayment[]) {
    try {
      const { data: transactionData, error: transactionError } = await this.supabase
        .from("pos_transactions")
        .insert({
          ...transaction,
          payment_status: "completed",
          split_payment: true,
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Process each payment method
      for (const payment of payments) {
        const { error: paymentError } = await this.supabase.from("pos_split_payments").insert({
          transaction_id: transactionData.id,
          payment_method: payment.method,
          amount: payment.amount,
          reference_number: payment.reference,
          status: "completed",
        })

        if (paymentError) throw paymentError
      }

      return { success: true, transaction: transactionData }
    } catch (error) {
      console.error("Split payment error:", error)
      throw error
    }
  }

  // Layaway Management
  async createLayaway(layawayData: LayawayData) {
    try {
      const { data, error } = await this.supabase
        .from("pos_layaways")
        .insert({
          customer_id: layawayData.customer_id,
          total_amount: layawayData.total_amount,
          deposit_amount: layawayData.deposit_amount,
          remaining_balance: layawayData.total_amount - layawayData.deposit_amount,
          due_date: layawayData.due_date,
          status: "active",
          items: layawayData.items,
        })
        .select()
        .single()

      if (error) throw error

      // Create initial payment record
      await this.supabase.from("pos_layaway_payments").insert({
        layaway_id: data.id,
        amount: layawayData.deposit_amount,
        payment_method: layawayData.payment_method,
        payment_date: new Date().toISOString(),
      })

      return { success: true, layaway: data }
    } catch (error) {
      console.error("Layaway creation error:", error)
      throw error
    }
  }

  // Gift Card Management
  async createGiftCard(giftCardData: GiftCardData) {
    try {
      const cardNumber = this.generateGiftCardNumber()
      const { data, error } = await this.supabase
        .from("pos_gift_cards")
        .insert({
          card_number: cardNumber,
          initial_balance: giftCardData.amount,
          current_balance: giftCardData.amount,
          customer_id: giftCardData.customer_id,
          expiry_date: giftCardData.expiry_date,
          status: "active",
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, giftCard: data }
    } catch (error) {
      console.error("Gift card creation error:", error)
      throw error
    }
  }

  // Customer Credit Management
  async addCustomerCredit(customerId: string, amount: number, reason: string) {
    try {
      // Get current credit balance
      const { data: customer, error: customerError } = await this.supabase
        .from("customers")
        .select("store_credit")
        .eq("id", customerId)
        .single()

      if (customerError) throw customerError

      const newBalance = (customer.store_credit || 0) + amount

      // Update customer credit
      const { error: updateError } = await this.supabase
        .from("customers")
        .update({ store_credit: newBalance })
        .eq("id", customerId)

      if (updateError) throw updateError

      // Log credit transaction
      await this.supabase.from("pos_credit_transactions").insert({
        customer_id: customerId,
        amount: amount,
        transaction_type: "credit",
        reason: reason,
        balance_after: newBalance,
      })

      return { success: true, newBalance }
    } catch (error) {
      console.error("Customer credit error:", error)
      throw error
    }
  }

  // Loyalty Points Management
  async calculateLoyaltyPoints(amount: number, customerId?: string) {
    const basePoints = Math.floor(amount / 10) // 1 point per $10

    if (customerId) {
      // Check for bonus multipliers
      const { data: customer } = await this.supabase
        .from("customers")
        .select("loyalty_tier")
        .eq("id", customerId)
        .single()

      const multiplier = this.getLoyaltyMultiplier(customer?.loyalty_tier)
      return Math.floor(basePoints * multiplier)
    }

    return basePoints
  }

  // Tax Calculation with Multiple Rates
  async calculateTaxes(items: any[], locationId: string) {
    const { data: taxRates, error } = await this.supabase
      .from("pos_tax_rates")
      .select("*")
      .eq("location_id", locationId)
      .eq("active", true)

    if (error) throw error

    let totalTax = 0
    const taxBreakdown: TaxBreakdown[] = []

    for (const taxRate of taxRates || []) {
      const applicableItems = items.filter((item) => this.isTaxApplicable(item, taxRate))

      const taxableAmount = applicableItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

      const taxAmount = taxableAmount * (taxRate.rate / 100)
      totalTax += taxAmount

      if (taxAmount > 0) {
        taxBreakdown.push({
          name: taxRate.name,
          rate: taxRate.rate,
          amount: taxAmount,
          taxable_amount: taxableAmount,
        })
      }
    }

    return { totalTax, taxBreakdown }
  }

  // Discount Management
  async applyDiscount(items: any[], discountCode?: string, discountPercent?: number) {
    let discount = 0
    let discountType = "manual"

    if (discountCode) {
      const { data: coupon, error } = await this.supabase
        .from("pos_coupons")
        .select("*")
        .eq("code", discountCode)
        .eq("active", true)
        .gte("expiry_date", new Date().toISOString())
        .single()

      if (error || !coupon) {
        throw new Error("Invalid or expired discount code")
      }

      discount = this.calculateCouponDiscount(items, coupon)
      discountType = "coupon"
    } else if (discountPercent) {
      const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
      discount = subtotal * (discountPercent / 100)
      discountType = "manual"
    }

    return { discount, discountType }
  }

  // Receipt Customization
  async generateCustomReceipt(transaction: any, template = "default") {
    const { data: receiptTemplate, error } = await this.supabase
      .from("pos_receipt_templates")
      .select("*")
      .eq("name", template)
      .single()

    if (error) {
      // Use default template
      return this.generateDefaultReceipt(transaction)
    }

    return this.processReceiptTemplate(transaction, receiptTemplate)
  }

  // Inventory Integration
  async updateInventoryFromSale(items: any[], locationId: string) {
    for (const item of items) {
      // Update main inventory
      await this.supabase.rpc("update_inventory_quantity", {
        item_id: item.inventory_id,
        quantity_change: -item.quantity,
        location_id: locationId,
      })

      // Check for low stock alerts
      const { data: inventoryItem } = await this.supabase
        .from("inventory_items")
        .select("quantity_in_stock, low_stock_threshold, name")
        .eq("id", item.inventory_id)
        .single()

      if (inventoryItem && inventoryItem.quantity_in_stock <= inventoryItem.low_stock_threshold) {
        await this.createLowStockAlert(inventoryItem)
      }
    }
  }

  // Return/Exchange Processing
  async processReturn(originalTransactionId: string, returnItems: any[], reason: string) {
    try {
      const { data: originalTransaction, error } = await this.supabase
        .from("pos_transactions")
        .select("*")
        .eq("id", originalTransactionId)
        .single()

      if (error) throw error

      const returnAmount = returnItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

      // Create return transaction
      const { data: returnTransaction, error: returnError } = await this.supabase
        .from("pos_returns")
        .insert({
          original_transaction_id: originalTransactionId,
          return_amount: returnAmount,
          reason: reason,
          items: returnItems,
          status: "completed",
        })
        .select()
        .single()

      if (returnError) throw returnError

      // Update inventory
      for (const item of returnItems) {
        await this.supabase.rpc("update_inventory_quantity", {
          item_id: item.inventory_id,
          quantity_change: item.quantity,
          location_id: originalTransaction.location_id,
        })
      }

      return { success: true, returnTransaction }
    } catch (error) {
      console.error("Return processing error:", error)
      throw error
    }
  }

  // Helper Methods
  private generateGiftCardNumber(): string {
    return "GC" + Math.random().toString(36).substr(2, 12).toUpperCase()
  }

  private getLoyaltyMultiplier(tier?: string): number {
    switch (tier) {
      case "gold":
        return 2.0
      case "silver":
        return 1.5
      case "bronze":
        return 1.2
      default:
        return 1.0
    }
  }

  private isTaxApplicable(item: any, taxRate: any): boolean {
    // Check if tax applies to this item category
    if (taxRate.categories && taxRate.categories.length > 0) {
      return taxRate.categories.includes(item.category)
    }
    return true
  }

  private calculateCouponDiscount(items: any[], coupon: any): number {
    const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    if (coupon.discount_type === "percentage") {
      return subtotal * (coupon.discount_value / 100)
    } else {
      return Math.min(coupon.discount_value, subtotal)
    }
  }

  private async createLowStockAlert(item: any) {
    await this.supabase.from("inventory_alerts").insert({
      item_id: item.id,
      alert_type: "low_stock",
      message: `${item.name} is running low (${item.quantity_in_stock} remaining)`,
      severity: "warning",
    })
  }

  private generateDefaultReceipt(transaction: any) {
    // Default receipt generation logic
    return {
      header: "RepairHQ",
      transaction: transaction,
      footer: "Thank you for your business!",
    }
  }

  private processReceiptTemplate(transaction: any, template: any) {
    // Process custom receipt template
    return {
      ...template,
      transaction: transaction,
    }
  }
}

// Type Definitions
export interface SplitPayment {
  method: string
  amount: number
  reference?: string
}

export interface LayawayData {
  customer_id: string
  total_amount: number
  deposit_amount: number
  due_date: string
  payment_method: string
  items: any[]
}

export interface GiftCardData {
  amount: number
  customer_id?: string
  expiry_date?: string
}

export interface TaxBreakdown {
  name: string
  rate: number
  amount: number
  taxable_amount: number
}

export const advancedPOSService = new AdvancedPOSService()
