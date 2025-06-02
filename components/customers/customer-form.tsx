"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { customerFormSchema, type CustomerFormData } from "@/lib/customer-schema"
import { addCustomer, updateCustomer } from "@/app/customers/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/supabase-types"
import { useEffect } from "react"

type Customer = Database["public"]["Tables"]["customers"]["Row"]

interface CustomerFormProps {
  customer?: Customer | null // For editing
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (customer) {
      form.reset({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zip_code: customer.zip_code || "",
        notes: customer.notes || "",
      })
    }
  }, [customer, form])

  async function onSubmit(values: CustomerFormData) {
    let result
    if (customer) {
      // Update existing customer
      result = await updateCustomer(customer.id, values)
    } else {
      // Add new customer
      result = await addCustomer(values)
    }

    if (result.success) {
      toast({
        title: customer ? "Customer Updated" : "Customer Added",
        description: `${values.first_name} ${values.last_name} has been ${customer ? "updated" : "added"} successfully.`,
      })
      router.push("/customers")
      router.refresh() // Ensure the customer list is updated
    } else {
      toast({
        title: "Error",
        description: result.error || `Failed to ${customer ? "update" : "add"} customer.`,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>
                <FormControl>
                  <Input placeholder="CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip / Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any relevant notes about the customer..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? customer
              ? "Updating..."
              : "Adding..."
            : customer
              ? "Save Changes"
              : "Add Customer"}
        </Button>
      </form>
    </Form>
  )
}
