import type { InvoiceItem } from "@/lib/firestore-types"

export function generateInvoiceNumber(): string {
  const prefix = "INV"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}

export function calculateInvoiceTotals(items: InvoiceItem[], taxRate = 8.5) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  return {
    subtotal,
    tax,
    total,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "sent":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "paid":
      return "bg-green-100 text-green-800 border-green-200"
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate
}

export function getDaysOverdue(dueDate: Date): number {
  const now = new Date()
  const due = new Date(dueDate)
  if (now <= due) return 0

  const diffTime = Math.abs(now.getTime() - due.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "check", label: "Check" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
]

export const invoiceStatuses = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
]
