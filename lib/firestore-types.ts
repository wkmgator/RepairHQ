import type { Timestamp } from "firebase/firestore"

export interface UserProfile {
  userId: string
  email: string
  firstName: string
  lastName: string
  businessName: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  plan: "starter" | "professional" | "enterprise" | "franchise"
  trialEndsAt: Date | Timestamp
  isTrialActive: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Store {
  storeId: string
  userId: string
  name: string
  address: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  phone: string
  email: string
  isDefault: boolean
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Customer {
  customerId: string
  userId: string
  storeId: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  notes?: string
  totalSpent: number
  lastVisit?: Date | Timestamp
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Ticket {
  ticketId: string
  userId: string
  storeId: string
  customerId: string
  deviceType: string
  deviceModel: string
  deviceColor?: string
  serialNumber?: string
  issueDescription: string
  diagnosis?: string
  status: "pending" | "in_progress" | "completed" | "cancelled" | "waiting_for_parts"
  priority: "low" | "medium" | "high" | "urgent"
  estimatedCost: number
  actualCost?: number
  laborCost: number
  partsCost: number
  taxAmount: number
  totalAmount: number
  estimatedCompletion?: Date | Timestamp
  actualCompletion?: Date | Timestamp
  warranty?: {
    duration: number // days
    type: "parts" | "labor" | "full"
    expiresAt: Date | Timestamp
  }
  notes?: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Invoice {
  invoiceId: string
  userId: string
  storeId: string
  customerId: string
  ticketId?: string
  invoiceNumber: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paidAmount: number
  balanceDue: number
  dueDate: Date | Timestamp
  paidDate?: Date | Timestamp
  paymentMethod?: "cash" | "card" | "check" | "bank_transfer" | "other"
  items: InvoiceItem[]
  notes?: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface InvoiceItem {
  itemId: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  type: "service" | "part" | "labor" | "other"
}

export interface InventoryItem {
  itemId: string
  userId: string
  storeId: string
  name: string
  description?: string
  sku: string
  category: string
  brand?: string
  model?: string
  costPrice: number
  sellingPrice: number
  quantity: number
  minStockLevel: number
  maxStockLevel?: number
  location?: string
  supplier?: string
  supplierPartNumber?: string
  notes?: string
  isActive: boolean
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Appointment {
  appointmentId: string
  userId: string
  storeId: string
  customerId: string
  title: string
  description?: string
  startTime: Date | Timestamp
  endTime: Date | Timestamp
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  type: "repair" | "consultation" | "pickup" | "delivery" | "other"
  assignedTo?: string // employee ID
  reminderSent: boolean
  notes?: string
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface Employee {
  employeeId: string
  userId: string
  storeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: "owner" | "manager" | "technician" | "sales" | "admin"
  permissions: string[]
  hourlyRate?: number
  isActive: boolean
  hireDate: Date | Timestamp
  createdAt: Date | Timestamp
  updatedAt: Date | Timestamp
}

export interface User {
  userId: string
  email: string
  displayName?: string
  businessName?: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  planName: string
  trialEndsAt: Timestamp
  isTrialActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
