"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, Eye } from "lucide-react"
import type { Database } from "@/lib/supabase-types"

type Customer = Database["public"]["Tables"]["customers"]["Row"]

interface CustomerListClientProps {
  customers: Customer[]
}

export default function CustomerListClient({ customers }: CustomerListClientProps) {
  if (!customers || customers.length === 0) {
    return (
      <p>
        No customers found.{" "}
        <Link href="/customers/new" className="text-blue-600 hover:underline">
          Add your first customer!
        </Link>
      </p>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                {customer.first_name} {customer.last_name}
              </TableCell>
              <TableCell>{customer.email || "-"}</TableCell>
              <TableCell>{customer.phone || "-"}</TableCell>
              <TableCell>{customer.city || "-"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link href={`/customers/${customer.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                {/* Delete button can be added here with a confirmation dialog */}
                {/* <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)} disabled>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
