"use client"

import { useState, useEffect } from "react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  supplier: string
  cost: number
  price: number
  stock: number
  reorder_point: number
  optimal_stock: number
  max_stock: number
  sales_velocity: number
  days_of_supply: number
  last_received: string
  last_sold: string
  status: "healthy" | "low" | "overstock" | "dead" | "critical"
}

interface InventoryMovement {
  id: string
  item_id: string
  item_name: string
  type: "in" | "out"
  quantity: number
  reason: string
  date: string
  user: string
}

interface InventoryForecast {
  id: string
  item_id: string
  item_name: string
  current_stock: number
  forecasted_demand: number
  weeks_of_supply: number
  reorder_recommendation: number
  reorder_date: string
  confidence: number
}

interface InventoryAlert {
  id: string
  type: "low_stock" | "overstock" | "dead_stock" | "expiring" | "price_issue"
  item_id: string
  item_name: string
  message: string
  severity: "high" | "medium" | "low"
  created_at: string
  resolved: boolean
}

interface InventoryCategory {
  id: string
  name: string
  item_count: number
  total_value: number
  avg_turnover: number
}

interface InventorySupplier {
  id: string
  name: string
  item_count: number
  total_value: number
  lead_time: number
}

export default function InventoryHealthDashboard() {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [forecasts, setForecasts] = useState<InventoryForecast[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [categories, setCategories] = useState<InventoryCategory[]>([])
  const [suppliers, setSuppliers] = useState<InventorySupplier[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Supabase queries
      // Simulate data for demo
      
      // Inventory items
      setInventory([
        {
          id: "item-1",
          name: "iPhone 13 Screen",
          sku: "SCR-IPH13-BLK",
          category: "screens",
          supplier: "TechParts Inc.",
          cost: 85.00,
          price: 129.99,
          stock: 24,
          reorder_point: 15,
          optimal_stock: 30,
          max_stock: 45,
          sales_velocity: 3.5,
          days_of_supply: 6.9,
          last_received: "2023-11-01T14:23:45Z",
          last_sold: "2023-11-15T10:15:22Z",
          status: "healthy"
        },
        {
          id: "item-2",
          name: "Samsung Galaxy S21 Battery",
          sku: "BAT-SAMS21",
          category: "batteries",
          supplier: "BatteryWorld",
          cost: 28.50,
          price: 44.99,
          stock: 8,
          reorder_point: 10,
          optimal_stock: 25,
          max_stock: 40,
          sales_velocity: 2.8,
          days_of_supply: 2.9,
          last_received: "2023-10-15T09:12:33Z",
          last_sold: "2023-11-14T16:42:18Z",
          status: "low"
        },
        {
          id: "item-3",
          name: "iPad Pro 12.9 Glass",
          sku: "SCR-IPDP129",
          category: "screens",
          supplier: "ScreenFix Solutions",
          cost: 135.00,
          price: 199.99,
          stock: 15,
          reorder_point: 8,
          optimal_stock: 15,
          max_stock: 25,
          sales_velocity: 1.2,
          days_of_supply: 12.5,
          last_received: "2023-10-20T11:34:21Z",
          last_sold: "2023-11-10T09:34:51Z",
          status: "healthy"
        },
        {
          id: "item-4",
          name: "Google Pixel 6 Charging Port",
          sku: "CHG-PIX6",
          category: "charging_ports",
          supplier: "MobileSupplies Co.",
          cost: 45.00,
          price: 79.99,
          stock: 3,
          reorder_point: 5,
          optimal_stock: 12,
          max_stock: 20,
          sales_velocity: 1.5,
          days_of_supply: 2.0,
          last_received: "2023-10-10T15:22:18Z",
          last_sold: "2023-11-13T11:27:33Z",
          status: "critical"
        },
        {
          id: "item-5",
          name: "MacBook Pro Keyboard",
          sku: "KEY-MBP-2021",
          category: "keyboards",
          supplier: "ChipTech Components",
          cost: 95.00,
          price: 149.99,
          stock: 8,
          reorder_point: 5,
          optimal_stock: 10,
          max_stock: 15,
          sales_velocity: 0.9,
          days_of_supply: 8.9,
          last_received: "2023-10-05T13:45:56Z",
          last_sold: "2023-11-08T14:23:45Z",
          status: "healthy"
        },
        {
          id: "item-6",
          name: "iPhone 12 Charging Port",
          sku: "CHG-IPH12",
          category: "charging_ports",
          supplier: "TechParts Inc.",
          cost: 42.00,
          price: 74.99,
          stock: 22,
          reorder_point: 10,
          optimal_stock: 20,
          max_stock: 30,
          sales_velocity: 2.1,
          days_of_supply: 10.5,
          last_received: "2023-10-25T10:15:22Z",
          last_sold: "2023-11-12T09:12:33Z",
          status: "overstock"
        },
        {
          id: "item-7",
          name: "Samsung Galaxy Tab Screen",
          sku: "SCR-SAMTAB",
          category: "screens",
          supplier: "ScreenFix Solutions",
          cost: 75.00,
          price: 119.99,
          stock: 12,
          reorder_point: 8,
          optimal_stock: 15,
          max_stock: 25,
          sales_velocity: 0.8,
          days_of_supply: 15.0,
          last_received: "2023-09-15T11:34:21Z",
          last_sold: "2023-11-05T15:22:18Z",
          status: "healthy"
        },
        {
          id: "item-8",
          name: "MacBook Air Trackpad",
          sku: "TRK-MBA-2022",
          category: "trackpads",
          supplier: "ChipTech Components",
          cost: 65.00,
          price: 99.99,
          stock: 2,
          reorder_point: 3,
          optimal_stock: 8,
          max_stock: 12,
          sales_velocity: 0.7,
          days_of_supply: 2.9,
          last_received: "2023-09-28T13:45:56Z",
          last_sold: "2023-11-11T14:23:45Z",
          status: "low"
        },
        {
          id: "item-9",
          name: "Google Pixel 5 Screen",
          sku: "SCR-PIX5",
          category: "screens",
          supplier: "ScreenFix Solutions",
          cost: 65.00,
          price: 99.99,
          stock: 14,
          reorder_point: 10,
          optimal_stock: 20,
          max_stock: 30,
          sales_velocity: 0.3,
          days_of_supply: 46.7,
          last_received: "2023-08-10T10:15:22Z",
          last_sold: "2023-10-20T09:12:33Z",
          status: "dead"
        },
        {
          id: "item-10",
          name: "iPhone 11 Battery",
          sku: "BAT-IPH11",
          category: "batteries",
          supplier: "BatteryWorld",
          cost: 25.00,
          price: 39.99,
          stock: 35,
          reorder_point: 15,
          optimal_stock: 25,
          max_stock: 40,
          sales_velocity: 2.5,
          days_of_supply: 14.0,
          last_received: "2023-10-18T11:34:21Z",
          last_sold: "2023-11-14T15:22:18Z",
          status: "overstock"
        }
      ])
      
      // Inventory movements
      setMovements([
        {
          id: "mov-1",
          item_id: "item-1",
          item_name: "iPhone 13 Screen",
          type: "in",
          quantity: 10,
          reason: "Purchase Order #12345",
          date: "2023-11-01T14:23:45Z",
          user: "John Doe"
        },
        {
          id: "mov-2",
          item_id: "item-1",
          item_name: "iPhone 13 Screen",
          type: "out",
          quantity: 1,
          reason: "Sale #67890",
          date: "2023-11-15T10:15:22Z",
          user: "System"
        },
        {
          id: "mov-3",
          item_id: "item-2",
          item_name: "Samsung Galaxy S21 Battery",
          type: "out",
          quantity: 1,
          reason: "Sale #67891",
          date: "2023-11-14T16:42:18Z",
          user: "System"
        },
        {
          id: "mov-4",
          item_id: "item-4",
          item_name: "Google Pixel 6 Charging Port",
          type: "out",
          quantity: 1,
          reason: "Sale #67892",
          date: "2023-11-13T11:27:33Z",
          user: "System"
        },
        {
          id: "mov-5",
          item_id: "item-6",
          item_name: "iPhone 12 Charging Port",
          type: "in",
          quantity: 15,
          reason: "Purchase Order #12346",
          date: "2023-10-25T10:15:22Z",
          user: "Jane Smith"
        }
      ])
      
      // Inventory forecasts
      setForecasts([
        {
          id: "for-1",
          item_id: "item-1",
          item_name: "iPhone 13 Screen",
          current_stock: 24,
          forecasted_demand: 14,
          weeks_of_supply: 1.7,
          reorder_recommendation: 20,
          reorder_date: "2023-11-22T00:00:00Z",
          confidence: 85
        },
        {
          id: "for-2",
          item_id: "item-2",
          item_name: "Samsung Galaxy S21 Battery",
          current_stock: 8,
          forecasted_demand: 11,
          weeks_of_supply: 0.7,
          reorder_recommendation: 28,
          reorder_date: "2023-11-16T00:00:00Z",
          confidence: 92
        },
        {
          id: "for-3",
          item_id: "item-3",
          item_name: "iPad Pro 12.9 Glass",
          current_stock: 15,
          forecasted_demand: 5,
          weeks_of_supply: 3.0,
          reorder_recommendation: 5,
          reorder_date: "2023-12-05T00:00:00Z",
          confidence: 78
        },
        {
          id: "for-4",
          item_id: "item-4",
          item_name: "Google Pixel 6 Charging Port",
          current_stock: 3,
          forecasted_demand: 6,
          weeks_of_supply: 0.5,
          reorder_recommendation: 15,
          reorder_date: "2023-11-15T00:00:00Z",
          confidence: 88
        },
        {
          id: "for-5",
          item_id: "item-5",
          item_name: "MacBook Pro Keyboard",
          current_stock: 8,
          forecasted_demand: 4,
          weeks_of_supply: 2.0,
          reorder_recommendation: 7,
          reorder_date: "2023-11-29T00:00:00Z",
          confidence: 75
        }
      ])
      
      // Inventory alerts
      setAlerts([
        {
          id: "alert-1",
          type: "low_stock",
          item_id: "item-2",
          item_name: "Samsung Galaxy S21 Battery",
          message: "Stock below reorder point. Current: 8, Reorder Point: 10",
          severity: "medium",
          created_at: "2023-11-10T09:12:33Z",
          resolved: false
        },
        {
          id: "alert-2",
          type: "critical",
          item_id: "item-4",
          item_name: "Google Pixel 6 Charging Port",
          message: "Critical stock level. Current: 3, Reorder Point: 5",
          severity: "high",
          created_at: "2023-11-12T15:22:18Z",
          resolved: false
        },
        {
          id: "alert-3",
          type: "overstock",
          item_id: "item-6",
          item_name: "iPhone 12 Charging Port",
          message: "Stock above maximum level. Current: 22, Max: 20",
          severity: "low",
          created_at: "2023-10-26T10:15:22Z",
          resolved: false
        },
        {
          id: "alert-4",
          type: "dead_stock",
          item_id: "item-9",
          item_name: "Google Pixel 5 Screen",
          message: "No sales in the last 30 days. Consider discounting.",
          severity: "medium",
          created_at: "2023-11-05T13:45:56Z",
          resolved: false
        },
        {
          id: "alert-5",
          type: "price_issue",
          item_id: "item-10",
          item_name: "iPhone 11 Battery",
          message: "Price below market average. Consider price adjustment.",
          severity: "low",
          created_at: "2023-11-01T11:34:21Z",
          resolved: true
        }
      ])
      
      // Categories
      setCategories([
        {
          id: "cat-1",
          name: "screens",
          item_count: 4,
          total_value: 3245.75,
          avg_turnover: 1.95
        },
        {
          id: "cat-2",
          name: "batteries",
          item_count: 2,
          total_value: 1103.25,
          avg_turnover: 2.65
        },
        {
          id: "cat-3",
          name: "charging_ports",
          item_count: 2,
          total_value: 1079.85,
          avg_turnover: 1.80
        },
        {
          id: "cat-4",
          name: "keyboards",
          item_count: 1,
          total_value: 760.00,
          avg_turnover: 0.90
        },
        {
          id: "cat-5",
          name: "trackpads",\
