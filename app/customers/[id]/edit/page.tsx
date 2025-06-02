"use client"
import CustomerForm from "@/components/customers/customer-form"
import { getCustomerById } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const { customer, error } = await getCustomerById(params.id)

  if (error) {
    return <div className="p-4 text-red-500">Error loading customer for editing: {error}</div>
  }

  if (!customer) {
    return <div className="p-4">Customer not found.</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/customers/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customer Profile
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            Edit Customer: {customer.first_name} {customer.last_name}
          </CardTitle>
          <CardDescription>Update the customer's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerForm customer={customer} />
        </CardContent>
      </Card>
    </div>
  )
}
