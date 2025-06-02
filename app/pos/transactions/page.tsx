import type { Metadata } from "next"
import TransactionHistoryClient from "./TransactionHistoryClient"
import { createServerSupabaseClient } from "@/lib/supabase-pos"

export const metadata: Metadata = {
  title: "Transaction History - RepairHQ",
  description: "View and manage your POS transactions",
}

async function getTransactions(page = 1, limit = 20) {
  const supabase = createServerSupabaseClient()

  const {
    data: transactions,
    error,
    count,
  } = await supabase
    .from("pos_transactions")
    .select(
      `
      *,
      customer:customers(id, first_name, last_name, email, phone),
      employee:profiles(id, first_name, last_name),
      items:pos_transaction_items(*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], count: 0 }
  }

  return {
    transactions: transactions || [],
    count: count || 0,
  }
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { transactions, count } = await getTransactions(page)

  return <TransactionHistoryClient initialTransactions={transactions} totalCount={count} currentPage={page} />
}
