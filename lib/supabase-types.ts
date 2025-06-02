export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  business_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  zip_code: string | null
  plan: string | null
  role: string | null
  trial_ends_at: string | null
  is_trial_active: boolean | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  selected_industry_vertical: string | null // Added
  created_at: string | null
  updated_at: string | null
}

export interface Store {
  id: string
  user_id: string
  name: string
  address: string
  city: string | null
  state: string | null
  country: string | null
  zip_code: string | null
  phone: string
  email: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  user_id: string
  store_id: string | null
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  notes: string | null
  total_spent: number | null
  total_repairs: number | null
  loyalty_points: number | null
  custom_fields: Record<string, any> | null // Added
  created_at: string | null
  updated_at: string | null
}

export interface CustomerDevice {
  id: string
  customer_id: string
  user_id: string // To scope by user
  store_id?: string | null
  device_category: string // e.g., "Smartphone", "Laptop", "Vehicle"
  device_name: string // e.g., "iPhone 13 Pro", "Dell XPS 15", "Toyota Camry"
  serial_number?: string | null
  imei?: string | null
  vin?: string | null // For vehicles
  specific_attributes: Record<string, any> | null // JSONB for dynamic fields
  notes?: string | null
  created_at: string
  updated_at: string
}

// MODIFIED to ensure all fields from the form are present
export interface InventoryItem {
  id: string
  user_id: string // Added for user scoping
  store_id?: string | null // Optional store scoping
  name: string
  description?: string | null
  sku: string | null
  item_category?: string | null // Renamed from category
  item_type?: string | null // New
  brand?: string | null
  model?: string | null
  specific_attributes?: Record<string, any> | null // JSONB
  custom_fields?: Record<string, any> | null // JSONB
  quantity_in_stock?: number | null
  min_stock_level?: number | null // Reorder threshold
  max_stock_level?: number | null
  unit_cost?: number | null // Cost to store
  selling_price?: number | null // Price to customer
  supplier_id?: string | null
  supplier_part_number?: string | null
  location?: string | null
  notes?: string | null
  is_active?: boolean | null
  created_at?: string // Supabase handles this by default
  updated_at?: string // Supabase handles this by default
}

export interface Plan {
  id: string
  name: string
  display_name: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
  stripe_price_id_monthly: string
  stripe_price_id_yearly: string | null
  max_stores: number | null
  max_users: number | null
  max_customers: number | null
  max_inventory_items: number | null
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkOrder {
  // Ticket
  id: string
  user_id: string
  store_id: string | null
  customer_id: string
  customer_device_id: string | null // FK to customer_devices
  ticket_number: string
  device_type: string | null
  device_model: string | null
  device_color: string | null
  serial_number: string | null
  imei: string | null

  issue_description: string
  diagnosis: string | null
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "waiting_for_parts"
    | "quote_approved"
    | "quote_rejected"
  priority: "low" | "medium" | "high" | "urgent"
  estimated_cost: number | null
  actual_cost: number | null
  labor_cost: number | null
  parts_cost: number | null
  tax_amount: number | null
  total_amount: number | null
  estimated_completion: string | null
  actual_completion: string | null
  warranty_duration: number | null
  warranty_type: string | null
  warranty_expires_at: string | null
  notes: string | null
  custom_fields: Record<string, any> | null
  service_template_id: string | null
  signature_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  store_id: string | null
  customer_id: string
  work_order_id: string | null
  invoice_number: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  subtotal: number
  tax_amount: number | null
  discount_amount: number | null
  total_amount: number
  paid_amount: number | null
  balance_due: number | null
  due_date: string | null
  paid_date: string | null
  payment_method: string | null
  notes: string | null
  custom_fields: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  user_id: string
  store_id: string
  auth_user_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: "owner" | "manager" | "technician" | "sales" | "admin"
  permissions: string[]
  hourly_rate: number | null
  is_active: boolean
  hire_date: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  store_id: string | null
  customer_id: string
  employee_id: string | null
  title: string
  description: string | null
  start_time: string
  end_time: string
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  type: "repair" | "consultation" | "pickup" | "delivery" | "other"
  reminder_sent: boolean | null
  notes: string | null
  custom_fields: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface ServiceTemplate {
  id: string
  user_id: string
  store_id?: string | null
  name: string
  description: string
  industry_vertical: string
  category_id?: string | null
  default_description?: string | null
  estimated_time_minutes?: number | null
  estimated_cost?: number | null
  required_parts?: Array<{
    item_id?: string
    name: string
    quantity: number
    unit_cost?: number
    selling_price?: number
  }>
  labor_items?: Array<{ description: string; hours: number; rate: number }>
  checklist_items?: Array<{ task: string; completed_by_default?: boolean }>
  notes?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceTemplateCategory {
  id: string
  user_id: string
  store_id?: string | null
  name: string
  industry_vertical: string
  description?: string | null
  created_at: string
  updated_at: string
}
