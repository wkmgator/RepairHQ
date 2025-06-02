"use client"
import type { InventoryItem } from "@/lib/supabase-types"

import InventoryManager from "@/components/inventory/inventory-manager"

const ITEMS_PER_PAGE = 10

const initialNewItemFormState: Partial<InventoryItem> = {
  name: "",
  sku: "",
  quantity_in_stock: 0,
  selling_price: 0,
  unit_cost: 0,
  item_category: "",
  min_stock_level: 3,
  description: "",
  item_type: "",
  brand: "",
  model: "",
  is_active: true,
}

interface InventoryAnalytics {
  topStockedItems: InventoryItem[]
  lowMarginItems: InventoryItem[]
  totalInventoryValue: number
  averageMargin: number
}

const initialAnalyticsState: InventoryAnalytics = {
  topStockedItems: [],
  lowMarginItems: [],
  totalInventoryValue: 0,
  averageMargin: 0,
}

export default function InventoryPage() {
  return <InventoryManager />
}
