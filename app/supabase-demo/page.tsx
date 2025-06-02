"use client"

import { useState, useEffect } from "react"
import { supabase, type Customer, type InventoryItem } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Package, Database } from "lucide-react"

export default function SupabaseDemoPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newCustomer, setNewCustomer] = useState({ first_name: "", last_name: "", email: "", phone: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (customersError) throw customersError
      setCustomers(customersData || [])

      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (inventoryError) throw inventoryError
      setInventory(inventoryData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCustomer = async () => {
    if (!newCustomer.first_name || !newCustomer.last_name) return

    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([
          {
            ...newCustomer,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      setNewCustomer({ first_name: "", last_name: "", email: "", phone: "" })
      fetchData() // Refresh data
    } catch (error) {
      console.error("Error adding customer:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-green-600" />
            Supabase Integration Demo
          </h1>
          <p className="text-gray-600">PostgreSQL database with real-time capabilities</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          ✅ Connected to Supabase
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">PostgreSQL records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Stock items tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Type</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PostgreSQL</div>
            <p className="text-xs text-muted-foreground">Relational database</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Customer Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Customer (Supabase)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="First Name"
              value={newCustomer.first_name}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, first_name: e.target.value }))}
            />
            <Input
              placeholder="Last Name"
              value={newCustomer.last_name}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, last_name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <Button onClick={addCustomer} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No customers found</p>
            ) : (
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.email} • {customer.phone}
                      </div>
                    </div>
                    <Badge variant="outline">UUID: {customer.id.slice(0, 8)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No inventory items found</p>
            ) : (
              <div className="space-y-3">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.category} • Stock: {item.quantity_in_stock}
                      </div>
                    </div>
                    <Badge variant="outline">${item.unit_cost}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Migration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Supabase Benefits vs Firebase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Supabase Advantages</h4>
              <ul className="space-y-1 text-sm">
                <li>• Full PostgreSQL with complex queries</li>
                <li>• Real-time subscriptions built-in</li>
                <li>• Row Level Security (RLS)</li>
                <li>• Predictable pricing</li>
                <li>• Open source (no vendor lock-in)</li>
                <li>• Built-in auth & storage</li>
                <li>• SQL joins and aggregations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">⚠️ Firebase Limitations</h4>
              <ul className="space-y-1 text-sm">
                <li>• NoSQL constraints for complex queries</li>
                <li>• Expensive at scale</li>
                <li>• Vendor lock-in</li>
                <li>• Limited aggregation capabilities</li>
                <li>• Complex security rules</li>
                <li>• No SQL joins</li>
                <li>• Document-based limitations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
