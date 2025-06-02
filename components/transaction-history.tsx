"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseClient } from "@/lib/supabase-pos"
import { useToast } from "@/components/ui/use-toast"
import { Search, ChevronLeft, ChevronRight, Calendar, Download, Printer, Eye, RefreshCw } from "lucide-react"

interface Transaction {
  id: string
  transaction_number: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  payment_method: string
  payment_status: string
  created_at: string
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
  } | null
  employee: {
    id: string
    first_name: string
    last_name: string
  } | null
  items: Array<{
    id: string
    name: string
    quantity: number
    unit_price: number
    total: number
  }>
}

interface TransactionHistoryProps {
  initialTransactions: Transaction[]
  totalCount: number
  currentPage: number
}

export default function TransactionHistory({ initialTransactions, totalCount, currentPage }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const limit = 20
  const totalPages = Math.ceil(totalCount / limit)

  const handleSearch = async () => {
    try {
      setIsLoading(true)

      let query = supabase
        .from("pos_transactions")
        .select(`
          *,
          customer:customers(id, first_name, last_name, email, phone),
          employee:profiles(id, first_name, last_name),
          items:pos_transaction_items(*)
        `)
        .order("created_at", { ascending: false })

      if (searchQuery) {
        query = query.or(
          `transaction_number.ilike.%${searchQuery}%,customer.first_name.ilike.%${searchQuery}%,customer.last_name.ilike.%${searchQuery}%,customer.email.ilike.%${searchQuery}%,customer.phone.ilike.%${searchQuery}%`,
        )
      }

      if (dateRange.start) {
        query = query.gte("created_at", `${dateRange.start}T00:00:00`)
      }

      if (dateRange.end) {
        query = query.lte("created_at", `${dateRange.end}T23:59:59`)
      }

      const { data, error } = await query.range(0, limit - 1)

      if (error) throw error

      setTransactions(data || [])

      // Reset to first page
      if (currentPage !== 1) {
        router.push(pathname)
      }
    } catch (error) {
      console.error("Error searching transactions:", error)
      toast({
        title: "Search Error",
        description: "Failed to search transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </svg>
        )
      case "card":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
        )
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/pos">New Transaction</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Transactions</CardTitle>
          <CardDescription>Search by transaction number, customer name, email, or phone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Transaction</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Customer</th>
                  <th className="p-2 text-right font-medium">Amount</th>
                  <th className="p-2 text-center font-medium">Payment</th>
                  <th className="p-2 text-center font-medium">Status</th>
                  <th className="p-2 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-2">
                        <div className="font-medium">{transaction.transaction_number}</div>
                        <div className="text-xs text-muted-foreground">{transaction.items.length} items</div>
                      </td>
                      <td className="p-2 text-sm">{formatDate(transaction.created_at)}</td>
                      <td className="p-2">
                        {transaction.customer ? (
                          <div>
                            <div className="font-medium">
                              {transaction.customer.first_name} {transaction.customer.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">{transaction.customer.phone}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Guest</span>
                        )}
                      </td>
                      <td className="p-2 text-right font-medium">{formatCurrency(transaction.total_amount)}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center">
                          {getPaymentMethodIcon(transaction.payment_method)}
                          <span className="ml-1 text-xs capitalize">{transaction.payment_method}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={getStatusBadgeVariant(transaction.payment_status)}>
                          {transaction.payment_status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center space-x-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/pos/transactions/${transaction.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Transaction</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Customer</th>
                  <th className="p-2 text-right font-medium">Amount</th>
                  <th className="p-2 text-center font-medium">Payment</th>
                  <th className="p-2 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter((t) => t.payment_status === "completed").length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No completed transactions found
                    </td>
                  </tr>
                ) : (
                  transactions
                    .filter((t) => t.payment_status === "completed")
                    .map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{transaction.transaction_number}</div>
                          <div className="text-xs text-muted-foreground">{transaction.items.length} items</div>
                        </td>
                        <td className="p-2 text-sm">{formatDate(transaction.created_at)}</td>
                        <td className="p-2">
                          {transaction.customer ? (
                            <div>
                              <div className="font-medium">
                                {transaction.customer.first_name} {transaction.customer.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">{transaction.customer.phone}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Guest</span>
                          )}
                        </td>
                        <td className="p-2 text-right font-medium">{formatCurrency(transaction.total_amount)}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            {getPaymentMethodIcon(transaction.payment_method)}
                            <span className="ml-1 text-xs capitalize">{transaction.payment_method}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/pos/transactions/${transaction.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="refunded">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Transaction</th>
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Customer</th>
                  <th className="p-2 text-right font-medium">Amount</th>
                  <th className="p-2 text-center font-medium">Payment</th>
                  <th className="p-2 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter((t) => t.payment_status === "refunded").length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No refunded transactions found
                    </td>
                  </tr>
                ) : (
                  transactions
                    .filter((t) => t.payment_status === "refunded")
                    .map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{transaction.transaction_number}</div>
                          <div className="text-xs text-muted-foreground">{transaction.items.length} items</div>
                        </td>
                        <td className="p-2 text-sm">{formatDate(transaction.created_at)}</td>
                        <td className="p-2">
                          {transaction.customer ? (
                            <div>
                              <div className="font-medium">
                                {transaction.customer.first_name} {transaction.customer.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">{transaction.customer.phone}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Guest</span>
                          )}
                        </td>
                        <td className="p-2 text-right font-medium">{formatCurrency(transaction.total_amount)}</td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            {getPaymentMethodIcon(transaction.payment_method)}
                            <span className="ml-1 text-xs capitalize">{transaction.payment_method}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/pos/transactions/${transaction.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount}{" "}
            transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
