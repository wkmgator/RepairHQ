"use client"

import type React from "react"
import CustomerForm from "@/components/customers/customer-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: "",
    customer_type: "individual",
    company_name: "",
    tax_id: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const customerData = {
        ...formData,
        user_id: user.id,
        total_spent: 0,
        total_repairs: 0,
        loyalty_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("customers").insert(customerData).select().single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Customer created successfully!",
      })

      router.push(`/customers/${data.id}`)
    } catch (error) {
      console.error("Error creating customer:", error)
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
          <CardDescription>Fill in the details below to create a new customer profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
