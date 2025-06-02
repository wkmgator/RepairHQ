"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getCustomers } from "./actions"
import CustomerListClient from "@/components/customers/customer-list-client"
import { PlusCircle } from "lucide-react"

export default function CustomersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const customersPerPage = 10

  const [customers, setCustomers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await getCustomers()
      if (error) {
        setError(error.message)
      } else {
        setCustomers(data)
      }
      setIsLoading(false)
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    setFilteredCustomers(customers)
    setTotalCustomers(customers.length)
  }, [customers])

  const totalPages = Math.ceil(totalCustomers / customersPerPage)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading customers: {error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button asChild>
          <Link href="/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Customer
          </Link>
        </Button>
      </div>
      <CustomerListClient customers={customers} />
    </div>
  )
}
